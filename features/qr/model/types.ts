export type QrType = "url" | "text" | "wifi" | "email" | "phone" | "sms" | "vcard";

export type DotStyle = "dots" | "rounded" | "pixel" | "diamond";

export type CornerStyle = "soft" | "square" | "leaf" | "circle";

export type FrameStyle = "none" | "scan" | "minimal" | "modern";

export type ExportFormat = "png" | "svg" | "pdf" | "webp" | "eps";

export type GradientDirection = "135deg" | "90deg" | "180deg";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export type ActiveCustomizeSection =
  | "dots"
  | "corners"
  | "colors"
  | "logo"
  | "frame"
  | "options";

export interface QrTypeOption {
  value: QrType;
  label: string;
  shortLabel: string;
  description: string;
  placeholder: string;
}

export interface QuickPreset {
  id: string;
  label: string;
  hint: string;
  style: Partial<StyleState>;
}

export interface ContentValues {
  url: string;
  text: string;
  wifi: {
    ssid: string;
    password: string;
    security: "WPA" | "WEP" | "nopass";
  };
  email: {
    to: string;
    subject: string;
    body: string;
  };
  phone: string;
  sms: {
    number: string;
    message: string;
  };
  vcard: {
    firstName: string;
    lastName: string;
    organization: string;
    phone: string;
    email: string;
  };
}

export interface ContentState {
  qrType: QrType;
  values: ContentValues;
}

export interface StyleState {
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  primaryColor: string;
  secondaryColor: string;
  gradientEnabled: boolean;
  gradientDirection: GradientDirection;
  backgroundColor: string;
  logoScale: number;
  frameStyle: FrameStyle;
  margin: number;
  errorCorrection: ErrorCorrectionLevel;
}

export interface PreviewState {
  size: number;
  zoom: number;
  showScanTest: boolean;
}

export interface ExportState {
  format: ExportFormat;
}

export interface UiState {
  activeCustomizeSection: ActiveCustomizeSection;
  expandedSections: ActiveCustomizeSection[];
  highlightedPresetId: string | null;
}

export interface QrEditorState {
  content: ContentState;
  style: StyleState;
  preview: PreviewState;
  export: ExportState;
  ui: UiState;
}
