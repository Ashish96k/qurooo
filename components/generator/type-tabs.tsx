"use client";

import {
  Contact,
  Link as LinkIcon,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Type,
  Wifi,
} from "lucide-react";

import { qrTypeOptions } from "@/features/qr/model/defaults";
import type { QrType } from "@/features/qr/model/types";
import { useQrEditorStore } from "@/features/qr/store/editor-store";
import { cn } from "@/lib/cn";

const typeIcons: Record<QrType, typeof LinkIcon> = {
  url: LinkIcon,
  text: Type,
  wifi: Wifi,
  email: Mail,
  phone: Phone,
  sms: MessageSquare,
  vcard: Contact,
};

export function TypeTabs() {
  const qrType = useQrEditorStore((state) => state.content.qrType);
  const setQrType = useQrEditorStore((state) => state.setQrType);

  return (
    <div className="flex items-center gap-1.5 rounded-2xl border border-[var(--border-subtle)] bg-white p-2 shadow-[var(--shadow-card)]">
      {qrTypeOptions.map((option) => {
        const Icon = typeIcons[option.value];
        const isActive = option.value === qrType;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setQrType(option.value)}
            className={cn(
              "flex min-w-14 flex-col items-center gap-1 rounded-xl border px-2.5 py-2 transition",
              isActive
                ? "border-[var(--accent-primary)]/30 bg-[var(--nav-active-bg)]"
                : "border-transparent hover:bg-[var(--bg-soft)]",
            )}
          >
            <Icon
              size={17}
              strokeWidth={2.1}
              className={isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"}
            />
            <span
              className={cn(
                "text-[11px] font-medium",
                isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]",
              )}
            >
              {option.shortLabel}
            </span>
          </button>
        );
      })}

      <div className="mx-1 h-8 w-px bg-[var(--border-subtle)]" />

      <button
        type="button"
        className="flex min-w-14 flex-col items-center gap-1 rounded-xl border border-transparent px-2.5 py-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-soft)]"
      >
        <MoreHorizontal size={17} strokeWidth={2.1} />
        <span className="text-[11px] font-medium">More</span>
      </button>
    </div>
  );
}
