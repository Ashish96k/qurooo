"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { motion } from "framer-motion";
import { Eye, RefreshCw, ScanLine, Upload, ZoomIn } from "lucide-react";

import { createQrMatrix } from "@/features/qr/renderers/engine";
import { getActiveFieldValue } from "@/features/qr/selectors/editor-selectors";
import { useQrEditorStore } from "@/features/qr/store/editor-store";
import { mixHexColors } from "@/lib/color";
import { fadeUpVariants } from "@/lib/motion";

import { Card } from "@/components/ui/card";
import { QuroooMark } from "@/components/layout/qurooo-logo";

const FINDER_SIZE = 8;
/** Quiet ring around each finder so dots never touch / overlap the eyes (matches mockup). */
const FINDER_CLEAR = FINDER_SIZE + 1;

const previewModes = [
  { value: "preview", label: "Preview", icon: Eye },
  { value: "scan", label: "Scan Test", icon: ScanLine },
] as const;

function isInFinderClearZone(row: number, col: number, size: number) {
  const last = size - FINDER_CLEAR;
  return (
    (row < FINDER_CLEAR && col < FINDER_CLEAR) ||
    (row < FINDER_CLEAR && col >= last) ||
    (row >= last && col < FINDER_CLEAR)
  );
}

/** Soft opacity variation like the mockup — some dots read lighter / more transparent. */
function moduleOpacity(row: number, col: number) {
  const n = (row * 37 + col * 19 + row * col) % 12;
  if (n === 0) return 0.35;
  if (n === 1 || n === 2) return 0.55;
  if (n === 3 || n === 4) return 0.75;
  return 1;
}

function FinderEye({
  color,
  radiusClass,
}: {
  color: string;
  radiusClass: string;
}) {
  return (
    <div
      className={`relative h-full w-full ${radiusClass}`}
      style={{ backgroundColor: color }}
    >
      {/* Standard-ish QR proportions with a slightly bolder outer ring */}
      <div className={`absolute bg-white ${radiusClass}`} style={{ inset: "15%" }} />
      <div
        className={`absolute ${radiusClass}`}
        style={{ inset: "32%", backgroundColor: color }}
      />
    </div>
  );
}

function ScanMeArrow({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/icons/scan-arrow.png"
      alt=""
      width={96}
      height={102}
      className={`block h-[82px] w-auto select-none ${className}`}
      draggable={false}
      aria-hidden
    />
  );
}

export function PreviewPanel() {
  const style = useQrEditorStore((state) => state.style);
  const payload = useQrEditorStore((state) => getActiveFieldValue(state));
  const [mode, setMode] = useState<(typeof previewModes)[number]["value"]>("preview");

  const matrix = useMemo(
    // Version 4 → 33×33 — denser than auto, but matches the mockup’s module count.
    () => createQrMatrix(payload || "https://qurooo.app", style.errorCorrection, 4),
    [payload, style.errorCorrection],
  );

  const size = matrix.size;
  const finderEnd = size - FINDER_SIZE + 1;

  const gridStyle = useMemo(
    () =>
      ({
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
      }) as const,
    [size],
  );

  const dotRadiusClass =
    style.dotStyle === "pixel"
      ? "rounded-[1.5px]"
      : style.dotStyle === "rounded"
        ? "rounded-[30%]"
        : style.dotStyle === "diamond"
          ? "rotate-45 rounded-[1.5px]"
          : "rounded-full";

  const finderRadiusClass =
    style.cornerStyle === "square"
      ? "rounded-[10%]"
      : style.cornerStyle === "circle"
        ? "rounded-full"
        : style.cornerStyle === "leaf"
          ? "rounded-[40%_12%_40%_12%]"
          : "rounded-[28%]";

  // Center logo plate — large enough for the mark, small enough to keep density
  const previewLogoSize = Math.round(style.logoScale * 2.5);
  const logoBoxSize = Math.round(style.logoScale * 4.2);
  const logoClearRadius = size * 0.16;

  const topFinderColor = style.primaryColor;
  const bottomFinderColor = style.gradientEnabled ? style.secondaryColor : style.primaryColor;

  return (
    <motion.div variants={fadeUpVariants} className="flex h-full flex-col">
      <Card className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#fbfcfe] p-0">
        <div className="qurooo-preview-dotgrid relative flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-center px-3 pb-2 pt-4">
            <div className="qurooo-preview-mode-track relative inline-flex rounded-full p-1">
              {previewModes.map((item) => {
                const isActive = item.value === mode;
                const Icon = item.icon;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setMode(item.value)}
                    className="relative flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[11px] font-medium transition"
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="preview-mode-indicator"
                        className="qurooo-preview-mode-active absolute inset-0 rounded-full"
                        transition={{ type: "spring", stiffness: 280, damping: 28 }}
                      />
                    ) : null}
                    <span
                      className={`relative z-10 flex items-center gap-1 ${
                        isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                      }`}
                    >
                      <Icon size={12} strokeWidth={2.2} />
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col px-2 pt-1">
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <div className="relative mx-auto aspect-square w-full max-w-[448px]">
                <div className="grid h-full w-full gap-0" style={gridStyle}>
                  {matrix.modules.flatMap((row, rowIndex) =>
                    row.map((isDark, colIndex) => {
                      // Clear finder + 1-module quiet ring so eyes never overlap dots
                      if (isInFinderClearZone(rowIndex, colIndex, size)) {
                        return <div key={`${rowIndex}-${colIndex}`} />;
                      }

                      const center = (size - 1) / 2;
                      const dist = Math.hypot(rowIndex - center, colIndex - center);
                      if (dist < logoClearRadius) {
                        return <div key={`${rowIndex}-${colIndex}`} />;
                      }

                      if (!isDark) {
                        return <div key={`${rowIndex}-${colIndex}`} />;
                      }

                      const t = rowIndex / Math.max(size - 1, 1);
                      const color = style.gradientEnabled
                        ? mixHexColors(style.primaryColor, style.secondaryColor, t)
                        : style.primaryColor;

                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className="relative min-h-0 min-w-0"
                        >
                          {/* Slightly larger dots; gutters still visible between circles */}
                          <span
                            className={`absolute inset-[1%] block ${dotRadiusClass}`}
                            style={{
                              backgroundColor: color,
                              opacity: moduleOpacity(rowIndex, colIndex),
                            }}
                          />
                        </div>
                      );
                    }),
                  )}
                </div>

                {/* Finders stay inside the 7×7 zone — no scale overflow onto data modules */}
                <div className="pointer-events-none absolute inset-0 grid gap-0" style={gridStyle}>
                  <div
                    className="box-border p-0"
                    style={{
                      gridColumn: `1 / span ${FINDER_SIZE}`,
                      gridRow: `1 / span ${FINDER_SIZE}`,
                    }}
                  >
                    <FinderEye color={topFinderColor} radiusClass={finderRadiusClass} />
                  </div>
                  <div
                    className="box-border p-0"
                    style={{
                      gridColumn: `${finderEnd} / span ${FINDER_SIZE}`,
                      gridRow: `1 / span ${FINDER_SIZE}`,
                    }}
                  >
                    <FinderEye color={topFinderColor} radiusClass={finderRadiusClass} />
                  </div>
                  <div
                    className="box-border p-0"
                    style={{
                      gridColumn: `1 / span ${FINDER_SIZE}`,
                      gridRow: `${finderEnd} / span ${FINDER_SIZE}`,
                    }}
                  >
                    <FinderEye color={bottomFinderColor} radiusClass={finderRadiusClass} />
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div
                    className="flex items-center justify-center rounded-[22%] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
                    style={{ width: logoBoxSize, height: logoBoxSize }}
                  >
                    <QuroooMark size={previewLogoSize} alt="" />
                  </div>
                </div>
              </div>
            </div>

            {/* Text + arrow as one cluster (mockup: label above, arrow tucked under “Me!”) */}
            <div className="relative z-[1] mx-auto mt-0.5 h-[108px] w-[200px] shrink-0">
              <p className="qurooo-scan-me absolute left-[35%] top-6 z-[1] -translate-x-1/2 whitespace-nowrap text-[22px] leading-none">
                Scan Me!
              </p>
              <div className="absolute left-[58%] top-[22px] -translate-x-1/2">
                <ScanMeArrow />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="relative z-20 -mt-7 flex justify-center gap-3.5">
        {[Upload, RefreshCw, ZoomIn].map((Icon, index) => (
          <button
            key={index}
            type="button"
            className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] shadow-[0_12px_28px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5 hover:text-[var(--text-primary)]"
          >
            <Icon size={20} strokeWidth={1.75} />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
