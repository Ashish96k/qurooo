import { encodeQrPayload } from "@/features/qr/encoders/payload";
import { createQrMatrix } from "@/features/qr/renderers/engine";
import { drawStyledQr, loadDefaultQrLogo, QR_RENDER_SIZE } from "@/features/qr/renderers/canvas";
import type { QrEditorState } from "@/features/qr/model/types";

export async function renderQrPngBlob(
  state: Pick<QrEditorState, "content" | "style">,
  size = QR_RENDER_SIZE,
): Promise<Blob> {
  const payload = encodeQrPayload(state.content);
  const matrix = createQrMatrix(payload, state.style.errorCorrection, 4);
  const logo = await loadDefaultQrLogo();

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

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  if (!blob) {
    throw new Error("Could not encode the QR code as PNG.");
  }

  return blob;
}

export function pngFilenameFromPayload(payload: string) {
  try {
    const url = new URL(payload);
    const host = url.hostname.replace(/^www\./, "").replace(/[^\w.-]+/g, "-");
    return host ? `qurooo-${host}.png` : "qurooo-qr.png";
  } catch {
    return "qurooo-qr.png";
  }
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
