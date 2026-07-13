"use client";

import { motion } from "framer-motion";

import { AppShell } from "@/components/layout/app-shell";
import { ContentPanel } from "@/components/generator/content-panel";
import { CustomizePanel } from "@/components/generator/customize-panel";
import { ExportBar } from "@/components/generator/export-bar";
import { PageHeaderActions, PageHeaderBrand } from "@/components/generator/page-header";
import { PreviewPanel } from "@/components/generator/preview-panel";
import { StickyNote } from "@/components/generator/sticky-note";
import { TotallyFreeBanner } from "@/components/generator/totally-free-banner";
import { TypeTabs } from "@/components/generator/type-tabs";
import { fadeUpVariants, staggerChildrenVariants } from "@/lib/motion";

export function GeneratorWorkspace() {
  return (
    <AppShell>
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerChildrenVariants}
        className="grid gap-x-4 gap-y-5 xl:grid-cols-[296px_minmax(0,1fr)_296px]"
      >
        {/* Left: brand + content — stacks naturally under the title */}
        <motion.div variants={fadeUpVariants} className="flex flex-col gap-3">
          <PageHeaderBrand />
          <ContentPanel />
        </motion.div>

        {/* Center: TypeTabs stay at the top; Preview sits close underneath */}
        <motion.div variants={fadeUpVariants} className="flex min-h-0 flex-col gap-3">
          <div className="flex justify-start self-start xl:justify-center">
            <TypeTabs />
          </div>
          <PreviewPanel />
        </motion.div>

        {/* Right: actions share the TypeTabs row height; Customize aligns with Preview */}
        <motion.div variants={fadeUpVariants} className="flex min-h-0 flex-col gap-3">
          <div className="flex min-h-[74px] items-start justify-start gap-2 xl:justify-end">
            <PageHeaderActions />
          </div>
          <CustomizePanel />
        </motion.div>
      </motion.section>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="grid gap-4 xl:grid-cols-[296px_minmax(0,1fr)_296px]"
      >
        <TotallyFreeBanner />

        <div className="flex items-stretch gap-4 xl:col-span-2">
          <ExportBar />
          <StickyNote />
        </div>
      </motion.section>
    </AppShell>
  );
}
