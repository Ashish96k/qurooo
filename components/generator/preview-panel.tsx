"use client";

import { useState } from "react";
import Image from "next/image";

import { motion } from "framer-motion";
import { Eye, RefreshCw, ScanLine, Upload, ZoomIn } from "lucide-react";

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

export function PreviewPanel() {
  const [mode, setMode] = useState<(typeof previewModes)[number]["value"]>("preview");

  return (
    <motion.div variants={fadeUpVariants} className="mx-auto flex h-full w-full max-w-[456px] flex-col">
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

          <div className="flex min-h-0 flex-1 flex-col pt-1">
            <div className="flex min-h-0 flex-1 items-center justify-center px-3">
              <div className="relative mx-auto aspect-square w-full">
                <QrCanvas className="block h-full w-full" />
              </div>
            </div>

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
