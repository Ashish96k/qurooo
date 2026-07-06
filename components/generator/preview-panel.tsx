"use client";

import { useMemo, useState } from "react";

import { motion } from "framer-motion";
import { Eye, RefreshCw, ScanLine, Upload, ZoomIn } from "lucide-react";

import { useQrEditorStore } from "@/features/qr/store/editor-store";
import { mixHexColors } from "@/lib/color";
import { fadeUpVariants } from "@/lib/motion";

import { Card } from "@/components/ui/card";
import { QuroooMark } from "@/components/layout/qurooo-logo";

const GRID_SIZE = 23;
const FINDER_SIZE = 6;

type ModuleState = "on" | "off" | "finder";

function getModuleState(row: number, col: number): ModuleState {
  const last = GRID_SIZE - FINDER_SIZE;
  const inFinderZone =
    (row < FINDER_SIZE && col < FINDER_SIZE) ||
    (row < FINDER_SIZE && col >= last) ||
    (row >= last && col < FINDER_SIZE);

  if (inFinderZone) {
    return "finder";
  }

  const isOn = (row * 11 + col * 7 + row * col) % 5 === 0 || (row + col) % 7 === 0;
  return isOn ? "on" : "off";
}

function buildModuleGrid() {
  return Array.from({ length: GRID_SIZE }, (_, row) =>
    Array.from({ length: GRID_SIZE }, (_, col) => getModuleState(row, col)),
  );
}

const previewModes = [
  { value: "preview", label: "Preview", icon: Eye },
  { value: "scan", label: "Scan Test", icon: ScanLine },
] as const;

export function PreviewPanel() {
  const style = useQrEditorStore((state) => state.style);
  const [mode, setMode] = useState<(typeof previewModes)[number]["value"]>("preview");

  const modules = useMemo(() => buildModuleGrid(), []);

  const dotRadiusClass =
    style.dotStyle === "pixel"
      ? "rounded-[3px]"
      : style.dotStyle === "rounded"
        ? "rounded-[35%]"
        : style.dotStyle === "diamond"
          ? "rotate-45 rounded-[2px]"
          : "rounded-full";

  const finderPercent = `${(FINDER_SIZE / GRID_SIZE) * 100}%`;
  const previewLogoSize = Math.round(style.logoScale * 1.1);

  return (
    <motion.div variants={fadeUpVariants} className="flex flex-col">
      <Card className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-center">
          <div className="relative inline-flex rounded-full bg-[var(--bg-soft)] p-1">
            {previewModes.map((item) => {
              const isActive = item.value === mode;
              const Icon = item.icon;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMode(item.value)}
                  className="relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition"
                >
                  {isActive ? (
                    <motion.span
                      layoutId="preview-mode-indicator"
                      className="absolute inset-0 rounded-full bg-white shadow-[0_8px_18px_rgba(15,23,42,0.1)]"
                      transition={{ type: "spring", stiffness: 260, damping: 26 }}
                    />
                  ) : null}
                  <span
                    className={`relative z-10 flex items-center gap-1.5 ${
                      isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                    }`}
                  >
                    <Icon size={13} />
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <div className="relative mx-auto aspect-square w-full max-w-[400px]">
            <div
              className="grid h-full w-full gap-[2px]"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
            >
              {modules.flatMap((row, rowIndex) =>
                row.map((cellState, colIndex) => {
                  if (cellState === "finder") {
                    return <div key={`${rowIndex}-${colIndex}`} />;
                  }

                  const t = (rowIndex + colIndex) / (2 * (GRID_SIZE - 1));
                  const color = style.gradientEnabled
                    ? mixHexColors(style.primaryColor, style.secondaryColor, t)
                    : style.primaryColor;

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={cellState === "on" ? dotRadiusClass : ""}
                      style={{
                        backgroundColor: cellState === "on" ? color : "transparent",
                      }}
                    />
                  );
                }),
              )}
            </div>

            <div
              className="absolute left-0 top-0 flex items-center justify-center rounded-[26%] border-[3px] bg-white"
              style={{ width: finderPercent, height: finderPercent, borderColor: style.primaryColor }}
            >
              <span
                className="h-[46%] w-[46%] rounded-[24%]"
                style={{ backgroundColor: style.primaryColor }}
              />
            </div>

            <div
              className="absolute right-0 top-0 flex items-center justify-center rounded-[26%] border-[3px] bg-white"
              style={{ width: finderPercent, height: finderPercent, borderColor: style.primaryColor }}
            >
              <span
                className="h-[46%] w-[46%] rounded-[24%]"
                style={{ backgroundColor: style.primaryColor }}
              />
            </div>

            <div
              className="absolute bottom-0 left-0 rounded-[26%]"
              style={{ width: finderPercent, height: finderPercent, backgroundColor: style.secondaryColor }}
            />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className="flex items-center justify-center rounded-2xl bg-white shadow-[0_14px_30px_rgba(15,23,42,0.14)]"
                style={{
                  width: `${style.logoScale * 1.6}px`,
                  height: `${style.logoScale * 1.6}px`,
                }}
              >
                <QuroooMark size={previewLogoSize} alt="" />
              </div>
            </div>
          </div>

          <div className="relative flex flex-col items-center">
            <p
              className="text-lg italic font-semibold tracking-wide"
              style={{ color: style.primaryColor }}
            >
              Scan Me!
            </p>
            <svg
              width="34"
              height="24"
              viewBox="0 0 34 24"
              fill="none"
              className="absolute -right-9 -top-2"
            >
              <path
                d="M2 20C10 20 14 4 30 4"
                stroke={style.primaryColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="1 4"
              />
              <path
                d="M24 2L30 4L27 9"
                stroke={style.primaryColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex items-center gap-3">
            {[Upload, RefreshCw, ZoomIn].map((Icon, index) => (
              <button
                key={index}
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:text-[var(--text-primary)]"
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
