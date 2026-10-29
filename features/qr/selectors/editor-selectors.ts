import { encodeQrPayload } from "@/features/qr/encoders/payload";
import { qrTypeOptions } from "@/features/qr/model/defaults";
import type { QrEditorState } from "@/features/qr/model/types";

export function getTypeMetaByValue(qrType: QrEditorState["content"]["qrType"]) {
  return qrTypeOptions.find((option) => option.value === qrType) ?? qrTypeOptions[0];
}

export function getActiveTypeMeta(state: QrEditorState) {
  return getTypeMetaByValue(state.content.qrType);
}

export function getContentFieldValue(content: QrEditorState["content"]) {
  const { qrType, values } = content;

  switch (qrType) {
    case "text":
      return values.text;
    case "wifi":
      return values.wifi.ssid;
    case "email":
      return values.email.to;
    case "phone":
      return values.phone;
    case "sms":
      return values.sms.number;
    case "vcard":
      return [values.vcard.firstName, values.vcard.lastName].filter(Boolean).join(" ");
    case "url":
      return values.url;
  }
}

export function getActiveFieldValue(state: QrEditorState) {
  return getContentFieldValue(state.content);
}

export function getQrPayload(state: QrEditorState) {
  return encodeQrPayload(state.content);
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
