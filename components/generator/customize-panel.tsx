"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  CircleHelp,
  Droplets,
  ImagePlus,
  Plus,
  Settings2,
  SlidersHorizontal,
  Square,
} from "lucide-react";

import {
  cornerStyleOptions,
  dotStyleOptions,
  frameStyleOptions,
} from "@/features/qr/model/defaults";
import type {
  CornerStyle,
  DotStyle,
  ErrorCorrectionLevel,
  FrameStyle,
} from "@/features/qr/model/types";
import { useQrEditorStore } from "@/features/qr/store/editor-store";
import { cn } from "@/lib/cn";

import { QuroooMark } from "@/components/layout/qurooo-logo";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

function SectionIcon({
  icon: Icon,
  background,
  children,
}: {
  icon?: LucideIcon;
  background: string;
  children?: React.ReactNode;
}) {
  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white shadow-[0_6px_14px_rgba(15,23,42,0.12)]"
      style={{ background }}
    >
      {children ?? (Icon ? <Icon size={13} strokeWidth={2.4} /> : null)}
    </span>
  );
}

function OptionTile({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] border bg-white transition",
        isActive
          ? "border-[rgba(124,92,252,0.55)] shadow-[0_0_0_1px_rgba(124,92,252,0.12),0_8px_16px_rgba(124,92,252,0.10)]"
          : "border-[rgba(15,23,42,0.08)] hover:border-[rgba(15,23,42,0.16)]",
      )}
    >
      {children}
    </button>
  );
}

function DotPreview({ variant }: { variant: DotStyle }) {
  if (variant === "dots") {
    return (
      <div className="grid grid-cols-2 gap-[3px]">
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index} className="h-[7px] w-[7px] rounded-full bg-[#334155]" />
        ))}
      </div>
    );
  }

  if (variant === "rounded") {
    return (
      <div className="grid grid-cols-2 gap-[3px]">
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index} className="h-[7px] w-[7px] rounded-[30%] bg-[#94a3b8]" />
        ))}
      </div>
    );
  }

  if (variant === "pixel") {
    return (
      <div className="grid grid-cols-3 gap-[2px]">
        {Array.from({ length: 9 }).map((_, index) => (
          <span key={index} className="h-[4px] w-[4px] rounded-[1px] bg-[#94a3b8]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-[4px]">
      {Array.from({ length: 4 }).map((_, index) => (
        <span key={index} className="h-[5px] w-[5px] rotate-45 rounded-[1px] bg-[#94a3b8]" />
      ))}
    </div>
  );
}

function CornerPreview({ variant }: { variant: CornerStyle }) {
  if (variant === "soft") {
    return <span className="block h-[18px] w-[18px] rounded-[5px] border-[2.5px] border-[#334155]" />;
  }

  if (variant === "square") {
    return <span className="block h-[18px] w-[18px] rounded-[2px] border-[2.5px] border-[#94a3b8]" />;
  }

  if (variant === "leaf") {
    return (
      <span className="block h-[18px] w-[18px] rounded-tl-[3px] rounded-tr-[3px] rounded-bl-[3px] rounded-br-[11px] border-[2.5px] border-[#94a3b8]" />
    );
  }

  return (
    <span className="relative block h-[18px] w-[18px] rounded-[4px] border border-[#94a3b8]">
      <span className="absolute inset-[3px] rounded-full border-[2px] border-[#94a3b8]" />
    </span>
  );
}

function FramePreview({ variant }: { variant: FrameStyle }) {
  if (variant === "none") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
        <path
          d="M3 6V3h3M12 3h3v3M15 12v3h-3M6 15H3v-3"
          fill="none"
          stroke="#334155"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "scan") {
    return (
      <span className="block h-[18px] w-[18px] rounded-[3px] border border-dashed border-[#94a3b8]" />
    );
  }

  if (variant === "minimal") {
    return (
      <span className="block h-[18px] w-[18px] rounded-[7px] border border-dashed border-[#94a3b8]" />
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        d="M3 7V3h4M11 3h4v4M15 11v4h-4M7 15H3v-4"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DotsGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden>
      <circle cx="3" cy="3" r="1.5" fill="currentColor" />
      <circle cx="10" cy="3" r="1.5" fill="currentColor" />
      <circle cx="6.5" cy="6.5" r="1.5" fill="currentColor" />
      <circle cx="3" cy="10" r="1.5" fill="currentColor" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

function FrameGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden>
      <rect
        x="1.5"
        y="1.5"
        width="10"
        height="10"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect x="4" y="4" width="5" height="5" rx="0.8" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

const errorCorrectionLabels: Record<ErrorCorrectionLevel, string> = {
  L: "Low (L)",
  M: "Medium (M)",
  Q: "Quartile (Q)",
  H: "High (H)",
};

export function CustomizePanel() {
  const style = useQrEditorStore((state) => state.style);
  const updateStyle = useQrEditorStore((state) => state.updateStyle);

  const swapColors = () => {
    updateStyle({
      primaryColor: style.secondaryColor,
      secondaryColor: style.primaryColor,
    });
  };

  return (
    <Card className="@container min-w-0 overflow-hidden p-4 shadow-[0_18px_44px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3.5">
        <h2 className="min-w-0 text-[15px] font-bold tracking-tight text-[var(--text-primary)]">
          Customize Your Code
        </h2>
        <button
          type="button"
          aria-label="Customize options"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-soft)] text-[var(--text-secondary)] transition hover:bg-[var(--border-subtle)] hover:text-[var(--text-primary)]"
        >
          <SlidersHorizontal size={14} strokeWidth={2.2} />
        </button>
      </div>

      <div className="space-y-3.5">
        {/* Dots */}
        <section className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <div className="flex shrink-0 items-center gap-2">
              <SectionIcon background="#14b8a6">
                <DotsGlyph />
              </SectionIcon>
              <span className="text-[13px] font-semibold text-[var(--text-primary)]">Dots</span>
            </div>
            <div className="flex w-full flex-wrap gap-1.5 @min-[360px]:ml-auto @min-[360px]:w-auto">
              {dotStyleOptions.map((option) => (
                <OptionTile
                  key={option.value}
                  isActive={style.dotStyle === option.value}
                  onClick={() => updateStyle({ dotStyle: option.value })}
                >
                  <DotPreview variant={option.value} />
                </OptionTile>
              ))}
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <input
              type="range"
              min={28}
              max={48}
              step={1}
              aria-label="Dot size"
              value={style.dotScale}
              onChange={(event) => updateStyle({ dotScale: Number(event.target.value) })}
              className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-[rgba(15,23,42,0.08)]"
            />
            <span className="w-10 shrink-0 text-right text-xs font-semibold text-[var(--text-primary)]">
              {style.dotScale}%
            </span>
          </div>
        </section>

        {/* Corners */}
        <section className="flex flex-wrap items-center gap-x-2 gap-y-2">
          <div className="flex shrink-0 items-center gap-2">
            <SectionIcon icon={Square} background="#3b82f6" />
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">Corners</span>
          </div>
          <div className="flex w-full flex-wrap gap-1.5 @min-[360px]:ml-auto @min-[360px]:w-auto">
            {cornerStyleOptions.map((option) => (
              <OptionTile
                key={option.value}
                isActive={style.cornerStyle === option.value}
                onClick={() => updateStyle({ cornerStyle: option.value })}
              >
                <CornerPreview variant={option.value} />
              </OptionTile>
            ))}
          </div>
        </section>

        {/* Colors — single row: label left, controls right (wraps as a group on narrow widths) */}
        <section className="flex flex-wrap items-end gap-x-3 gap-y-2">
          <div className="flex h-8 shrink-0 items-center gap-2">
            <SectionIcon
              icon={Droplets}
              background="linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)"
            />
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">Colors</span>
          </div>

          <div className="ml-auto flex min-w-0 flex-wrap items-end gap-x-1.5 gap-y-2">
            <div className="flex flex-col items-center gap-1">
              <p className="text-[9px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Primary
              </p>
              <label
                className="block h-8 w-8 cursor-pointer overflow-hidden rounded-[10px] border border-white shadow-[0_4px_10px_rgba(15,23,42,0.12)] ring-1 ring-[rgba(15,23,42,0.06)]"
                style={{ backgroundColor: style.primaryColor }}
              >
                <input
                  type="color"
                  value={style.primaryColor}
                  onChange={(event) => updateStyle({ primaryColor: event.target.value })}
                  className="h-0 w-0 opacity-0"
                />
              </label>
            </div>

            <button
              type="button"
              aria-label="Swap colors"
              onClick={swapColors}
              className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white text-[var(--text-muted)] shadow-sm transition hover:text-[var(--text-primary)]"
            >
              <ArrowLeftRight size={12} strokeWidth={2.4} />
            </button>

            <div className="flex flex-col items-center gap-1">
              <p className="text-[9px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Secondary
              </p>
              <label
                className="block h-8 w-8 cursor-pointer overflow-hidden rounded-[10px] border border-white shadow-[0_4px_10px_rgba(15,23,42,0.12)] ring-1 ring-[rgba(15,23,42,0.06)]"
                style={{ backgroundColor: style.secondaryColor }}
              >
                <input
                  type="color"
                  value={style.secondaryColor}
                  onChange={(event) => updateStyle({ secondaryColor: event.target.value })}
                  className="h-0 w-0 opacity-0"
                />
              </label>
            </div>

            <div className="ml-1 flex flex-col items-center gap-1">
              <p className="text-[9px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Gradient
              </p>
              <Switch
                checked={style.gradientEnabled}
                onCheckedChange={(checked) => updateStyle({ gradientEnabled: checked })}
                aria-label="Toggle gradient"
              />
            </div>
          </div>
        </section>

        {/* Logo */}
        <section className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <div className="flex shrink-0 items-center gap-2">
              <SectionIcon icon={ImagePlus} background="#f97316" />
              <span className="text-[13px] font-semibold text-[var(--text-primary)]">Logo</span>
            </div>
            <div className="flex w-full flex-wrap gap-2 @min-[360px]:ml-auto @min-[360px]:w-auto">
              <div className="flex h-10 w-10 items-center justify-center rounded-[11px] border border-[rgba(124,92,252,0.45)] bg-white shadow-[0_8px_16px_rgba(124,92,252,0.10)]">
                <QuroooMark size={20} alt="" />
              </div>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-[11px] border border-dashed border-[rgba(15,23,42,0.18)] text-[var(--text-muted)] transition hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
              >
                <Plus size={16} strokeWidth={2.2} />
              </button>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <input
              type="range"
              min={12}
              max={36}
              step={1}
              value={style.logoScale}
              onChange={(event) => updateStyle({ logoScale: Number(event.target.value) })}
              className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-[rgba(15,23,42,0.08)]"
            />
            <span className="w-10 shrink-0 text-right text-xs font-semibold text-[var(--text-primary)]">
              {style.logoScale}%
            </span>
          </div>
        </section>

        {/* Frame */}
        <section className="flex flex-wrap items-center gap-x-2 gap-y-2">
          <div className="flex shrink-0 items-center gap-2">
            <SectionIcon background="#ec4899">
              <FrameGlyph />
            </SectionIcon>
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">Frame</span>
          </div>
          <div className="flex w-full flex-wrap gap-1.5 @min-[360px]:ml-auto @min-[360px]:w-auto">
            {frameStyleOptions.map((option) => (
              <OptionTile
                key={option.value}
                isActive={style.frameStyle === option.value}
                onClick={() => updateStyle({ frameStyle: option.value })}
              >
                <FramePreview variant={option.value} />
              </OptionTile>
            ))}
          </div>
        </section>

        {/* Options */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <div className="flex shrink-0 items-center gap-2">
              <SectionIcon
                icon={Settings2}
                background="linear-gradient(135deg, #14b8a6 0%, #38bdf8 100%)"
              />
              <span className="text-[13px] font-semibold text-[var(--text-primary)]">Options</span>
            </div>

            <div className="flex w-full min-w-0 flex-wrap items-center gap-2 @min-[360px]:ml-auto @min-[360px]:w-auto">
              <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)]">
                Error Correction
                <CircleHelp size={12} className="shrink-0 text-[var(--text-muted)]" strokeWidth={2} />
              </span>
              <select
                value={style.errorCorrection}
                onChange={(event) =>
                  updateStyle({ errorCorrection: event.target.value as ErrorCorrectionLevel })
                }
                className="max-w-full rounded-full border border-[rgba(15,23,42,0.10)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] shadow-sm outline-none"
              >
                {Object.entries(errorCorrectionLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <span className="w-12 shrink-0 text-[11px] font-medium text-[var(--text-muted)]">
              Margin
            </span>
            <input
              type="range"
              min={4}
              max={32}
              step={1}
              value={style.margin}
              onChange={(event) => updateStyle({ margin: Number(event.target.value) })}
              className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-[rgba(15,23,42,0.08)]"
            />
            <span className="w-12 shrink-0 text-right text-xs font-semibold text-[var(--text-primary)]">
              {style.margin} px
            </span>
          </div>
        </section>
      </div>
    </Card>
  );
}
