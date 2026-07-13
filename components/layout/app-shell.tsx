"use client";

import { useCallback, useEffect, useRef, type ReactNode, type TransitionEvent } from "react";

import { SidebarNav } from "./sidebar-nav";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { SidebarToggleButton } from "./sidebar-toggle-button";

interface AppShellProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

function AppShellContent({ children, footer, header }: AppShellProps) {
  const { completeShellAnimation, isExpanded, shellPhase } = useSidebar();
  const completedRef = useRef(false);

  useEffect(() => {
    if (shellPhase === "collapsing" || shellPhase === "expanding") {
      completedRef.current = false;
    }
  }, [shellPhase]);

  useEffect(() => {
    if (shellPhase !== "collapsing" && shellPhase !== "expanding") {
      return;
    }

    const timeout = window.setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        completeShellAnimation();
      }
    }, 430);

    return () => window.clearTimeout(timeout);
  }, [completeShellAnimation, shellPhase]);

  const handleShellTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.currentTarget !== event.target) {
        return;
      }

      if (shellPhase !== "collapsing" && shellPhase !== "expanding") {
        return;
      }

      if (event.propertyName !== "--sidebar-offset") {
        return;
      }

      if (!completedRef.current) {
        completedRef.current = true;
        completeShellAnimation();
      }
    },
    [completeShellAnimation, shellPhase],
  );

  return (
    <div
      className="qurooo-app-shell relative flex min-h-screen"
      data-sidebar-expanded={isExpanded}
      data-shell-phase={shellPhase}
      onTransitionEnd={handleShellTransitionEnd}
    >
      <div className="qurooo-sidebar-slot-wrapper">
        <div className="qurooo-sidebar-slot">
          <div className="qurooo-sidebar-clip">
            <SidebarNav />
          </div>
        </div>
        <SidebarToggleButton />
      </div>

      <div className="qurooo-main-column relative flex min-h-screen flex-col">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(22,194,163,0.14),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(124,92,252,0.12),_transparent_36%)]" />

        <div className="relative mx-auto flex w-full max-w-[1320px] flex-1 flex-col gap-5 px-4 py-5 sm:px-6 lg:py-7">
          {header ? header : null}
          <main className="flex flex-1 flex-col gap-5">{children}</main>
          {footer}
        </div>
      </div>
    </div>
  );
}

export function AppShell(props: AppShellProps) {
  return (
    <SidebarProvider>
      <AppShellContent {...props} />
    </SidebarProvider>
  );
}
