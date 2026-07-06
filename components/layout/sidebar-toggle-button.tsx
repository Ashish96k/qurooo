"use client";

import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/cn";

import { useSidebar } from "./sidebar-context";

export function SidebarToggleButton() {
  const { isExpanded, shellPhase, toggle } = useSidebar();
  const isAnimating = shellPhase !== "idle";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isAnimating}
      aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      aria-expanded={isExpanded}
      aria-busy={isAnimating}
      className="qurooo-sidebar-toggle-hit touch-manipulation"
    >
      <span className="qurooo-sidebar-toggle-face">
        <ChevronLeft
          size={14}
          strokeWidth={2.5}
          data-collapsed={!isExpanded}
          className={cn("qurooo-sidebar-toggle-icon")}
        />
      </span>
    </button>
  );
}
