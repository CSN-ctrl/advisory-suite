import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GoldDashItemProps {
  children: ReactNode;
  className?: string;
  dashClassName?: string;
}

/** Paragraph row with a prominent gold dash — used on Home, About, and similar pages. */
export function GoldDashItem({ children, className, dashClassName }: GoldDashItemProps) {
  return (
    <div className={cn("flex items-start gap-4 text-muted-foreground font-body", className)}>
      <span className={cn("mt-3 h-1 w-14 flex-shrink-0 rounded-full bg-accent", dashClassName)} aria-hidden />
      <div className="min-w-0 flex-1 leading-relaxed">{children}</div>
    </div>
  );
}
