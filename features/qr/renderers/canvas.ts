import { mixHexColors } from "@/lib/color";
import type { CornerStyle, DotStyle, FrameStyle, StyleState } from "@/features/qr/model/types";

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

export async function loadQrLogo(src: string | null): Promise<HTMLImageElement | null> {
  if (!src) {
    return loadDefaultQrLogo();
  }

  try {
    return await loadImage(src);
  } catch {
    return loadDefaultQrLogo();
  }
}

export function drawStyledQr(
  ctx: CanvasRenderingContext2D,
  canvasSize: number,
  { matrix, style, logo }: DrawStyledQrOptions,
): void {
  const { size, modules } = matrix;
  const quietModules = Math.max(2, Math.round(style.margin / 8));
  const framePad = getFramePadding(style.frameStyle, canvasSize);
  const innerWidth = canvasSize - framePad.left - framePad.right;
  const innerHeight = canvasSize - framePad.top - framePad.bottom;
  const qrSide = Math.min(innerWidth, innerHeight);
  const moduleSize = qrSide / (size + quietModules * 2);
  const qrLeft = framePad.left + (innerWidth - qrSide) / 2;
  const qrTop = framePad.top + (innerHeight - qrSide) / 2;
  const originX = qrLeft + quietModules * moduleSize;
  const originY = qrTop + quietModules * moduleSize;
  const logoBox = (style.logoScale / 100) * (moduleSize * size);
  const hasLogo = Boolean(logo) && logoBox > 0;
  // Clear only the cells the logo plate covers, plus a thin gap so dots do not touch it.
  const logoClear = logoBox / 2 / moduleSize + 0.2;
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

      if (hasLogo && Math.hypot(row - center, col - center) < logoClear) {
        continue;
      }

      const color = moduleColor(style, row, col, size);
      drawModule(
        ctx,
        originX + col * moduleSize,
        originY + row * moduleSize,
        moduleSize,
        style.dotStyle,
        color,
        style.dotScale,
      );
    }
  }

  const topColor = style.primaryColor;
  const bottomColor = style.gradientEnabled ? style.secondaryColor : style.primaryColor;

  drawFinderEye(
    ctx,
    originX,
    originY,
    moduleSize,
    topColor,
    style.backgroundColor,
    style.cornerStyle,
  );
  drawFinderEye(
    ctx,
    originX + (size - FINDER_SIZE) * moduleSize,
    originY,
    moduleSize,
    topColor,
    style.backgroundColor,
    style.cornerStyle,
  );
  drawFinderEye(
    ctx,
    originX,
    originY + (size - FINDER_SIZE) * moduleSize,
    moduleSize,
    bottomColor,
    style.backgroundColor,
    style.cornerStyle,
  );

  if (logo && logoBox > 0) {
    drawLogoPlate(
      ctx,
      originX + (size * moduleSize) / 2,
      originY + (size * moduleSize) / 2,
      logoBox,
      logo,
    );
  }

  drawQrFrame(ctx, style, canvasSize, qrLeft, qrTop, qrSide);

  ctx.restore();
}

interface FramePadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

function getFramePadding(frameStyle: FrameStyle, canvasSize: number): FramePadding {
  if (frameStyle === "none") {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const edge = Math.round(canvasSize * 0.06);

  if (frameStyle === "scan") {
    return {
      top: edge,
      right: edge,
      bottom: Math.round(canvasSize * 0.145),
      left: edge,
    };
  }

  return { top: edge, right: edge, bottom: edge, left: edge };
}

function drawQrFrame(
  ctx: CanvasRenderingContext2D,
  style: StyleState,
  canvasSize: number,
  qrLeft: number,
  qrTop: number,
  qrSide: number,
) {
  if (style.frameStyle === "none") {
    return;
  }

  const accent = style.primaryColor;
  const accentEnd = style.gradientEnabled ? style.secondaryColor : style.primaryColor;
  const stroke = Math.max(10, canvasSize * 0.014);
  const gap = stroke * 0.9;
  const x = qrLeft - gap;
  const y = qrTop - gap;
  const side = qrSide + gap * 2;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (style.frameStyle === "modern") {
    const arm = side * 0.18;
    ctx.lineWidth = stroke * 1.35;
    ctx.strokeStyle = accent;
    drawCornerBracket(ctx, x, y, arm, "tl");
    drawCornerBracket(ctx, x + side, y, arm, "tr");
    ctx.strokeStyle = accentEnd;
    drawCornerBracket(ctx, x, y + side, arm, "bl");
    drawCornerBracket(ctx, x + side, y + side, arm, "br");
    ctx.restore();
    return;
  }

  ctx.lineWidth = stroke;
  ctx.strokeStyle = accent;
  ctx.beginPath();
  ctx.roundRect(x, y, side, side, side * 0.08);
  ctx.stroke();

  if (style.frameStyle === "scan") {
    const spaceBelow = canvasSize - (qrTop + qrSide);
    const bannerHeight = Math.min(spaceBelow * 0.58, canvasSize * 0.078);
    const bannerWidth = Math.min(side * 0.72, qrSide);
    const bannerX = qrLeft + (qrSide - bannerWidth) / 2;
    const bannerY = qrTop + qrSide + (spaceBelow - bannerHeight) / 2;
    const gradient = ctx.createLinearGradient(bannerX, bannerY, bannerX + bannerWidth, bannerY);
    gradient.addColorStop(0, accent);
    gradient.addColorStop(1, accentEnd);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(bannerX, bannerY, bannerWidth, bannerHeight, bannerHeight / 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = `700 ${Math.round(bannerHeight * 0.4)}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SCAN ME", bannerX + bannerWidth / 2, bannerY + bannerHeight / 2);
  }

  ctx.restore();
}

function drawCornerBracket(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  arm: number,
  corner: "tl" | "tr" | "bl" | "br",
) {
  ctx.beginPath();

  if (corner === "tl") {
    ctx.moveTo(x, y + arm);
    ctx.lineTo(x, y);
    ctx.lineTo(x + arm, y);
  } else if (corner === "tr") {
    ctx.moveTo(x - arm, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + arm);
  } else if (corner === "bl") {
    ctx.moveTo(x, y - arm);
    ctx.lineTo(x, y);
    ctx.lineTo(x + arm, y);
  } else {
    ctx.moveTo(x - arm, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y - arm);
  }

  ctx.stroke();
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
  lightColor: string,
  cornerStyle: CornerStyle,
) {
  const outer = FINDER_SIZE * moduleSize;
  const radii = finderRadii(outer, cornerStyle);

  ctx.fillStyle = color;
  ctx.beginPath();
  roundRect(ctx, x, y, outer, outer, radii);
  ctx.fill();

  const whiteInset = moduleSize;
  ctx.fillStyle = lightColor;
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
