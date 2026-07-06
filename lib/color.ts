function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized,
    16,
  );

  return {
    b: bigint & 255,
    g: (bigint >> 8) & 255,
    r: (bigint >> 16) & 255,
  };
}

export function mixHexColors(colorA: string, colorB: string, t: number) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  const clamped = Math.min(1, Math.max(0, t));

  const r = Math.round(a.r + (b.r - a.r) * clamped);
  const g = Math.round(a.g + (b.g - a.g) * clamped);
  const bl = Math.round(a.b + (b.b - a.b) * clamped);

  return `rgb(${r}, ${g}, ${bl})`;
}
