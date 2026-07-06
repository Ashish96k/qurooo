"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/cn";

interface TabItem<T extends string> {
  value: T;
  label: string;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
  layoutId?: string;
}

export function Tabs<T extends string>({
  className,
  items,
  layoutId = "tabs-indicator",
  onValueChange,
  value,
}: TabsProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex w-full flex-wrap gap-2 rounded-[calc(var(--radius-panel)-10px)] border border-[var(--border-subtle)] bg-[var(--bg-soft)] p-1.5",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onValueChange(item.value)}
            className="relative flex-1 rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition"
          >
            {isActive ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-[var(--radius-control)] bg-white shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 24,
                }}
              />
            ) : null}
            <span
              className={cn(
                "relative z-10",
                isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]",
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
