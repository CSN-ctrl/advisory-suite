import { createContext, useContext, type ReactNode } from "react";
import type { MarketingBlockLayout } from "@/lib/marketing-block-layout";

type MarketingLayoutContextValue = {
  active: boolean;
  contentPage: string;
  getBlock: (blockId: string) => MarketingBlockLayout | undefined;
};

const MarketingLayoutContext = createContext<MarketingLayoutContextValue | null>(null);

export function MarketingLayoutProvider({
  contentPage,
  layout,
  active,
  children,
}: {
  contentPage: string;
  layout: Map<string, MarketingBlockLayout>;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <MarketingLayoutContext.Provider
      value={{
        active,
        contentPage,
        getBlock: (blockId) => layout.get(blockId),
      }}
    >
      {children}
    </MarketingLayoutContext.Provider>
  );
}

export function useMarketingLayoutOptional() {
  return useContext(MarketingLayoutContext);
}

export function useMarketingBlockLayout(blockId: string): MarketingBlockLayout | undefined {
  const ctx = useMarketingLayoutOptional();
  if (!ctx?.active) return undefined;
  return ctx.getBlock(blockId);
}

/** Props to spread on marketing page `<main>` when block reordering is active. */
export function useMarketingMainLayoutProps(): { className?: string } {
  const ctx = useMarketingLayoutOptional();
  if (!ctx?.active) return {};
  return { className: "flex flex-col" };
}
