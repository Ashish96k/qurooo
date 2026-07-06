import { qrTypeOptions } from "@/features/qr/model/defaults";
import type { QrEditorState } from "@/features/qr/model/types";

export function getTypeMetaByValue(qrType: QrEditorState["content"]["qrType"]) {
  return qrTypeOptions.find((option) => option.value === qrType) ?? qrTypeOptions[0];
}

export function getActiveTypeMeta(state: QrEditorState) {
  return getTypeMetaByValue(state.content.qrType);
}

export function getActiveFieldValue(state: QrEditorState) {
  switch (state.content.qrType) {
    case "text":
      return state.content.values.text;
    case "phone":
      return state.content.values.phone;
    case "url":
    default:
      return state.content.values.url;
  }
}

export function getPreviewFill(state: QrEditorState) {
  if (!state.style.gradientEnabled) {
    return state.style.primaryColor;
  }

  return `linear-gradient(${state.style.gradientDirection}, ${state.style.primaryColor} 0%, ${state.style.secondaryColor} 100%)`;
}

export function getPreviewStatusLabel(state: QrEditorState) {
  return `${state.style.dotStyle} dots, ${state.style.cornerStyle} corners, ${state.export.format.toUpperCase()} export`;
}
