import type { ReactNode } from "react";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";

/** Wraps a marketing page so public site can render saved canvas layout when present. */
export function MarketingRoute({
  contentPage,
  children,
}: {
  contentPage: string;
  children: ReactNode;
}) {
  return <MarketingPageShell contentPage={contentPage}>{children}</MarketingPageShell>;
}
