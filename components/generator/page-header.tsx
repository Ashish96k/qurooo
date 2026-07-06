"use client";

import { CircleHelp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { fadeUpVariants } from "@/lib/motion";

import { TypeTabs } from "./type-tabs";

function GradientUnderline({ className = "" }: { className?: string }) {
  return (
    <div className={`qurooo-underline-wrap ${className}`}>
      <div className="qurooo-underline-shine" />
    </div>
  );
}

export function PageHeader() {
  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"
    >
      <div className="space-y-2">
          <h1 className="text-[26px] font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-[30px]">
          Design. Generate.
          <br />
          <span className="relative inline-block pb-3">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--accent-gradient)" }}
            >
              Make It Yours.
            </span>

            <GradientUnderline className="absolute -bottom-1.5 left-[-4%] w-[118%]" />
          </span>
        </h1>
        <p className="max-w-xs text-sm leading-6 text-[var(--text-secondary)]">
          Transform anything into a beautiful, custom QR code in seconds.
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 lg:items-center">
        <TypeTabs />
      </div>

      <div className="flex items-center gap-2 self-start">
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
      </div>
    </motion.header>
  );
}
