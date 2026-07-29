import type { CornerStyle, DotStyle } from "@/features/qr/model/types";
import { cn } from "@/lib/cn";

interface StylePresetThumbnailProps {
  primary: string;
  secondary?: string;
  gradientEnabled?: boolean;
  dotStyle?: DotStyle;
  cornerStyle?: CornerStyle;
  className?: string;
}

/**
 * Decorative mini-QR matching the Quick Style Picks mockup:
 * soft finders, rounded modules, circular center motif, monochrome fill.
 */
const MODULES: Array<[number, number]> = [
  [0, 4],
  [0, 5],
  [0, 6],
  [1, 4],
  [1, 6],
  [2, 4],
  [2, 5],
  [2, 7],
  [3, 0],
  [3, 2],
  [3, 4],
  [3, 6],
  [3, 8],
  [3, 10],
  [4, 1],
  [4, 3],
  [4, 7],
  [4, 9],
  [5, 0],
  [5, 2],
  [5, 8],
  [5, 10],
  [6, 1],
  [6, 3],
  [6, 7],
  [6, 9],
  [7, 0],
  [7, 2],
  [7, 4],
  [7, 6],
  [7, 8],
  [7, 10],
  [8, 4],
  [8, 5],
  [8, 7],
  [8, 9],
  [9, 4],
  [9, 6],
  [9, 8],
  [9, 10],
  [10, 5],
  [10, 7],
  [10, 9],
];

const SIZE = 11;
const FINDER = 3;

function isInFinder(row: number, col: number) {
  const last = SIZE - FINDER;
  return (
    (row < FINDER && col < FINDER) ||
    (row < FINDER && col >= last) ||
    (row >= last && col < FINDER)
  );
}

function isInCenterClear(row: number, col: number) {
  const center = (SIZE - 1) / 2;
  return Math.hypot(row - center, col - center) < 1.65;
}

function finderRadius(cornerStyle: CornerStyle | undefined, classic: boolean) {
  if (classic || cornerStyle === "square") return 1.2;
  if (cornerStyle === "circle") return 999;
  return 2.4;
}

function moduleRadius(dotStyle: DotStyle | undefined, classic: boolean, size: number) {
  if (classic || dotStyle === "pixel") return size * 0.18;
  if (dotStyle === "rounded") return size * 0.35;
  return size * 0.5; // dots / default — fully round like mockup
}

export function StylePresetThumbnail({
  primary,
  dotStyle = "dots",
  cornerStyle = "soft",
  className,
}: StylePresetThumbnailProps) {
  const classic = primary === "#111827" || primary === "#000000";
  const view = 100;
  const pad = 8;
  const grid = view - pad * 2;
  const cell = grid / SIZE;
  const last = (SIZE - FINDER) * cell;
  const fSize = FINDER * cell;
  const fOuterR = finderRadius(cornerStyle, classic);
  const color = primary;

  const modules = MODULES.filter(
    ([row, col]) => !isInFinder(row, col) && !isInCenterClear(row, col),
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[10px] border border-[rgba(15,23,42,0.06)] bg-[#f7f8fa]",
        className,
      )}
    >
      <svg viewBox={`0 0 ${view} ${view}`} className="block h-full w-full" aria-hidden>
        <rect width={view} height={view} fill="#f7f8fa" />
        <rect
          x={pad - 2}
          y={pad - 2}
          width={grid + 4}
          height={grid + 4}
          rx={8}
          fill="#ffffff"
        />

        <g transform={`translate(${pad}, ${pad})`}>
          {/* Finders TL / TR / BL */}
          {[
            [0, 0],
            [last, 0],
            [0, last],
          ].map(([x, y]) => {
            const inset = fSize * 0.22;
            const eye = fSize * 0.34;
            return (
              <g key={`${x}-${y}`} transform={`translate(${x}, ${y})`}>
                <rect
                  width={fSize}
                  height={fSize}
                  rx={fOuterR}
                  ry={fOuterR}
                  fill={color}
                />
                <rect
                  x={inset}
                  y={inset}
                  width={fSize - inset * 2}
                  height={fSize - inset * 2}
                  rx={fOuterR * 0.85}
                  ry={fOuterR * 0.85}
                  fill="#ffffff"
                />
                <rect
                  x={(fSize - eye) / 2}
                  y={(fSize - eye) / 2}
                  width={eye}
                  height={eye}
                  rx={classic ? 1 : eye * 0.45}
                  ry={classic ? 1 : eye * 0.45}
                  fill={color}
                />
              </g>
            );
          })}

          {/* Data modules */}
          {modules.map(([row, col]) => {
            const size = cell * (classic ? 0.82 : 0.68);
            const x = col * cell + (cell - size) / 2;
            const y = row * cell + (cell - size) / 2;
            const rx = moduleRadius(dotStyle, classic, size);
            return (
              <rect
                key={`${row}-${col}`}
                x={x}
                y={y}
                width={size}
                height={size}
                rx={rx}
                ry={rx}
                fill={color}
              />
            );
          })}

          {/* Circular center motif (matches mockup) */}
          <circle
            cx={grid / 2}
            cy={grid / 2}
            r={cell * 1.55}
            fill="none"
            stroke={color}
            strokeWidth={cell * 0.38}
          />
          <circle cx={grid / 2} cy={grid / 2} r={cell * 0.55} fill={color} />
        </g>
      </svg>
    </div>
  );
}
