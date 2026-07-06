"use client";

import { Download, FileImage, FileText, FileType, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { exportFormatOptions } from "@/features/qr/model/defaults";
import type { ExportFormat } from "@/features/qr/model/types";
import { useQrEditorStore } from "@/features/qr/store/editor-store";
import { cn } from "@/lib/cn";

import { Card } from "@/components/ui/card";

const formatIcons: Record<ExportFormat, LucideIcon> = {
  png: FileImage,
  svg: FileType,
  pdf: FileText,
  webp: FileImage,
  eps: FileType,
};

export function ExportBar() {
  const format = useQrEditorStore((state) => state.export.format);
  const setExportFormat = useQrEditorStore((state) => state.setExportFormat);

  return (
    <Card className="flex flex-1 flex-wrap items-center gap-4 p-3.5 sm:gap-5">
      <p className="pl-1 text-xs font-bold text-[var(--text-primary)]">Export As</p>

      <div className="flex flex-1 items-center gap-2">
        {exportFormatOptions.map((option) => {
          const Icon = formatIcons[option.value];
          const isActive = format === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setExportFormat(option.value)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border px-3 py-1.5 transition",
                isActive
                  ? "border-[var(--accent-primary)]/40 bg-[var(--nav-active-bg)]"
                  : "border-transparent text-[var(--text-muted)] hover:bg-[var(--bg-soft)]",
              )}
            >
              <Icon
                size={16}
                className={isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"}
              />
              <span
                className={cn(
                  "text-[10px] font-semibold",
                  isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]",
                )}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled
        className="flex h-11 items-center gap-2 rounded-full px-6 text-sm font-bold text-white shadow-[var(--shadow-button)] transition disabled:cursor-not-allowed disabled:opacity-70"
        style={{ background: "var(--accent-gradient)" }}
      >
        <Download size={15} />
        Download
      </button>

      <button
        type="button"
        aria-label="Share"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] transition hover:bg-[var(--bg-soft)]"
      >
        <Share2 size={16} />
      </button>
    </Card>
  );
}
