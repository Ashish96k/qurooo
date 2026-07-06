"use client";

import {
  BarChart3,
  Check,
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
              <>
                <span className="qurooo-sidebar-nav-text min-w-0 flex-1 overflow-hidden whitespace-nowrap">
                  {item.label}
                </span>

                {item.badge ? (
                  <span className="qurooo-sidebar-nav-text shrink-0 rounded-full bg-[var(--bg-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    {item.badge}
                  </span>
                ) : null}
              </>
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
    <div className="qurooo-sidebar-inner relative min-h-screen py-6">
      <div
        className="qurooo-sidebar-chrome qurooo-sidebar-chrome-expanded flex min-h-[calc(100vh-3rem)] flex-col justify-between px-4"
        aria-hidden={!isExpanded}
      >
        <div className="space-y-8">
          <div className="qurooo-sidebar-expandable relative mx-auto h-[150px] w-full">
            <Image
              src="/qurooo-logos/logo-stacked-vertical.png"
              alt="Qurooo"
              width={132}
              height={150}
              priority
              className="mx-auto h-[150px] w-[132px]"
            />
          </div>

          <NavButtons compact={false} />
        </div>

        <div className="space-y-4">
          <div className="qurooo-sidebar-expandable relative min-h-[188px]">
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
                className="mt-3 w-full rounded-full bg-white py-2 text-xs font-bold text-[#6c3ce0] transition-colors hover:bg-white/90"
              >
                Go Pro
              </button>
            </div>
          </div>

          <div className="qurooo-sidebar-expandable flex flex-row items-center justify-center gap-2">
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

          <p className="qurooo-sidebar-expandable text-center text-xs text-[var(--text-muted)]">
            Made with <span className="text-[var(--accent-pink)]">♥</span> for creators
          </p>
        </div>
      </div>

      <div
        className="qurooo-sidebar-chrome qurooo-sidebar-chrome-collapsed absolute top-0 left-0 flex min-h-[calc(100vh-3rem)] w-[72px] flex-col justify-between"
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
