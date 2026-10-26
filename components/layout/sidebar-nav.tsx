"use client";

import {
  BarChart3,
  Crown,
  FolderOpen,
  History,
  LayoutTemplate,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/cn";

import { QuroooMark } from "./qurooo-logo";
import { useSidebar } from "./sidebar-context";

interface NavItem {
  label: string;
  icon?: LucideIcon;
  useLogoMark?: boolean;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "Create", useLogoMark: true, active: true },
  { label: "Templates", icon: LayoutTemplate },
  { label: "My Creations", icon: FolderOpen },
  { label: "History", icon: History },
  { label: "Analytics", icon: BarChart3, disabled: true, badge: "Soon" },
  { label: "Settings", icon: Settings },
];

const proPerks = ["More styles", "Custom frames", "Advanced options"];

const NAV_ICON_SIZE = 20;
const NAV_ICON_SIZE_COMPACT = 18;

function NavItemIcon({ compact, item }: { compact: boolean; item: NavItem }) {
  const size = compact ? NAV_ICON_SIZE_COMPACT : NAV_ICON_SIZE;

  if (item.useLogoMark) {
    return <QuroooMark size={size} alt="" />;
  }

  const Icon = item.icon;
  if (!Icon) {
    return null;
  }

  return <Icon size={size} strokeWidth={1.9} aria-hidden />;
}

function NavButtons({ compact }: { compact: boolean }) {
  return (
    <nav className={cn("space-y-1", compact && "flex flex-col items-center")}>
      {navItems.map((item) => {
        return (
          <button
            key={item.label}
            type="button"
            disabled={item.disabled}
            title={compact ? item.label : undefined}
            className={cn(
              "qurooo-sidebar-nav-item flex items-center rounded-xl text-sm",
              compact
                ? "h-10 w-10 shrink-0 justify-center p-0"
                : "w-full gap-3 px-3 py-2.5 text-left",
              item.active && "qurooo-sidebar-nav-item-active",
              !item.active &&
                !item.disabled &&
                "text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-soft)]",
              item.disabled && "cursor-not-allowed opacity-60 hover:bg-transparent",
            )}
          >
            {item.active ? (
              <span className="qurooo-sidebar-nav-bg" aria-hidden>
                <span className="qurooo-sidebar-nav-bg-track qurooo-sidebar-nav-bg-track-slow" />
                <span className="qurooo-sidebar-nav-bg-track qurooo-sidebar-nav-bg-track-fast" />
                <span className="qurooo-sidebar-nav-bg-dim" />
              </span>
            ) : null}
            <span className="qurooo-sidebar-nav-icon">
              <NavItemIcon compact={compact} item={item} />
            </span>

            {!compact ? (
              item.badge ? (
                <span className="qurooo-sidebar-nav-text min-w-0 flex-1 overflow-hidden leading-tight">
                  <span className="block whitespace-nowrap">{item.label}</span>
                  <span className="mt-0.5 block text-[10px] font-medium text-[var(--text-muted)]">
                    {item.badge}
                  </span>
                </span>
              ) : (
                <span className="qurooo-sidebar-nav-text min-w-0 flex-1 overflow-hidden whitespace-nowrap">
                  {item.label}
                </span>
              )
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

export function SidebarNav() {
  const { isExpanded } = useSidebar();

  return (
    <div className="qurooo-sidebar-inner relative flex h-full min-h-full flex-col py-6">
      <div
        className="qurooo-sidebar-chrome qurooo-sidebar-chrome-expanded flex h-full min-h-full flex-1 flex-col justify-between px-4"
        aria-hidden={!isExpanded}
      >
        <div className="space-y-5">
          <div className="qurooo-sidebar-expandable relative mx-auto flex w-full justify-center pt-1">
            <Image
              src="/qurooo-logos/logo-stacked-vertical.png"
              alt="Qurooo"
              width={88}
              height={100}
              priority
              className="h-[88px] w-auto"
            />
          </div>

          <NavButtons compact={false} />

          <div className="qurooo-sidebar-expandable relative pt-14">
            <div
              className="relative overflow-hidden rounded-[22px] p-4 text-white shadow-[0_18px_36px_rgba(124,92,252,0.28)]"
              style={{ background: "var(--pro-gradient)" }}
            >
              <Crown size={18} className="mb-2" />
              <p className="text-sm font-bold">Unlock Pro</p>
              <ul className="mt-2 space-y-1 text-xs text-white/90">
                {proPerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/80" />
                    {perk}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-3 w-full rounded-full py-2 text-xs font-bold text-white shadow-[0_8px_16px_rgba(22,194,163,0.28)] transition hover:brightness-105"
                style={{ background: "var(--accent-gradient)" }}
              >
                Go Pro
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="qurooo-sidebar-expandable flex justify-center">
            <div className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-soft)] p-0.5">
              <button
                type="button"
                aria-label="Light theme"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--text-secondary)] shadow-sm transition-colors hover:text-[var(--text-primary)]"
              >
                <Sun size={14} />
              </button>
              <button
                type="button"
                aria-label="Dark theme"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
              >
                <Moon size={14} />
              </button>
            </div>
          </div>

          <p className="qurooo-sidebar-expandable text-center text-sm font-semibold leading-5 text-[var(--text-secondary)]">
            Made with <span className="text-[var(--accent-pink)]">♥</span>
            <br />
            for creators
          </p>
        </div>
      </div>

      <div
        className="qurooo-sidebar-chrome qurooo-sidebar-chrome-collapsed absolute inset-y-0 left-0 flex w-[72px] flex-col justify-between"
        aria-hidden={isExpanded}
      >
        <div className="qurooo-sidebar-compact-in flex w-full flex-col items-center space-y-8">
          <div className="flex h-16 w-full items-center justify-center">
            <QuroooMark size={36} />
          </div>

          <NavButtons compact />
        </div>

        <div className="qurooo-sidebar-compact-in flex w-full flex-col items-center space-y-4">
          <div className="flex min-h-10 w-full items-center justify-center">
            <button
              type="button"
              title="Unlock Pro"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-[0_12px_24px_rgba(124,92,252,0.28)] transition-transform hover:scale-105"
              style={{ background: "var(--pro-gradient)" }}
            >
              <Crown size={16} />
            </button>
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-2">
            <button
              type="button"
              aria-label="Light theme"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] shadow-sm transition-colors hover:text-[var(--text-primary)]"
            >
              <Sun size={15} />
            </button>
            <button
              type="button"
              aria-label="Dark theme"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] shadow-sm transition-colors hover:text-[var(--text-primary)]"
            >
              <Moon size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
