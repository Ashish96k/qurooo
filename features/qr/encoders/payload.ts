import type { ContentState, ContentValues } from "@/features/qr/model/types";

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

export function withUtm(url: string, utm: ContentValues["utm"]): string {
  if (!url) {
    return "";
  }

  const source = utm.source.trim();
  const medium = utm.medium.trim();
  const campaign = utm.campaign.trim();

  if (!source && !medium && !campaign) {
    return url;
  }

  try {
    const parsed = new URL(url);

    if (source) {
      parsed.searchParams.set("utm_source", source);
    }

    if (medium) {
      parsed.searchParams.set("utm_medium", medium);
    }

    if (campaign) {
      parsed.searchParams.set("utm_campaign", campaign);
    }

    return parsed.toString();
  } catch {
    return url;
  }
}

/** WIFI QR values escape backslash, semicolon, comma, colon, and quote. */
function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\n|\r/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function compactPhone(value: string): string {
  return value.trim().replace(/\s+/g, "");
}

export function encodeWifiPayload(wifi: ContentValues["wifi"]): string {
  const ssid = wifi.ssid.trim();

  if (!ssid) {
    return "";
  }

  const parts = [`T:${wifi.security}`, `S:${escapeWifi(ssid)}`];

  if (wifi.security !== "nopass" && wifi.password) {
    parts.push(`P:${escapeWifi(wifi.password)}`);
  }

  return `WIFI:${parts.join(";")};;`;
}

export function encodeEmailPayload(email: ContentValues["email"]): string {
  const to = email.to.trim();

  if (!to) {
    return "";
  }

  const params = new URLSearchParams();
  const subject = email.subject.trim();
  const body = email.body.trim();

  if (subject) {
    params.set("subject", subject);
  }

  if (body) {
    params.set("body", body);
  }

  const query = params.toString();
  return query ? `mailto:${to}?${query}` : `mailto:${to}`;
}

export function encodePhonePayload(phone: string): string {
  const number = compactPhone(phone);
  return number ? `tel:${number}` : "";
}

export function encodeSmsPayload(sms: ContentValues["sms"]): string {
  const number = compactPhone(sms.number);

  if (!number) {
    return "";
  }

  const message = sms.message.trim();
  return message ? `sms:${number}?body=${encodeURIComponent(message)}` : `sms:${number}`;
}

export function encodeVCardPayload(card: ContentValues["vcard"]): string {
  const firstName = card.firstName.trim();
  const lastName = card.lastName.trim();
  const organization = card.organization.trim();
  const phone = card.phone.trim();
  const email = card.email.trim();

  if (!firstName && !lastName && !organization && !phone && !email) {
    return "";
  }

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || organization || email || phone;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;`,
    `FN:${escapeVCard(fullName)}`,
  ];

  if (organization) {
    lines.push(`ORG:${escapeVCard(organization)}`);
  }

  if (phone) {
    lines.push(`TEL;TYPE=CELL:${escapeVCard(phone)}`);
  }

  if (email) {
    lines.push(`EMAIL:${escapeVCard(email)}`);
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export function encodeQrPayload(content: ContentState): string {
  switch (content.qrType) {
    case "url":
      return withUtm(normalizeUrl(content.values.url), content.values.utm) || FALLBACK_PAYLOAD;
    case "text":
      return content.values.text.trim() || FALLBACK_PAYLOAD;
    case "wifi":
      return encodeWifiPayload(content.values.wifi) || FALLBACK_PAYLOAD;
    case "email":
      return encodeEmailPayload(content.values.email) || FALLBACK_PAYLOAD;
    case "phone":
      return encodePhonePayload(content.values.phone) || FALLBACK_PAYLOAD;
    case "sms":
      return encodeSmsPayload(content.values.sms) || FALLBACK_PAYLOAD;
    case "vcard":
      return encodeVCardPayload(content.values.vcard) || FALLBACK_PAYLOAD;
  }
}
