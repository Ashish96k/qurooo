import type { Metadata } from "next";

import { HistoryWorkspace } from "@/components/history/history-workspace";

export const metadata: Metadata = {
  title: "History",
  description:
    "Reopen QR codes you downloaded or shared. History is stored on this device only.",
};

export default function HistoryPage() {
  return <HistoryWorkspace />;
}
