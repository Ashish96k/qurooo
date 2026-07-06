"use client";

import { motion } from "framer-motion";

import { AppShell } from "@/components/layout/app-shell";
import { ContentPanel } from "@/components/generator/content-panel";
import { CustomizePanel } from "@/components/generator/customize-panel";
import { ExportBar } from "@/components/generator/export-bar";
import { PageHeader } from "@/components/generator/page-header";
import { PreviewPanel } from "@/components/generator/preview-panel";
import { StickyNote } from "@/components/generator/sticky-note";
import { TotallyFreeBanner } from "@/components/generator/totally-free-banner";
import { fadeUpVariants, staggerChildrenVariants } from "@/lib/motion";

export function GeneratorWorkspace() {
  return (
    <AppShell header={<PageHeader />}>
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerChildrenVariants}
        className="grid gap-4 xl:grid-cols-[296px_minmax(0,1fr)_296px]"
      >
        <motion.div variants={fadeUpVariants}>
          <ContentPanel />
        </motion.div>

        <PreviewPanel />

        <motion.div variants={fadeUpVariants}>
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
