import { Pin } from "lucide-react";

export function StickyNote() {
  return (
    <div
      className="hidden w-[168px] shrink-0 rotate-[-3deg] rounded-xl p-3.5 shadow-[0_14px_28px_rgba(180,130,0,0.18)] xl:block"
      style={{ backgroundColor: "var(--sticky-bg)", border: "1px solid var(--sticky-border)" }}
    >
      <Pin size={14} className="mb-1.5 text-[#a16207]" />
      <p className="text-xs font-bold leading-snug text-[#4a3403]">
        Make it simple, but significant.
      </p>
      <p className="mt-1 text-[11px] italic text-[#7a5b0d]">- Your QR, Your Way</p>
    </div>
  );
}
