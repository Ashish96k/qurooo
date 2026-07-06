import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--shadow-panel)]",
        className,
      )}
      {...props}
    />
  );
}
