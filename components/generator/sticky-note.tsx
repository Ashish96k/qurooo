import { Crown } from "lucide-react";

export function StickyNote() {
  return (
    <div className="relative hidden shrink-0 xl:block" aria-hidden>
      {/* Teal curly arrow pointing into the note */}
      <svg
        className="pointer-events-none absolute -left-9 top-10 h-14 w-12 overflow-visible"
        viewBox="0 0 48 56"
        fill="none"
        aria-hidden
      >
        <path
          d="M8,48 C4,40 6,28 14,22 C22,16 28,24 24,30 C20,36 28,34 36,22 C40,16 42,10 40,4"
          stroke="#14b8a6"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M34,2 L40,4 L38,10"
          stroke="#14b8a6"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      <div
        className="relative w-[168px] rotate-[-4deg] rounded-[14px] p-4 pt-5 shadow-[0_14px_28px_rgba(180,130,0,0.18)]"
        style={{ backgroundColor: "var(--sticky-bg)", border: "1px solid var(--sticky-border)" }}
      >
        {/* Purple crown badge peeking over the top-right corner */}
        <span
          className="absolute -top-2.5 -right-2.5 flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-[0_8px_16px_rgba(108,60,224,0.35)]"
          style={{ background: "var(--pro-gradient)" }}
        >
          <Crown size={14} strokeWidth={2.2} />
        </span>

        <p
          className="text-[28px] leading-none text-[#4a3403]"
          style={{ fontFamily: "var(--font-hand), cursive" }}
        >
          {"\u201C"}
        </p>
        <p className="-mt-2 text-[13px] font-bold leading-snug text-[#4a3403]">
          Make it simple,
          <br />
          but significant.
        </p>
        <p className="mt-2 text-right text-[11px] text-[#7a5b0d]">
          {"\u2014"} Your QR, Your Way
        </p>
      </div>
    </div>
  );
}
