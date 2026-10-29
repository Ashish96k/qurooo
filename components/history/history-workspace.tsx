"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock3, History, Trash2 } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQrHistoryStore } from "@/features/qr/history/store";
import type { HistoryItem } from "@/features/qr/history/types";
import { getTypeMetaByValue } from "@/features/qr/selectors/editor-selectors";
import { useQrEditorStore } from "@/features/qr/store/editor-store";
import { fadeUpVariants, staggerChildrenVariants } from "@/lib/motion";

function formatRelativeTime(timestamp: number) {
  const delta = Date.now() - timestamp;
  const minutes = Math.floor(delta / 60_000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

function HistoryCard({
  item,
  onOpen,
  onDelete,
}: {
  item: HistoryItem;
  onOpen: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}) {
  const typeLabel = getTypeMetaByValue(item.qrType).label;

  return (
    <Card className="flex flex-col overflow-hidden p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-start gap-4">
        <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-soft)]">
          {item.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.thumbnail}
              alt=""
              width={88}
              height={88}
              className="h-full w-full object-cover"
            />
          ) : (
            <History size={28} className="text-[var(--text-muted)]" aria-hidden />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {typeLabel}
          </p>
          <h2 className="mt-1 truncate text-base font-semibold text-[var(--text-primary)]">
            {item.title}
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <Clock3 size={12} aria-hidden />
            {formatRelativeTime(item.createdAt)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button
          size="sm"
          className="flex-1 text-white shadow-[var(--shadow-button)]"
          style={{ background: "var(--accent-gradient)" }}
          onClick={() => onOpen(item)}
        >
          Open
        </Button>
        <Button
          size="sm"
          variant="secondary"
          aria-label={`Delete ${item.title}`}
          className="px-3 text-[var(--text-secondary)] hover:border-[rgba(239,68,68,0.28)] hover:text-[var(--danger)]"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 size={15} />
        </Button>
      </div>
    </Card>
  );
}

export function HistoryWorkspace() {
  const router = useRouter();
  const hydrate = useQrHistoryStore((state) => state.hydrate);
  const hydrated = useQrHistoryStore((state) => state.hydrated);
  const items = useQrHistoryStore((state) => state.items);
  const remove = useQrHistoryStore((state) => state.remove);
  const clear = useQrHistoryStore((state) => state.clear);
  const [confirmClear, setConfirmClear] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleOpen = (item: HistoryItem) => {
    try {
      useQrEditorStore.getState().loadFromHistory(item.snapshot);
      router.push("/");
    } catch {
      setNotice("Couldn't restore that QR code.");
    }
  };

  return (
    <AppShell>
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerChildrenVariants}
        className="flex flex-col gap-5"
      >
        <motion.div
          variants={fadeUpVariants}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="space-y-2">
            <h1 className="text-[26px] font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-[30px]">
              History
            </h1>
            <p className="max-w-lg text-sm leading-6 text-[var(--text-secondary)]">
              QR codes you download or share are saved on this device. They are not
              synced to an account.
            </p>
          </div>

          {hydrated && items.length > 0 ? (
            confirmClear ? (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setConfirmClear(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="border-[rgba(239,68,68,0.24)] text-[var(--danger)]"
                  onClick={() => {
                    clear();
                    setConfirmClear(false);
                  }}
                >
                  Clear all
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => setConfirmClear(true)}>
                Clear all
              </Button>
            )
          ) : null}
        </motion.div>

        {notice ? (
          <motion.p
            variants={fadeUpVariants}
            className="text-sm font-medium text-[var(--danger)]"
            role="status"
          >
            {notice}
          </motion.p>
        ) : null}

        {!hydrated ? (
          <motion.div variants={fadeUpVariants}>
            <Card className="px-6 py-10 text-sm text-[var(--text-secondary)]">
              Loading saved QR codes…
            </Card>
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div variants={fadeUpVariants}>
            <Card className="flex flex-col items-start gap-4 px-6 py-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-soft)] text-[var(--accent-secondary)]">
                <History size={22} aria-hidden />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Nothing saved yet
                </h2>
                <p className="max-w-md text-sm leading-6 text-[var(--text-secondary)]">
                  Download or share a QR code and it will show up here so you can open
                  it again later.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium text-white shadow-[var(--shadow-button)]"
                style={{ background: "var(--accent-gradient)" }}
              >
                Create a QR code
              </Link>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            variants={fadeUpVariants}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {items.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                onOpen={handleOpen}
                onDelete={remove}
              />
            ))}
          </motion.div>
        )}
      </motion.section>
    </AppShell>
  );
}
