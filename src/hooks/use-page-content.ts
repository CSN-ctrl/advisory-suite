import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "@/hooks/use-locale";
import { getSupabaseBrowserClient } from "@/integrations/supabase/client";

type ContentMap = Record<string, string>;

const toContentKey = (section: string, key: string) => `${section}.${key}`;

export const usePageContent = (page: string) => {
  const [content, setContent] = useState<ContentMap>({});
  const locale = useLocale();

  useEffect(() => {
    let cancelled = false;

    const loadContent = async () => {
      try {
        const sb = getSupabaseBrowserClient();
        const loc = locale === "bg" ? "bg" : "en";
        const { data, error } = await sb
          .from("site_content")
          .select("section, key, value")
          .eq("page", page)
          .eq("locale", loc);

        if (error || cancelled) {
          return;
        }

        const map: ContentMap = {};
        for (const row of data ?? []) {
          const r = row as { section?: string; key?: string; value?: string | null };
          if (r.section && r.key && typeof r.value === "string") {
            map[toContentKey(r.section, r.key)] = r.value;
          }
        }
        if (!cancelled) {
          setContent(map);
        }
      } catch {
        /* keep fallbacks */
      }
    };

    void loadContent();

    return () => {
      cancelled = true;
    };
  }, [page, locale]);

  const getText = useCallback(
    (section: string, key: string, fallback: string) => content[toContentKey(section, key)] ?? fallback,
    [content],
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
    [content],
  );

  const updateText = useCallback(
    async (section: string, key: string, value: string) => {
      const sb = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await sb.auth.getUser();
      const updatedBy = user?.email?.trim().slice(0, 128) || "admin";
      const loc = locale === "bg" ? "bg" : "en";

      const { error } = await sb.from("site_content").upsert(
        {
          page,
          section,
          key,
          locale: loc,
          value,
          updated_by: updatedBy,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "page,section,key,locale" },
      );

      if (error) {
        throw new Error(error.message || "Failed to save content");
      }

      setContent((previous) => ({
        ...previous,
        [toContentKey(section, key)]: value,
      }));
    },
    [page, locale],
  );

  return useMemo(
    () => ({
      content,
      getText,
      getLines,
      updateText,
    }),
    [content, getText, getLines, updateText],
  );
};
