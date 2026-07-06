"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  Frame as FrameIcon,
  ImagePlus,
  Menu,
  Palette,
  Plus,
  Shapes,
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

interface RowHeaderProps {
  icon: LucideIcon;
  iconBg: string;
  label: string;
}

function RowHeader({ icon: Icon, iconBg, label }: RowHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={13} strokeWidth={2.3} />
      </span>
      <span className="text-sm font-semibold text-[var(--text-primary)]">{label}</span>
    </div>
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
        "flex h-10 flex-1 items-center justify-center rounded-xl border transition",
        isActive
          ? "border-[var(--accent-primary)]/40 bg-[var(--nav-active-bg)]"
          : "border-[var(--border-subtle)] bg-white hover:border-[var(--border-strong)]",
      )}
    >
      {children}
    </button>
  );
}

function DotPreview({ variant }: { variant: DotStyle }) {
  const shapeClass =
    variant === "pixel"
      ? "rounded-[1px]"
      : variant === "diamond"
        ? "rotate-45 rounded-[1px]"
        : variant === "rounded"
          ? "rounded-[35%]"
          : "rounded-full";

  return (
    <div className="grid grid-cols-2 gap-[3px]">
      {Array.from({ length: 4 }).map((_, index) => (
        <span key={index} className={cn("h-1.5 w-1.5 bg-[var(--text-secondary)]", shapeClass)} />
      ))}
    </div>
  );
}

function CornerPreview({ variant }: { variant: CornerStyle }) {
  const radiusClass =
    variant === "square"
      ? "rounded-none"
      : variant === "circle"
        ? "rounded-full"
        : variant === "leaf"
          ? "rounded-tl-[3px] rounded-tr-[3px] rounded-bl-[3px] rounded-br-[10px]"
          : "rounded-[6px]";

  return (
    <span
      className={cn("block h-4 w-4 border-2 border-[var(--text-secondary)]", radiusClass)}
    />
  );
}

function FramePreview({ variant }: { variant: FrameStyle }) {
  if (variant === "none") {
    return <span className="block h-4 w-4 rounded-[4px] border border-dashed border-[var(--text-muted)]" />;
  }

  if (variant === "scan") {
    return <span className="block h-4 w-4 rounded-full border-2 border-[var(--text-secondary)]" />;
  }

  if (variant === "minimal") {
    return <span className="block h-4 w-4 rounded-[4px] border border-[var(--text-secondary)]" />;
  }

  return <span className="block h-4 w-4 rounded-[7px] border-2 border-[var(--text-secondary)]" />;
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

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[var(--text-primary)]">Customize Your Code</h2>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--bg-soft)]"
        >
          <Menu size={16} />
        </button>
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        <section className="space-y-2.5 py-3.5 first:pt-0">
          <RowHeader icon={Shapes} iconBg="#6366f1" label="Dots" />
          <div className="flex gap-2">
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
        </section>

        <section className="space-y-2.5 py-3.5">
          <RowHeader icon={Square} iconBg="#3b82f6" label="Corners" />
          <div className="flex gap-2">
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

        <section className="space-y-3 py-3.5">
          <RowHeader icon={Palette} iconBg="#16c2a3" label="Colors" />
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Primary
              </p>
              <label
                className="block h-8 w-10 cursor-pointer rounded-lg border border-white shadow-sm"
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

            <ArrowLeftRight size={14} className="mb-2 text-[var(--text-muted)]" />

            <div className="space-y-1">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Secondary
              </p>
              <label
                className="block h-8 w-10 cursor-pointer rounded-lg border border-white shadow-sm"
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

            <div className="ml-auto space-y-1 text-right">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
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

        <section className="space-y-3 py-3.5">
          <RowHeader icon={ImagePlus} iconBg="#f97316" label="Logo" />
          <div className="flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-soft)]">
              <QuroooMark size={22} alt="" />
            </div>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-[var(--border-strong)] text-[var(--text-muted)] transition hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={12}
              max={36}
              step={1}
              value={style.logoScale}
              onChange={(event) => updateStyle({ logoScale: Number(event.target.value) })}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-[var(--border-subtle)]"
            />
            <span className="w-10 text-right text-xs font-medium text-[var(--text-secondary)]">
              {style.logoScale}%
            </span>
          </div>
        </section>

        <section className="space-y-2.5 py-3.5">
          <RowHeader icon={FrameIcon} iconBg="#ec4899" label="Frame" />
          <div className="flex gap-2">
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

        <section className="space-y-3 py-3.5 last:pb-0">
          <RowHeader icon={SlidersHorizontal} iconBg="#64748b" label="Options" />

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              Error Correction
            </span>
            <select
              value={style.errorCorrection}
              onChange={(event) =>
                updateStyle({ errorCorrection: event.target.value as ErrorCorrectionLevel })
              }
              className="rounded-lg border border-[var(--border-subtle)] bg-white px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)]"
            >
              {Object.entries(errorCorrectionLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Margin</span>
            <input
              type="range"
              min={4}
              max={32}
              step={1}
              value={style.margin}
              onChange={(event) => updateStyle({ margin: Number(event.target.value) })}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-[var(--border-subtle)]"
            />
            <span className="w-12 text-right text-xs font-medium text-[var(--text-secondary)]">
              {style.margin} px
            </span>
          </div>
        </section>
      </div>
    </Card>
  );
}
