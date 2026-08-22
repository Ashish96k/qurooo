import { mixHexColors } from "@/lib/color";
import type { CornerStyle, DotStyle, StyleState } from "@/features/qr/model/types";

import type { QrMatrix } from "./engine";

export const DEFAULT_QR_LOGO_SRC = "/qurooo-logos/icon-mark-gradient-1024.png";
export const QR_RENDER_SIZE = 1024;

const FINDER_SIZE = 7;
const logoImageCache = new Map<string, Promise<HTMLImageElement>>();

export interface DrawStyledQrOptions {
  matrix: QrMatrix;
  style: StyleState;
  logo?: CanvasImageSource | null;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = logoImageCache.get(src);

  if (cached) {
    return cached;
  }

  const pending = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => {
      logoImageCache.delete(src);
      reject(new Error(`Failed to load image: ${src}`));
    };
    image.src = src;
  });

  logoImageCache.set(src, pending);
  return pending;
}

export async function loadDefaultQrLogo(): Promise<HTMLImageElement | null> {
  try {
    return await loadImage(DEFAULT_QR_LOGO_SRC);
  } catch {
    return null;
  }
}

export function drawStyledQr(
  ctx: CanvasRenderingContext2D,
  canvasSize: number,
  { matrix, style, logo }: DrawStyledQrOptions,
): void {
  const { size, modules } = matrix;
  const quietModules = Math.max(2, Math.round(style.margin / 8));
  const moduleSize = canvasSize / (size + quietModules * 2);
  const origin = quietModules * moduleSize;
  const logoBox = (style.logoScale / 100) * (moduleSize * size);
  const logoClear = logoBox / 2 / moduleSize + 0.65;
  const center = (size - 1) / 2;

  ctx.save();
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.fillStyle = style.backgroundColor;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (!modules[row][col]) {
        continue;
      }

      if (isInFinderZone(row, col, size)) {
        continue;
      }

      if (Math.hypot(row - center, col - center) < logoClear) {
        continue;
      }

      const color = mixHexColors(
        style.backgroundColor,
        moduleColor(style, row, col, size),
        moduleOpacity(row, col),
      );
      drawModule(
        ctx,
        origin + col * moduleSize,
        origin + row * moduleSize,
        moduleSize,
        style.dotStyle,
        color,
        style.dotScale,
      );
    }
  }

  const topColor = style.primaryColor;
  const bottomColor = style.gradientEnabled ? style.secondaryColor : style.primaryColor;

  drawFinderEye(ctx, origin, origin, moduleSize, topColor, style.cornerStyle);
  drawFinderEye(
    ctx,
    origin + (size - FINDER_SIZE) * moduleSize,
    origin,
    moduleSize,
    topColor,
    style.cornerStyle,
  );
  drawFinderEye(
    ctx,
    origin,
    origin + (size - FINDER_SIZE) * moduleSize,
    moduleSize,
    bottomColor,
    style.cornerStyle,
  );

  if (logo && logoBox > 0) {
    drawLogoPlate(ctx, canvasSize / 2, canvasSize / 2, logoBox, logo);
  }

  ctx.restore();
}

function moduleColor(style: StyleState, row: number, col: number, size: number) {
  if (!style.gradientEnabled) {
    return style.primaryColor;
  }

  const max = Math.max(size - 1, 1);
  const t =
    style.gradientDirection === "90deg"
      ? col / max
      : style.gradientDirection === "180deg"
        ? row / max
        : (row + col) / (2 * max);

  return mixHexColors(style.primaryColor, style.secondaryColor, t);
}

function isInFinderZone(row: number, col: number, size: number) {
  return (
    (row < FINDER_SIZE && col < FINDER_SIZE) ||
    (row < FINDER_SIZE && col >= size - FINDER_SIZE) ||
    (row >= size - FINDER_SIZE && col < FINDER_SIZE)
  );
}

/** Soft opacity jitter from the mockup — finders stay fully opaque. */
function moduleOpacity(row: number, col: number) {
  const n = (row * 37 + col * 19 + row * col) % 12;

  if (n === 0) {
    return 0.35;
  }

  if (n === 1 || n === 2) {
    return 0.55;
  }

  if (n === 3 || n === 4) {
    return 0.75;
  }

  return 1;
}

function drawModule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  dotStyle: DotStyle,
  color: string,
  dotScale: number,
) {
  const scale = Math.min(0.48, Math.max(0.28, (dotScale || 42) / 100));
  ctx.fillStyle = color;
  ctx.beginPath();

  if (dotStyle === "dots") {
    ctx.arc(x + size / 2, y + size / 2, size * scale, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (dotStyle === "diamond") {
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate(Math.PI / 4);
    const diamond = size * scale * 1.24;
    roundRect(ctx, -diamond / 2, -diamond / 2, diamond, diamond, size * 0.06);
    ctx.fill();
    ctx.restore();
    return;
  }

  const inset = size * (0.5 - scale);
  const radius = dotStyle === "pixel" ? size * 0.06 : size * 0.28;
  roundRect(ctx, x + inset, y + inset, size - inset * 2, size - inset * 2, radius);
  ctx.fill();
}

function drawFinderEye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  moduleSize: number,
  color: string,
  cornerStyle: CornerStyle,
) {
  const outer = FINDER_SIZE * moduleSize;
  const radii = finderRadii(outer, cornerStyle);

  ctx.fillStyle = color;
  ctx.beginPath();
  roundRect(ctx, x, y, outer, outer, radii);
  ctx.fill();

  const whiteInset = moduleSize;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  roundRect(
    ctx,
    x + whiteInset,
    y + whiteInset,
    outer - whiteInset * 2,
    outer - whiteInset * 2,
    scaleRadii(radii, (outer - whiteInset * 2) / outer),
  );
  ctx.fill();

  const coreInset = moduleSize * 2;
  ctx.fillStyle = color;
  ctx.beginPath();
  roundRect(
    ctx,
    x + coreInset,
    y + coreInset,
    outer - coreInset * 2,
    outer - coreInset * 2,
    scaleRadii(radii, (outer - coreInset * 2) / outer),
  );
  ctx.fill();
}

function finderRadii(size: number, cornerStyle: CornerStyle): CornerRadii {
  if (cornerStyle === "square") {
    return { tl: size * 0.08, tr: size * 0.08, br: size * 0.08, bl: size * 0.08 };
  }

  if (cornerStyle === "circle") {
    const radius = size / 2;
    return { tl: radius, tr: radius, br: radius, bl: radius };
  }

  if (cornerStyle === "leaf") {
    return { tl: size * 0.18, tr: size * 0.18, br: size * 0.55, bl: size * 0.18 };
  }

  const radius = size * 0.22;
  return { tl: radius, tr: radius, br: radius, bl: radius };
}

interface CornerRadii {
  tl: number;
  tr: number;
  br: number;
  bl: number;
}

function scaleRadii(radii: CornerRadii, factor: number): CornerRadii {
  return {
    tl: radii.tl * factor,
    tr: radii.tr * factor,
    br: radii.br * factor,
    bl: radii.bl * factor,
  };
}

function drawLogoPlate(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  box: number,
  logo: CanvasImageSource,
) {
  const x = cx - box / 2;
  const y = cy - box / 2;
  const radius = box * 0.22;

  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.12)";
  ctx.shadowBlur = box * 0.08;
  ctx.shadowOffsetY = box * 0.04;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  roundRect(ctx, x, y, box, box, radius);
  ctx.fill();
  ctx.restore();

  const pad = box * 0.16;
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, x + pad * 0.4, y + pad * 0.4, box - pad * 0.8, box - pad * 0.8, radius * 0.7);
  ctx.clip();
  ctx.drawImage(logo, x + pad, y + pad, box - pad * 2, box - pad * 2);
  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | CornerRadii,
) {
  const radii =
    typeof radius === "number"
      ? { tl: radius, tr: radius, br: radius, bl: radius }
      : radius;

  ctx.roundRect(x, y, width, height, [radii.tl, radii.tr, radii.br, radii.bl]);
}
