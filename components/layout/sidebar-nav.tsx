"use client";

import {
  BarChart3,
  Check,
  Crown,
  FolderOpen,
  History,
  LayoutGrid,
  LayoutTemplate,
  Moon,
  Settings,
  Sun,
} from "lucide-react";

import { cn } from "@/lib/cn";

import { QuroooLogo } from "./qurooo-logo";

interface NavItem {
  label: string;
  icon: typeof LayoutGrid;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "Create", icon: LayoutGrid, active: true },
  { label: "Templates", icon: LayoutTemplate },
  { label: "My Creations", icon: FolderOpen },
  { label: "History", icon: History },
  { label: "Analytics", icon: BarChart3, disabled: true, badge: "Soon" },
  { label: "Settings", icon: Settings },
];

const proPerks = ["More styles", "Custom frames", "Advanced options"];

export function SidebarNav() {
  return (
    <aside className="hidden w-[224px] shrink-0 flex-col justify-between border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] px-4 py-6 lg:flex">
      <div className="space-y-8">
        <div className="flex items-center">
          <QuroooLogo height={30} priority />
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                disabled={item.disabled}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
                  item.active
                    ? "bg-[var(--nav-active-bg)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-soft)]",
                  item.disabled && "cursor-not-allowed opacity-60 hover:bg-transparent",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    item.active
                      ? "bg-[var(--nav-icon-gradient)] text-white shadow-[0_8px_16px_rgba(56,189,248,0.28)]"
                      : "bg-[var(--bg-soft)] text-[var(--text-muted)]",
                  )}
                >
                  <Icon size={16} strokeWidth={2.25} />
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-[var(--bg-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4">
        <div
          className="relative overflow-hidden rounded-2xl p-4 text-white shadow-[0_18px_36px_rgba(124,92,252,0.28)]"
          style={{ background: "var(--pro-gradient)" }}
        >
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Crown size={16} />
          </div>
          <p className="text-sm font-bold">Unlock Pro</p>
          <ul className="mt-2 space-y-1.5">
            {proPerks.map((perk) => (
              <li key={perk} className="flex items-center gap-1.5 text-xs text-white/90">
                <Check size={12} strokeWidth={3} />
                {perk}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-3 w-full rounded-full bg-white py-2 text-xs font-bold text-[#6c3ce0] transition hover:bg-white/90"
          >
            Go Pro
          </button>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="Light theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] shadow-sm transition hover:text-[var(--text-primary)]"
          >
            <Sun size={15} />
          </button>
          <button
            type="button"
            aria-label="Dark theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] shadow-sm transition hover:text-[var(--text-primary)]"
          >
            <Moon size={15} />
          </button>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)]">
          Made with <span className="text-[var(--accent-pink)]">♥</span> for creators
        </p>
      </div>
    </aside>
  );
}
