import type { ReactNode } from "react";
import { CmsText } from "@/components/edit-mode/CmsText";
import { usePageEditing } from "@/hooks/use-page-editing";
import { applyCmsDefaults } from "@/pages/apply/apply-cms-defaults";
import { useLocale } from "@/hooks/use-locale";

type TextTag = "span" | "p" | "h1" | "h2" | "h3" | "h4";

export function useApplyCms() {
  const locale = useLocale();
  const editing = usePageEditing("apply");
  const defaults = locale === "bg" ? applyCmsDefaults.bg : applyCmsDefaults.en;

  const copy = (flatKey: string) => {
    const [section, key] = flatKey.split(".") as [string, string];
    return editing.getText(section, key, defaults[flatKey as keyof typeof defaults] ?? flatKey);
  };

  const Txt = ({
    k,
    as = "span",
    className,
    multiline,
    rows,
  }: {
    k: keyof typeof applyCmsDefaults.en | `steps.${0 | 1 | 2 | 3}`;
    as?: TextTag;
    className?: string;
    multiline?: boolean;
    rows?: number;
  }) => {
    const [section, key] = k.split(".") as [string, string];
    const fallback = defaults[k as keyof typeof defaults] ?? k;
    return (
      <CmsText
        as={as}
        multiline={multiline}
        rows={rows}
        {...editing.bind(section, key, fallback)}
        className={className}
      />
    );
  };

  return { ...editing, copy, Txt, defaults };
}

export function ApplyCmsProvider({ children }: { children: (ctx: ReturnType<typeof useApplyCms>) => ReactNode }) {
  const ctx = useApplyCms();
  return <>{children(ctx)}</>;
}
