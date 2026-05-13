import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "@/hooks/use-locale";

type ContentEntry = {
  page?: string;
  section?: string;
  key?: string;
  value?: string;
};

type ContentMap = Record<string, string>;

const toContentKey = (section: string, key: string) => `${section}.${key}`;

const flattenNestedObject = (value: unknown, prefix = ""): ContentMap => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce<ContentMap>(
    (acc, [key, nested]) => {
      const nextKey = prefix ? `${prefix}.${key}` : key;
      if (typeof nested === "string") {
        acc[nextKey] = nested;
        return acc;
      }

      return { ...acc, ...flattenNestedObject(nested, nextKey) };
    },
    {}
  );
};

const parseContentPayload = (payload: unknown): ContentMap => {
  if (!payload) {
    return {};
  }

  if (Array.isArray(payload)) {
    return payload.reduce<ContentMap>((acc, item) => {
      const entry = item as ContentEntry;
      if (!entry.section || !entry.key || typeof entry.value !== "string") {
        return acc;
      }
      acc[toContentKey(entry.section, entry.key)] = entry.value;
      return acc;
    }, {});
  }

  if (typeof payload === "object") {
    const maybeObject = payload as Record<string, unknown>;
    if (maybeObject.content && typeof maybeObject.content === "object" && !Array.isArray(maybeObject.content)) {
      return flattenNestedObject(maybeObject.content);
    }

    if (Array.isArray(maybeObject.content)) {
      return parseContentPayload(maybeObject.content);
    }

    // Supports either flat keys ("hero.title") or nested objects ({ hero: { title: "..." } }).
    const flattened = flattenNestedObject(maybeObject);
    if (Object.keys(flattened).length > 0) {
      return flattened;
    }
  }

  return {};
};

export const usePageContent = (page: string) => {
  const [content, setContent] = useState<ContentMap>({});
  const locale = useLocale();

  useEffect(() => {
    let cancelled = false;

    const loadContent = async () => {
      try {
        const response = await fetch(
          `/api/content?page=${encodeURIComponent(page)}&locale=${encodeURIComponent(locale)}`,
          {
          credentials: "include",
          }
        );

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as unknown;
        if (!cancelled) {
          setContent(parseContentPayload(payload));
        }
      } catch {
        // Ignore request errors and keep fallback text from the components.
      }
    };

    void loadContent();

    return () => {
      cancelled = true;
    };
  }, [page, locale]);

  const getText = useCallback(
    (section: string, key: string, fallback: string) =>
      content[toContentKey(section, key)] ?? fallback,
    [content]
  );

  const getLines = useCallback(
    (section: string, key: string, fallback: string[]) => {
      const rawValue = content[toContentKey(section, key)];
      if (!rawValue) {
        return fallback;
      }

      const splitLines = rawValue
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      return splitLines.length > 0 ? splitLines : fallback;
    },
    [content]
  );

  const updateText = useCallback(
    async (section: string, key: string, value: string) => {
      const response = await fetch(
        `/api/admin/content/${encodeURIComponent(page)}/${encodeURIComponent(section)}/${encodeURIComponent(key)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ value, locale }),
        }
      );

      if (!response.ok) {
        let message = "Failed to save content";
        try {
          const err = (await response.json()) as { error?: string };
          if (typeof err?.error === "string" && err.error.trim()) {
            message = err.error.trim();
          }
        } catch {
          /* ignore non-JSON error bodies */
        }
        throw new Error(message);
      }

      setContent((previous) => ({
        ...previous,
        [toContentKey(section, key)]: value,
      }));
    },
    [page, locale]
  );

  return useMemo(
    () => ({
      content,
      getText,
      getLines,
      updateText,
    }),
    [content, getText, getLines, updateText]
  );
};
