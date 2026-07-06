import type {
  ExportFormat,
  QrEditorState,
  QrTypeOption,
  QuickPreset,
} from "@/features/qr/model/types";

export const qrTypeOptions: QrTypeOption[] = [
  {
    value: "url",
    label: "URL",
    shortLabel: "URL",
    description: "Send people to any website instantly.",
    placeholder: "https://www.example.com",
  },
  {
    value: "text",
    label: "Plain Text",
    shortLabel: "Text",
    description: "Share plain text, notes, or short copy.",
    placeholder: "Write your message",
  },
  {
    value: "wifi",
    label: "Wi-Fi",
    shortLabel: "Wi-Fi",
    description: "Let visitors join a network in one scan.",
    placeholder: "Wi-Fi credentials",
  },
  {
    value: "email",
    label: "Email",
    shortLabel: "Email",
    description: "Pre-fill an email address and subject.",
    placeholder: "hello@qurooo.com",
  },
  {
    value: "phone",
    label: "Phone",
    shortLabel: "Phone",
    description: "Open the device dialer with one tap.",
    placeholder: "+1 (555) 123-4567",
  },
  {
    value: "sms",
    label: "SMS",
    shortLabel: "SMS",
    description: "Start a text message with a prefilled body.",
    placeholder: "Message starter",
  },
  {
    value: "vcard",
    label: "vCard",
    shortLabel: "vCard",
    description: "Share contact details in a scan-friendly card.",
    placeholder: "Contact details",
  },
];

export const quickPresets: QuickPreset[] = [
  {
    id: "classic",
    label: "Classic",
    hint: "Clean black on white",
    style: {
      primaryColor: "#111827",
      secondaryColor: "#111827",
      gradientEnabled: false,
      dotStyle: "pixel",
      cornerStyle: "square",
      frameStyle: "none",
    },
  },
  {
    id: "ocean",
    label: "Ocean",
    hint: "Fresh cyan blend",
    style: {
      primaryColor: "#14c8d8",
      secondaryColor: "#5b6dff",
      gradientEnabled: true,
      dotStyle: "dots",
      cornerStyle: "soft",
      frameStyle: "minimal",
    },
  },
  {
    id: "forest",
    label: "Forest",
    hint: "Natural green system",
    style: {
      primaryColor: "#0f9d7a",
      secondaryColor: "#1f7a5c",
      gradientEnabled: true,
      dotStyle: "rounded",
      cornerStyle: "leaf",
      frameStyle: "modern",
    },
  },
  {
    id: "sunset",
    label: "Sunset",
    hint: "Warm coral gradient",
    style: {
      primaryColor: "#fb7185",
      secondaryColor: "#8b5cf6",
      gradientEnabled: true,
      dotStyle: "rounded",
      cornerStyle: "circle",
      frameStyle: "scan",
    },
  },
  {
    id: "neon",
    label: "Neon",
    hint: "Vivid futuristic accent",
    style: {
      primaryColor: "#22d3ee",
      secondaryColor: "#a855f7",
      gradientEnabled: true,
      dotStyle: "diamond",
      cornerStyle: "soft",
      frameStyle: "modern",
    },
  },
];

export const exportFormatOptions: Array<{ value: ExportFormat; label: string }> = [
  { value: "png", label: "PNG" },
  { value: "svg", label: "SVG" },
  { value: "pdf", label: "PDF" },
  { value: "webp", label: "WebP" },
  { value: "eps", label: "EPS" },
];

export const dotStyleOptions = [
  { value: "dots", label: "Dots" },
  { value: "rounded", label: "Rounded" },
  { value: "pixel", label: "Pixel" },
  { value: "diamond", label: "Diamond" },
] as const;

export const cornerStyleOptions = [
  { value: "soft", label: "Soft" },
  { value: "square", label: "Square" },
  { value: "leaf", label: "Leaf" },
  { value: "circle", label: "Circle" },
] as const;

export const frameStyleOptions = [
  { value: "none", label: "None" },
  { value: "scan", label: "Scan Me" },
  { value: "minimal", label: "Minimal" },
  { value: "modern", label: "Modern" },
] as const;

export function createInitialEditorState(): QrEditorState {
  return {
    content: {
      qrType: "url",
      values: {
        url: "https://qurooo.app",
        text: "",
        wifi: {
          ssid: "",
          password: "",
          security: "WPA",
        },
        email: {
          to: "",
          subject: "",
          body: "",
        },
        phone: "",
        sms: {
          number: "",
          message: "",
        },
        vcard: {
          firstName: "",
          lastName: "",
          organization: "",
          phone: "",
          email: "",
        },
      },
    },
    style: {
      dotStyle: "dots",
      cornerStyle: "soft",
      primaryColor: "#1ecad8",
      secondaryColor: "#7552ff",
      gradientEnabled: true,
      gradientDirection: "135deg",
      backgroundColor: "#ffffff",
      logoScale: 24,
      frameStyle: "scan",
      margin: 16,
      errorCorrection: "H",
    },
    preview: {
      size: 360,
      zoom: 100,
      showScanTest: false,
    },
    export: {
      format: "png",
    },
    ui: {
      activeCustomizeSection: "dots",
      expandedSections: ["dots", "colors", "frame", "options"],
      highlightedPresetId: "ocean",
    },
  };
}
