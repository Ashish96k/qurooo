"use client";

import { useEffect, useRef } from "react";

import { encodeQrPayload } from "@/features/qr/encoders/payload";
import { createQrMatrix } from "@/features/qr/renderers/engine";
import {
  drawStyledQr,
  loadQrLogo,
  QR_RENDER_SIZE,
} from "@/features/qr/renderers/canvas";
import { useQrEditorStore } from "@/features/qr/store/editor-store";
import { cn } from "@/lib/cn";

interface QrCanvasProps {
  className?: string;
  onPaint?: (canvas: HTMLCanvasElement) => void;
}

export function QrCanvas({ className, onPaint }: QrCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onPaintRef = useRef(onPaint);
  const content = useQrEditorStore((state) => state.content);
  const style = useQrEditorStore((state) => state.style);

  onPaintRef.current = onPaint;

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const payload = encodeQrPayload(content);
    const matrix = createQrMatrix(payload, style.errorCorrection);
    let cancelled = false;

    const paint = async () => {
      const logo = await loadQrLogo(style.logoSrc);

      if (cancelled || !canvasRef.current) {
        return;
      }

      canvas.width = QR_RENDER_SIZE;
      canvas.height = QR_RENDER_SIZE;

      const context = canvas.getContext("2d", { willReadFrequently: true });

      if (!context) {
        return;
      }

      drawStyledQr(context, QR_RENDER_SIZE, { matrix, style, logo });
      onPaintRef.current?.(canvas);
    };

    void paint();

    return () => {
      cancelled = true;
    };
  }, [content, style]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      className={cn("h-full w-full", className)}
      aria-label="QR code preview"
    />
  );
}
