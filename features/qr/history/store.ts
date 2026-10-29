"use client";

import { create } from "zustand";

import {
  createHistoryItem,
  readHistoryItems,
  upsertHistoryItem,
  writeHistoryItems,
} from "@/features/qr/history/storage";
import type { HistoryItem } from "@/features/qr/history/types";
import type { ContentState, StyleState } from "@/features/qr/model/types";

interface QrHistoryState {
  items: HistoryItem[];
  hydrated: boolean;
  hydrate: () => void;
  addFromEditor: (
    state: { content: ContentState; style: StyleState },
    thumbnail?: string | null,
  ) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useQrHistoryStore = create<QrHistoryState>((set, get) => ({
  items: [],
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) {
      return;
    }

    set({
      items: readHistoryItems(),
      hydrated: true,
    });
  },
  addFromEditor: (state, thumbnail = null) => {
    const current = get().hydrated ? get().items : readHistoryItems();
    const next = writeHistoryItems(
      upsertHistoryItem(current, createHistoryItem(state, thumbnail)),
    );

    set({
      items: next,
      hydrated: true,
    });
  },
  remove: (id) => {
    const current = get().hydrated ? get().items : readHistoryItems();
    const next = writeHistoryItems(current.filter((item) => item.id !== id));

    set({
      items: next,
      hydrated: true,
    });
  },
  clear: () => {
    const next = writeHistoryItems([]);

    set({
      items: next,
      hydrated: true,
    });
  },
}));
