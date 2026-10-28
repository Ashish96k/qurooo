"use client";

import {
  Contact,
  Info,
  Lightbulb,
  Link as LinkIcon,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Sparkles,
  Type,
  Wifi,
  Zap,
} from "lucide-react";

import { quickPresets } from "@/features/qr/model/defaults";
import type { ContentValues, QrType } from "@/features/qr/model/types";
import { getTypeMetaByValue } from "@/features/qr/selectors/editor-selectors";
import { useQrEditorStore } from "@/features/qr/store/editor-store";
import { cn } from "@/lib/cn";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { ProTipMascot } from "./pro-tip-mascot";
import { StylePresetThumbnail } from "./style-preset-thumbnail";

const fieldIcons: Record<QrType, typeof LinkIcon> = {
  url: LinkIcon,
  text: Type,
  wifi: Wifi,
  email: Mail,
  phone: Phone,
  sms: MessageSquare,
  vcard: Contact,
};

function CheckBadge() {
  return (
    <span className="absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--text-primary)]">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 13l4 4L19 7"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-xs font-medium text-[var(--text-secondary)]">{children}</span>;
}

const textAreaClassName =
  "min-h-24 w-full resize-y rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] shadow-[0_8px_24px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)]/45 focus:ring-4 focus:ring-[var(--accent-primary)]/10";

const selectClassName =
  "h-12 w-full rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-white px-4 text-sm font-medium text-[var(--text-primary)] shadow-[0_8px_24px_rgba(15,23,42,0.04)] outline-none transition focus:border-[var(--accent-primary)]/45 focus:ring-4 focus:ring-[var(--accent-primary)]/10";

function ContentFields({
  qrType,
  values,
  urlPlaceholder,
  textPlaceholder,
  onChange,
}: {
  qrType: QrType;
  values: ContentValues;
  urlPlaceholder: string;
  textPlaceholder: string;
  onChange: <K extends keyof ContentValues>(key: K, value: ContentValues[K]) => void;
}) {
  if (qrType === "url") {
    return (
      <div className="relative">
        <Input
          aria-label="Website URL"
          placeholder={urlPlaceholder}
          value={values.url}
          onChange={(event) => onChange("url", event.target.value)}
          className="pr-11"
        />
        <CheckBadge />
      </div>
    );
  }

  if (qrType === "text") {
    return (
      <div className="relative">
        <Input
          aria-label="Plain text"
          placeholder={textPlaceholder}
          value={values.text}
          onChange={(event) => onChange("text", event.target.value)}
          className="pr-11"
        />
        <CheckBadge />
      </div>
    );
  }

  if (qrType === "wifi") {
    const wifi = values.wifi;

    return (
      <div className="space-y-3">
        <label className="block space-y-1.5">
          <FieldLabel>Network name</FieldLabel>
          <Input
            aria-label="Wi-Fi network name"
            placeholder="Office Wi-Fi"
            value={wifi.ssid}
            onChange={(event) => onChange("wifi", { ...wifi, ssid: event.target.value })}
          />
        </label>
        <label className="block space-y-1.5">
          <FieldLabel>Security</FieldLabel>
          <select
            aria-label="Wi-Fi security"
            value={wifi.security}
            onChange={(event) =>
              onChange("wifi", {
                ...wifi,
                security: event.target.value as ContentValues["wifi"]["security"],
              })
            }
            className={selectClassName}
          >
            <option value="WPA">WPA / WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">None</option>
          </select>
        </label>
        {wifi.security === "nopass" ? null : (
          <label className="block space-y-1.5">
            <FieldLabel>Password</FieldLabel>
            <Input
              aria-label="Wi-Fi password"
              placeholder="Network password"
              value={wifi.password}
              onChange={(event) => onChange("wifi", { ...wifi, password: event.target.value })}
            />
          </label>
        )}
      </div>
    );
  }

  if (qrType === "email") {
    const email = values.email;

    return (
      <div className="space-y-3">
        <label className="block space-y-1.5">
          <FieldLabel>Email address</FieldLabel>
          <Input
            type="email"
            aria-label="Email address"
            placeholder="hello@qurooo.com"
            value={email.to}
            onChange={(event) => onChange("email", { ...email, to: event.target.value })}
          />
        </label>
        <label className="block space-y-1.5">
          <FieldLabel>Subject</FieldLabel>
          <Input
            aria-label="Email subject"
            placeholder="Hello from Qurooo"
            value={email.subject}
            onChange={(event) => onChange("email", { ...email, subject: event.target.value })}
          />
        </label>
        <label className="block space-y-1.5">
          <FieldLabel>Message</FieldLabel>
          <textarea
            aria-label="Email message"
            placeholder="Write a short message"
            value={email.body}
            onChange={(event) => onChange("email", { ...email, body: event.target.value })}
            className={textAreaClassName}
          />
        </label>
      </div>
    );
  }

  if (qrType === "phone") {
    return (
      <div className="relative">
        <Input
          type="tel"
          aria-label="Phone number"
          placeholder="+1 (555) 123-4567"
          value={values.phone}
          onChange={(event) => onChange("phone", event.target.value)}
          className="pr-11"
        />
        <CheckBadge />
      </div>
    );
  }

  if (qrType === "sms") {
    const sms = values.sms;

    return (
      <div className="space-y-3">
        <label className="block space-y-1.5">
          <FieldLabel>Phone number</FieldLabel>
          <Input
            type="tel"
            aria-label="SMS phone number"
            placeholder="+1 (555) 123-4567"
            value={sms.number}
            onChange={(event) => onChange("sms", { ...sms, number: event.target.value })}
          />
        </label>
        <label className="block space-y-1.5">
          <FieldLabel>Message</FieldLabel>
          <textarea
            aria-label="SMS message"
            placeholder="Message starter"
            value={sms.message}
            onChange={(event) => onChange("sms", { ...sms, message: event.target.value })}
            className={textAreaClassName}
          />
        </label>
      </div>
    );
  }

  const card = values.vcard;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1.5">
          <FieldLabel>First name</FieldLabel>
          <Input
            aria-label="First name"
            placeholder="Ada"
            value={card.firstName}
            onChange={(event) => onChange("vcard", { ...card, firstName: event.target.value })}
          />
        </label>
        <label className="block space-y-1.5">
          <FieldLabel>Last name</FieldLabel>
          <Input
            aria-label="Last name"
            placeholder="Lovelace"
            value={card.lastName}
            onChange={(event) => onChange("vcard", { ...card, lastName: event.target.value })}
          />
        </label>
      </div>
      <label className="block space-y-1.5">
        <FieldLabel>Organization</FieldLabel>
        <Input
          aria-label="Organization"
          placeholder="Qurooo"
          value={card.organization}
          onChange={(event) => onChange("vcard", { ...card, organization: event.target.value })}
        />
      </label>
      <label className="block space-y-1.5">
        <FieldLabel>Phone</FieldLabel>
        <Input
          type="tel"
          aria-label="Contact phone"
          placeholder="+1 (555) 123-4567"
          value={card.phone}
          onChange={(event) => onChange("vcard", { ...card, phone: event.target.value })}
        />
      </label>
      <label className="block space-y-1.5">
        <FieldLabel>Email</FieldLabel>
        <Input
          type="email"
          aria-label="Contact email"
          placeholder="ada@qurooo.com"
          value={card.email}
          onChange={(event) => onChange("vcard", { ...card, email: event.target.value })}
        />
      </label>
    </div>
  );
}

export function ContentPanel() {
  const content = useQrEditorStore((state) => state.content);
  const highlightedPresetId = useQrEditorStore((state) => state.ui.highlightedPresetId);
  const applyPreset = useQrEditorStore((state) => state.applyPreset);
  const updateContent = useQrEditorStore((state) => state.updateContent);
  const utmOpen = useQrEditorStore((state) => state.ui.utmOpen);
  const setUtmOpen = useQrEditorStore((state) => state.setUtmOpen);

  const typeMeta = getTypeMetaByValue(content.qrType);
  const isUrl = content.qrType === "url";
  const fieldLabel = isUrl ? "Enter your URL" : `Enter your ${typeMeta.label}`;
  const FieldIcon = fieldIcons[content.qrType];

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <FieldIcon size={15} className="text-[var(--text-secondary)]" />
          <h2 className="text-sm font-bold text-[var(--text-primary)]">{fieldLabel}</h2>
        </div>

        <ContentFields
          qrType={content.qrType}
          values={content.values}
          urlPlaceholder={typeMeta.placeholder}
          textPlaceholder={typeMeta.placeholder}
          onChange={updateContent}
        />

        {isUrl ? (
          <>
            <button
              type="button"
              aria-expanded={utmOpen}
              onClick={() => setUtmOpen(!utmOpen)}
              className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:text-[var(--text-secondary)]"
            >
              <Plus size={13} />
              Add UTM Parameters
              <Info size={12} className="text-[var(--text-muted)]" />
            </button>
            {utmOpen ? (
              <div className="mt-3 space-y-2">
                <Input
                  aria-label="UTM source"
                  placeholder="utm_source"
                  value={content.values.utm.source}
                  onChange={(event) =>
                    updateContent("utm", {
                      ...useQrEditorStore.getState().content.values.utm,
                      source: event.target.value,
                    })
                  }
                />
                <Input
                  aria-label="UTM medium"
                  placeholder="utm_medium"
                  value={content.values.utm.medium}
                  onChange={(event) =>
                    updateContent("utm", {
                      ...useQrEditorStore.getState().content.values.utm,
                      medium: event.target.value,
                    })
                  }
                />
                <Input
                  aria-label="UTM campaign"
                  placeholder="utm_campaign"
                  value={content.values.utm.campaign}
                  onChange={(event) =>
                    updateContent("utm", {
                      ...useQrEditorStore.getState().content.values.utm,
                      campaign: event.target.value,
                    })
                  }
                />
              </div>
            ) : null}
          </>
        ) : null}

        <button
          type="button"
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white shadow-[var(--shadow-button)] transition hover:-translate-y-0.5"
          style={{ background: "var(--accent-gradient)" }}
        >
          <Zap size={16} />
          Generate Magic
          <Sparkles size={15} />
        </button>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-bold text-[var(--text-primary)]">Quick Style Picks</h2>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">One tap. Stunning results.</p>

        <div className="mt-3 grid grid-cols-5 gap-2.5">
          {quickPresets.map((preset) => {
            const isActive = highlightedPresetId === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className="flex min-w-0 flex-col items-center gap-1.5"
              >
                <StylePresetThumbnail
                  primary={preset.style.primaryColor ?? "#16c2a3"}
                  secondary={preset.style.secondaryColor ?? "#7c5cfc"}
                  gradientEnabled={preset.style.gradientEnabled}
                  dotStyle={preset.style.dotStyle}
                  cornerStyle={preset.style.cornerStyle}
                  className={cn(
                    "h-10 w-10 shrink-0 transition sm:h-11 sm:w-11",
                    isActive && "ring-2 ring-[var(--accent-primary)] ring-offset-2",
                  )}
                />
                <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                  {preset.label}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card
        className="border-none p-5 shadow-[0_10px_28px_rgba(45,212,191,0.12)]"
        style={{
          background: "linear-gradient(105deg, #f4fffb 0%, #e8fbf5 42%, #dff7ff 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-[0_4px_10px_rgba(15,23,42,0.06)]">
                <Lightbulb size={14} className="fill-[#14b8a6] text-[#14b8a6]" strokeWidth={2} />
              </span>
              <h3 className="text-sm font-bold text-[#0f172a]">Pro Tip</h3>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#334155]">
              Try different styles, shapes and frames to make your QR stand out!
            </p>
          </div>

          <div className="relative -my-1 -mr-1 flex h-[88px] w-[88px] shrink-0 items-center justify-center">
            <ProTipMascot className="h-full w-full" />
          </div>
        </div>
      </Card>
    </div>
  );
}
