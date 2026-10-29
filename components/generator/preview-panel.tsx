"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { motion } from "framer-motion";
import { Eye, RefreshCw, ScanLine, Upload, ZoomIn } from "lucide-react";

import { readQrFromCanvas } from "@/features/qr/decode/scan";
import { encodeQrPayload } from "@/features/qr/encoders/payload";
import { readLogoFile } from "@/features/qr/logo";
import { useQrEditorStore } from "@/features/qr/store/editor-store";
import { fadeUpVariants } from "@/lib/motion";

import { Card } from "@/components/ui/card";

import { QrCanvas } from "./qr-canvas";

const previewModes = [
  { value: "preview", label: "Preview", icon: Eye },
  { value: "scan", label: "Scan Test", icon: ScanLine },
] as const;

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

const zoomLevels = [100, 125, 150, 75] as const;

type ScanRead = {
  status: "reading" | "read" | "miss";
  text: string | null;
};

function ScanResult({ scan, payload }: { scan: ScanRead | null; payload: string }) {
  return (
    <div
      className="mx-4 mb-10 mt-1 shrink-0 rounded-2xl border border-[var(--border-subtle)] bg-white px-4 py-3 text-center shadow-[0_8px_20px_rgba(15,23,42,0.05)]"
      aria-live="polite"
    >
      {scan?.status === "read" ? (
        <>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--accent-primary)]">
            Preview scans
          </p>
          <p className="mt-1 max-h-24 overflow-auto break-all text-left text-xs leading-5 text-[var(--text-primary)]">
            {scan.text}
          </p>
        </>
      ) : null}

      {scan?.status === "miss" ? (
        <>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">
            This preview didn&apos;t scan
          </p>
          <p className="mt-1 text-[11px] leading-4 text-[var(--text-muted)]">
            The style is too light, or the logo covers the center.
          </p>
          <p className="mt-2 max-h-20 overflow-auto break-all text-left text-[11px] leading-4 text-[var(--text-secondary)]">
            Encoded: {payload}
          </p>
        </>
      ) : null}

      {scan === null || scan.status === "reading" ? (
        <p className="text-xs font-medium text-[var(--text-secondary)]">Reading the preview…</p>
      ) : null}
    </div>
  );
}

export function PreviewPanel() {
  const frameStyle = useQrEditorStore((state) => state.style.frameStyle);
  const payload = useQrEditorStore((state) => encodeQrPayload(state.content));
  const zoom = useQrEditorStore((state) => state.preview.zoom);
  const setZoom = useQrEditorStore((state) => state.setZoom);
  const resetEditor = useQrEditorStore((state) => state.resetEditor);
  const updateStyle = useQrEditorStore((state) => state.updateStyle);
  const [mode, setMode] = useState<(typeof previewModes)[number]["value"]>("preview");
  const [scan, setScan] = useState<ScanRead | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const modeRef = useRef(mode);
  const requestRef = useRef(0);

  modeRef.current = mode;

  const scanCanvas = useCallback(async (canvas: HTMLCanvasElement) => {
    const request = requestRef.current + 1;
    requestRef.current = request;
    setScan({ status: "reading", text: null });

    const text = await readQrFromCanvas(canvas);

    if (request !== requestRef.current) {
      return;
    }

    setScan(text ? { status: "read", text } : { status: "miss", text: null });
  }, []);

  const handlePaint = useCallback(
    (canvas: HTMLCanvasElement) => {
      canvasRef.current = canvas;

      if (modeRef.current === "scan") {
        void scanCanvas(canvas);
      }
    },
    [scanCanvas],
  );

  useEffect(() => {
    if (mode !== "scan") {
      return;
    }

    const canvas = canvasRef.current;

    if (canvas) {
      void scanCanvas(canvas);
    }
  }, [mode, scanCanvas]);

  return (
    <motion.div variants={fadeUpVariants} className="flex h-full w-full flex-col">
      <Card className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--bg-panel)] p-0">
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

          <div className="flex min-h-0 flex-1 flex-col pt-1">
            <div className="flex min-h-0 flex-1 items-center justify-center px-3">
              <div className="relative mx-auto aspect-square w-full overflow-hidden">
                <div
                  className="h-full w-full origin-center transition-transform duration-200"
                  style={{ transform: `scale(${zoom / 100})` }}
                >
                  <QrCanvas className="block h-full w-full" onPaint={handlePaint} />
                </div>
              </div>
            </div>

            {mode === "scan" ? (
              <ScanResult payload={payload} scan={scan} />
            ) : frameStyle === "scan" ? (
              <div className="relative z-[1] mx-auto mt-0.5 h-[108px] w-[200px] shrink-0">
                <p className="qurooo-scan-me absolute left-[35%] top-6 z-[1] -translate-x-1/2 whitespace-nowrap text-[22px] leading-none">
                  Scan Me!
                </p>
                <div className="absolute left-[58%] top-[22px] -translate-x-1/2">
                  <ScanMeArrow />
                </div>
              </div>
            ) : (
              <div className="h-10 shrink-0" />
            )}
          </div>
        </div>
      </Card>

      <div className="relative z-20 -mt-7 flex justify-center gap-3.5">
        <button
          type="button"
          aria-label="Upload logo"
          onClick={() => logoInputRef.current?.click()}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] shadow-[0_12px_28px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5 hover:text-[var(--text-primary)]"
        >
          <Upload size={20} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          aria-label="Reset design"
          onClick={() => resetEditor()}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] shadow-[0_12px_28px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5 hover:text-[var(--text-primary)]"
        >
          <RefreshCw size={20} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          aria-label={`Zoom ${zoom}%`}
          onClick={() => {
            const index = zoomLevels.indexOf(zoom as (typeof zoomLevels)[number]);
            setZoom(zoomLevels[(index + 1) % zoomLevels.length] ?? 100);
          }}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] shadow-[0_12px_28px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5 hover:text-[var(--text-primary)]"
        >
          <ZoomIn size={20} strokeWidth={1.75} />
        </button>
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-label="Preview logo image file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";

            if (!file) {
              return;
            }

            void readLogoFile(file)
              .then((logoSrc) => updateStyle({ logoSrc }))
              .catch((error: unknown) => console.error(error));
          }}
        />
      </div>
    </motion.div>
  );
}
