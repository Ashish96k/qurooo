import { Crown } from "lucide-react";

export function StickyNote() {
  return (
    <div className="relative hidden shrink-0 overflow-visible pt-4 pr-5 pl-16 xl:block" aria-hidden>
      <div
        className="relative z-0 w-[168px] rotate-[-4deg] rounded-[14px] p-4 pt-5 shadow-[0_14px_28px_rgba(180,130,0,0.18)]"
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

      {/* Loose curl in the left gutter, tip at the middle of the note. */}
      <svg
        className="pointer-events-none absolute bottom-8 -left-5 z-10 h-11 w-[6.25rem] overflow-visible"
        viewBox="-24 0 100 44"
        fill="none"
        aria-hidden
      >
        <path
          d="M-18 36 C-8 40 -2 38 4 34 C16 40 24 26 32 24 C38 22 44 28 40 34 C36 40 24 36 30 26 C38 14 52 16 66 12"
          stroke="#14b8a6"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M56 4 L68 10 L58 18"
          stroke="#14b8a6"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
