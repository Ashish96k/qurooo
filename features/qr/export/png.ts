import { encodeQrPayload } from "@/features/qr/encoders/payload";
import { jpegBytesToPdf } from "@/features/qr/export/pdf";
import { createQrMatrix } from "@/features/qr/renderers/engine";
import { drawStyledQr, loadQrLogo, QR_RENDER_SIZE } from "@/features/qr/renderers/canvas";
import type { QrEditorState } from "@/features/qr/model/types";

type ExportState = Pick<QrEditorState, "content" | "style">;

export async function renderStyledQrCanvas(
  state: ExportState,
  size = QR_RENDER_SIZE,
): Promise<HTMLCanvasElement> {
  const payload = encodeQrPayload(state.content);
  const matrix = createQrMatrix(payload, state.style.errorCorrection);
  const logo = await loadQrLogo(state.style.logoSrc);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create a 2D canvas context.");
  }

  drawStyledQr(context, size, {
    matrix,
    style: state.style,
    logo,
  });

  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error(`Could not encode the QR code as ${type}.`));
          return;
        }

        resolve(blob);
      },
      type,
      quality,
    );
  });
}

export async function renderQrPngBlob(state: ExportState, size = QR_RENDER_SIZE): Promise<Blob> {
  const canvas = await renderStyledQrCanvas(state, size);
  return canvasToBlob(canvas, "image/png");
}

export async function renderQrWebpBlob(state: ExportState, size = QR_RENDER_SIZE): Promise<Blob> {
  const canvas = await renderStyledQrCanvas(state, size);
  return canvasToBlob(canvas, "image/webp", 0.92);
}

export async function renderQrPdfBlob(state: ExportState, size = QR_RENDER_SIZE): Promise<Blob> {
  const canvas = await renderStyledQrCanvas(state, size);
  const jpeg = await canvasToBlob(canvas, "image/jpeg", 0.95);
  const bytes = new Uint8Array(await jpeg.arrayBuffer());
  const pdf = jpegBytesToPdf(bytes, canvas.width, canvas.height);
  const copy = new Uint8Array(pdf.byteLength);
  copy.set(pdf);

  return new Blob([copy.buffer], {
    type: "application/pdf",
  });
}

export async function renderQrSvgBlob(state: ExportState, size = QR_RENDER_SIZE): Promise<Blob> {
  const png = await renderQrPngBlob(state, size);
  const base64 = await blobToBase64(png);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <image width="${size}" height="${size}" href="data:image/png;base64,${base64}"/>
</svg>
`;

  return new Blob([svg], { type: "image/svg+xml" });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read the QR image."));
    reader.readAsDataURL(blob);
  });
}

export function exportFilename(payload: string, extension: string) {
  const safeExtension = extension.replace(/[^\w]+/g, "") || "png";

  try {
    const url = new URL(payload);
    const host = url.hostname.replace(/^www\./, "").replace(/[^\w.-]+/g, "-");
    return host ? `qurooo-${host}.${safeExtension}` : `qurooo-qr.${safeExtension}`;
  } catch {
    return `qurooo-qr.${safeExtension}`;
  }
}

export function pngFilenameFromPayload(payload: string) {
  return exportFilename(payload, "png");
}

export function downloadBlob(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}
