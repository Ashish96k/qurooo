import type { ContentState, QrType, StyleState } from "@/features/qr/model/types";

export interface HistorySnapshot {
  content: ContentState;
  style: StyleState;
}

export interface HistoryItem {
  id: string;
  createdAt: number;
  qrType: QrType;
  title: string;
  payload: string;
  thumbnail: string | null;
  snapshot: HistorySnapshot;
}
