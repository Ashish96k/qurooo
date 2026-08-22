import type { ContentState } from "@/features/qr/model/types";

export const FALLBACK_PAYLOAD = "https://qurooo.app";

const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

export function normalizeUrl(raw: string): string {
  const value = raw.trim();

  if (!value) {
    return "";
  }

  if (HAS_SCHEME.test(value)) {
    return value;
  }

  if (value.startsWith("//")) {
    return `https:${value}`;
  }

  return `https://${value}`;
}

export function encodeQrPayload(content: ContentState): string {
  switch (content.qrType) {
    case "url":
      return normalizeUrl(content.values.url) || FALLBACK_PAYLOAD;
    case "text": {
      const text = content.values.text.trim();
      return text || FALLBACK_PAYLOAD;
    }
    default:
      return normalizeUrl(content.values.url) || FALLBACK_PAYLOAD;
  }
}
