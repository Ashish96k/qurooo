"use client";

import { create } from "zustand";

import { createInitialEditorState, quickPresets } from "@/features/qr/model/defaults";
import type {
  ActiveCustomizeSection,
  ContentValues,
  ExportFormat,
  QuickPreset,
  QrEditorState,
  QrType,
  StyleState,
} from "@/features/qr/model/types";

interface QrEditorActions {
  setQrType: (qrType: QrType) => void;
  updateContent: <K extends keyof ContentValues>(
    key: K,
    value: ContentValues[K],
  ) => void;
  updateStyle: (patch: Partial<StyleState>) => void;
  setExportFormat: (format: ExportFormat) => void;
  setActiveCustomizeSection: (section: ActiveCustomizeSection) => void;
  toggleCustomizeSection: (section: ActiveCustomizeSection) => void;
  applyPreset: (presetId: QuickPreset["id"]) => void;
  resetEditor: () => void;
}

type QrEditorStore = QrEditorState & QrEditorActions;

export const useQrEditorStore = create<QrEditorStore>((set) => ({
  ...createInitialEditorState(),
  setQrType: (qrType) =>
    set((state) => ({
      content: {
        ...state.content,
        qrType,
      },
    })),
  updateContent: (key, value) =>
    set((state) => ({
      content: {
        ...state.content,
        values: {
          ...state.content.values,
          [key]: value,
        },
      },
    })),
  updateStyle: (patch) =>
    set((state) => ({
      style: {
        ...state.style,
        ...patch,
      },
    })),
  setExportFormat: (format) =>
    set(() => ({
      export: {
        format,
      },
    })),
  setActiveCustomizeSection: (section) =>
    set((state) => ({
      ui: {
        ...state.ui,
        activeCustomizeSection: section,
      },
    })),
  toggleCustomizeSection: (section) =>
    set((state) => {
      const isExpanded = state.ui.expandedSections.includes(section);

      return {
        ui: {
          ...state.ui,
          expandedSections: isExpanded
            ? state.ui.expandedSections.filter((item) => item !== section)
            : [...state.ui.expandedSections, section],
        },
      };
    }),
  applyPreset: (presetId) =>
    set((state) => {
      const preset = quickPresets.find((item) => item.id === presetId);

      if (!preset) {
        return {};
      }

      return {
        style: {
          ...state.style,
          ...preset.style,
        },
        ui: {
          ...state.ui,
          highlightedPresetId: presetId,
          activeCustomizeSection: "colors",
        },
      };
    }),
  resetEditor: () =>
    set(() => ({
      ...createInitialEditorState(),
    })),
}));
