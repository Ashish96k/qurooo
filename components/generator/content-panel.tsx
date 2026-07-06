"use client";

import { Info, Lightbulb, Link as LinkIcon, Plus, Sparkles, Zap } from "lucide-react";

import { quickPresets } from "@/features/qr/model/defaults";
import { getTypeMetaByValue } from "@/features/qr/selectors/editor-selectors";
import { useQrEditorStore } from "@/features/qr/store/editor-store";
import { cn } from "@/lib/cn";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { StyleMosaicIcon } from "./style-mosaic-icon";

export function ContentPanel() {
  const content = useQrEditorStore((state) => state.content);
  const highlightedPresetId = useQrEditorStore((state) => state.ui.highlightedPresetId);
  const applyPreset = useQrEditorStore((state) => state.applyPreset);
  const updateContent = useQrEditorStore((state) => state.updateContent);

  const typeMeta = getTypeMetaByValue(content.qrType);
  const fieldLabel = content.qrType === "url" ? "Enter your URL" : `Enter your ${typeMeta.label}`;

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <LinkIcon size={15} className="text-[var(--text-secondary)]" />
          <h2 className="text-sm font-bold text-[var(--text-primary)]">{fieldLabel}</h2>
        </div>

        <div className="relative">
          {content.qrType === "url" ? (
            <Input
              aria-label="Website URL"
              placeholder={typeMeta.placeholder}
              value={content.values.url}
              onChange={(event) => updateContent("url", event.target.value)}
              className="pr-11"
            />
          ) : (
            <div className="flex h-12 items-center rounded-[var(--radius-control)] border border-dashed border-[var(--border-strong)] bg-[var(--bg-soft)] px-4 text-sm text-[var(--text-muted)]">
              {typeMeta.placeholder}
            </div>
          )}
          <span className="absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--text-primary)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <button
          type="button"
          className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:text-[var(--text-secondary)]"
        >
          <Plus size={13} />
          Add UTM Parameters
          <Info size={12} className="text-[var(--text-muted)]" />
        </button>

        <button
          type="button"
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white shadow-[var(--shadow-button)] transition hover:-translate-y-0.5"
          style={{ background: "var(--accent-gradient)" }}
        >
          <Zap size={16} />
          Generate Magic
          <Sparkles size={15} />
        </button>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-bold text-[var(--text-primary)]">Quick Style Picks</h2>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">One tap. Stunning results.</p>

        <div className="mt-3 grid grid-cols-5 gap-2">
          {quickPresets.map((preset) => {
            const isActive = highlightedPresetId === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className="flex flex-col items-center gap-1.5"
              >
                <StyleMosaicIcon
                  primary={preset.style.primaryColor ?? "#16c2a3"}
                  secondary={preset.style.secondaryColor ?? "#7c5cfc"}
                  className={cn(
                    "h-11 w-11 transition",
                    isActive && "ring-2 ring-[var(--accent-primary)] ring-offset-2",
                  )}
                />
                <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                  {preset.label}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="border-none bg-[#eaf9f2] p-5 shadow-none">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[var(--success)]">
                <Lightbulb size={13} />
              </span>
              <h3 className="text-sm font-bold text-[#0f3d2e]">Pro Tip</h3>
            </div>
            <p className="mt-2 text-xs italic leading-5 text-[#356354]">
              Try different styles, shapes and frames to make your QR stand out!
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/70">
            <StyleMosaicIcon primary="#16c2a3" secondary="#7c5cfc" className="h-11 w-11" />
          </div>
        </div>
      </Card>
    </div>
  );
}
