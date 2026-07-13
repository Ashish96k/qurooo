"use client";

import { CircleHelp, Sparkles } from "lucide-react";

function GradientUnderline({ className = "" }: { className?: string }) {
  return (
    <div className={`qurooo-underline-wrap ${className}`}>
      <div className="qurooo-underline-shine" />
    </div>
  );
}

export function PageHeaderBrand() {
  return (
    <div className="space-y-2">
      <h1 className="text-[26px] font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-[30px]">
        Design. Generate.
        <br />
        <span className="relative inline-block pb-3">
          <span className="bg-clip-text text-transparent qurooo-header-shimmer-text">
            Make It Yours.
          </span>
          <GradientUnderline className="absolute -bottom-1.5 left-[-4%] w-[118%]" />
        </span>
      </h1>
      <p className="max-w-xs text-sm leading-6 text-[var(--text-secondary)]">
        Transform anything into a beautiful, custom QR code in seconds.
      </p>
    </div>
  );
}

export function PageHeaderActions() {
  return (
    <>
      <button
        type="button"
        aria-label="What's new"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white text-[var(--accent-secondary)] shadow-[var(--shadow-card)] transition hover:-translate-y-0.5"
      >
        <Sparkles size={16} />
      </button>
      <button
        type="button"
        aria-label="Help"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] shadow-[var(--shadow-card)] transition hover:-translate-y-0.5"
      >
        <CircleHelp size={16} />
      </button>
    </>
  );
}
