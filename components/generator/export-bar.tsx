"use client";

import { useState } from "react";
import {
  Code2,
  Download,
  FileImage,
  FileText,
  Image as ImageIcon,
  PenTool,
  Share2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { encodeQrPayload } from "@/features/qr/encoders/payload";
import {
  downloadBlob,
  pngFilenameFromPayload,
  renderQrPngBlob,
} from "@/features/qr/export/png";
import { exportFormatOptions } from "@/features/qr/model/defaults";
import type { ExportFormat } from "@/features/qr/model/types";
import { useQrEditorStore } from "@/features/qr/store/editor-store";
import { cn } from "@/lib/cn";

import { Card } from "@/components/ui/card";

const formatIcons: Record<ExportFormat, LucideIcon> = {
  png: ImageIcon,
  svg: Code2,
  pdf: FileText,
  webp: FileImage,
  eps: PenTool,
};

export function ExportBar() {
  const format = useQrEditorStore((state) => state.export.format);
  const setExportFormat = useQrEditorStore((state) => state.setExportFormat);
  const [isDownloading, setIsDownloading] = useState(false);
  const canDownloadPng = format === "png";

  const handleDownload = async () => {
    if (!canDownloadPng || isDownloading) {
      return;
    }

    setIsDownloading(true);

    try {
      const state = useQrEditorStore.getState();
      const blob = await renderQrPngBlob(state);
      downloadBlob(blob, pngFilenameFromPayload(encodeQrPayload(state.content)));
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="flex flex-1 items-center gap-5 rounded-[28px] px-5 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:gap-6 sm:px-6">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-[11px] font-semibold tracking-wide text-[var(--text-secondary)]">
          Export As
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {exportFormatOptions.map((option) => {
            const Icon = formatIcons[option.value];
            const isActive = format === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setExportFormat(option.value)}
                className={cn(
                  "flex h-[54px] w-[54px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-[14px] border transition",
                  isActive
                    ? "border-[#7dd3c7] text-[var(--text-primary)] shadow-[0_8px_18px_rgba(22,194,163,0.14)]"
                    : "border-[rgba(15,23,42,0.10)] bg-white text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-soft)] hover:text-[var(--text-secondary)]",
                )}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(145deg, rgba(22,194,163,0.16) 0%, rgba(124,92,252,0.08) 100%)",
                      }
                    : undefined
                }
              >
                <Icon size={15} strokeWidth={2} />
                <span className="text-[9px] font-bold uppercase tracking-wide">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={() => void handleDownload()}
          disabled={!canDownloadPng || isDownloading}
          className="flex h-12 items-center gap-2 rounded-full px-7 text-sm font-bold text-white shadow-[0_14px_28px_rgba(22,194,163,0.28)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-75"
          style={{ background: "linear-gradient(105deg, #16c2a3 0%, #5b8af5 48%, #7c5cfc 100%)" }}
          title={canDownloadPng ? "Download PNG" : "PNG export is available now"}
        >
          <Download size={16} strokeWidth={2.4} />
          {isDownloading ? "Saving…" : "Download"}
        </button>

        <button
          type="button"
          aria-label="Share"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] shadow-[0_10px_22px_rgba(15,23,42,0.08)] transition hover:bg-[var(--bg-soft)] hover:text-[var(--text-primary)]"
        >
          <Share2 size={16} strokeWidth={2} />
        </button>
      </div>
    </Card>
  );
}
