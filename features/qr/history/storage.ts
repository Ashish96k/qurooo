import { encodeQrPayload } from "@/features/qr/encoders/payload";
import { createInitialEditorState } from "@/features/qr/model/defaults";
import type {
  ContentState,
  ContentValues,
  QrType,
  StyleState,
} from "@/features/qr/model/types";
import type { HistoryItem, HistorySnapshot } from "@/features/qr/history/types";
import { getHistoryTitle } from "@/features/qr/history/title";

export const HISTORY_STORAGE_KEY = "qurooo:history";
export const MAX_HISTORY_ITEMS = 20;

const HISTORY_VERSION = 1;
const MAX_LOGO_CHARS = 80_000;

const QR_TYPES: QrType[] = ["url", "text", "wifi", "email", "phone", "sms", "vcard"];

interface StoredHistory {
  version: number;
  items: HistoryItem[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isQrType(value: unknown): value is QrType {
  return typeof value === "string" && QR_TYPES.includes(value as QrType);
}

function createHistoryId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `hist-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function historyFingerprint(item: Pick<HistoryItem, "payload" | "snapshot">) {
  const { logoSrc, ...style } = item.snapshot.style;

  return JSON.stringify({
    payload: item.payload,
    qrType: item.snapshot.content.qrType,
    style,
    hasLogo: Boolean(logoSrc),
  });
}

function isHistorySnapshot(value: unknown): value is HistorySnapshot {
  if (!isRecord(value) || !isRecord(value.content) || !isRecord(value.style)) {
    return false;
  }

  return isQrType(value.content.qrType) && isRecord(value.content.values);
}

function isHistoryItem(value: unknown): value is HistoryItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.createdAt === "number" &&
    isQrType(value.qrType) &&
    typeof value.title === "string" &&
    typeof value.payload === "string" &&
    (value.thumbnail === null || typeof value.thumbnail === "string") &&
    isHistorySnapshot(value.snapshot)
  );
}

function sanitizeItems(value: unknown): HistoryItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isHistoryItem).slice(0, MAX_HISTORY_ITEMS);
}

export function readHistoryItems(): HistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (isRecord(parsed) && parsed.version === HISTORY_VERSION) {
      return sanitizeItems(parsed.items);
    }

    if (Array.isArray(parsed)) {
      return sanitizeItems(parsed);
    }

    return [];
  } catch {
    return [];
  }
}

function serializeHistory(items: HistoryItem[]) {
  const stored: StoredHistory = {
    version: HISTORY_VERSION,
    items,
  };

  return JSON.stringify(stored);
}

function stripHeavyFields(item: HistoryItem): HistoryItem {
  return {
    ...item,
    thumbnail: null,
    snapshot: {
      ...item.snapshot,
      style: {
        ...item.snapshot.style,
        logoSrc: null,
      },
    },
  };
}

export function writeHistoryItems(items: HistoryItem[]): HistoryItem[] {
  if (typeof window === "undefined") {
    return items;
  }

  let next = items.slice(0, MAX_HISTORY_ITEMS);

  for (let attempt = 0; attempt < MAX_HISTORY_ITEMS + 2; attempt += 1) {
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, serializeHistory(next));
      return next;
    } catch {
      if (next.length === 0) {
        return [];
      }

      const stripped = next.map(stripHeavyFields);
      const strippedSize = serializeHistory(stripped).length;
      const currentSize = serializeHistory(next).length;

      if (strippedSize < currentSize) {
        next = stripped;
        continue;
      }

      next = next.slice(0, -1);
    }
  }

  return next;
}

export function upsertHistoryItem(items: HistoryItem[], incoming: HistoryItem): HistoryItem[] {
  const matchIndex = items.findIndex(
    (item) => historyFingerprint(item) === historyFingerprint(incoming),
  );

  if (matchIndex >= 0) {
    const current = items[matchIndex];
    const updated: HistoryItem = {
      ...current,
      createdAt: incoming.createdAt,
      title: incoming.title,
      thumbnail: incoming.thumbnail ?? current.thumbnail,
      snapshot: incoming.snapshot,
    };

    return [updated, ...items.filter((_, index) => index !== matchIndex)].slice(
      0,
      MAX_HISTORY_ITEMS,
    );
  }

  return [incoming, ...items].slice(0, MAX_HISTORY_ITEMS);
}

function withCappedLogo(style: StyleState): StyleState {
  const cloned = cloneJson(style);

  if (cloned.logoSrc && cloned.logoSrc.length > MAX_LOGO_CHARS) {
    cloned.logoSrc = null;
  }

  return cloned;
}

export function createHistoryItem(
  state: { content: ContentState; style: StyleState },
  thumbnail: string | null,
): HistoryItem {
  const snapshot: HistorySnapshot = {
    content: cloneJson(state.content),
    style: withCappedLogo(state.style),
  };

  return {
    id: createHistoryId(),
    createdAt: Date.now(),
    qrType: snapshot.content.qrType,
    title: getHistoryTitle(snapshot.content),
    payload: encodeQrPayload(snapshot.content),
    thumbnail,
    snapshot,
  };
}

export function mergeHistorySnapshot(snapshot: HistorySnapshot): HistorySnapshot {
  const initial = createInitialEditorState();
  const values = snapshot.content.values;
  const initialValues = initial.content.values;

  const mergedValues: ContentValues = {
    ...initialValues,
    ...values,
    wifi: { ...initialValues.wifi, ...values.wifi },
    email: { ...initialValues.email, ...values.email },
    sms: { ...initialValues.sms, ...values.sms },
    vcard: { ...initialValues.vcard, ...values.vcard },
    utm: { ...initialValues.utm, ...values.utm },
  };

  return {
    content: {
      qrType: isQrType(snapshot.content.qrType) ? snapshot.content.qrType : initial.content.qrType,
      values: mergedValues,
    },
    style: {
      ...initial.style,
      ...snapshot.style,
    },
  };
}
