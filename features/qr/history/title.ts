import { getContentFieldValue, getTypeMetaByValue } from "@/features/qr/selectors/editor-selectors";
import type { ContentState } from "@/features/qr/model/types";

const TITLE_LIMIT = 48;

export function getHistoryTitle(content: ContentState): string {
  const value = getContentFieldValue(content).trim();

  if (!value) {
    return getTypeMetaByValue(content.qrType).label;
  }

  if (value.length <= TITLE_LIMIT) {
    return value;
  }

  return `${value.slice(0, TITLE_LIMIT - 1)}…`;
}
