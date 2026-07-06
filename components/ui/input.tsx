import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-white px-4 text-sm text-[var(--text-primary)] shadow-[0_8px_24px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)]/45 focus:ring-4 focus:ring-[var(--accent-primary)]/10",
        className,
      )}
      {...props}
    />
  );
}
