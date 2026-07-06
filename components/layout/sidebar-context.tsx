"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const STORAGE_KEY = "qurooo:sidebar-expanded";
const LG_MEDIA_QUERY = "(min-width: 1024px)";
// Collapsed sidebar on SSR/hydration — no viewport or localStorage on the server.
const SSR_SIDEBAR_EXPANDED = false;

export type SidebarShellPhase = "idle" | "collapsing" | "expanding" | "expand-prep";

function readStoredPreference(): boolean | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "true") {
    return true;
  }
  if (stored === "false") {
    return false;
  }

  return null;
}

function writeStoredPreference(next: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, String(next));
}

function getClientSidebarExpanded() {
  const stored = readStoredPreference();
  if (stored !== null) {
    return stored;
  }

  return window.matchMedia(LG_MEDIA_QUERY).matches;
}

function getServerSidebarExpanded() {
  return SSR_SIDEBAR_EXPANDED;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const media = window.matchMedia(LG_MEDIA_QUERY);
  const handleChange = () => onStoreChange();

  media.addEventListener("change", handleChange);
  window.addEventListener("storage", handleChange);

  return () => {
    media.removeEventListener("change", handleChange);
    window.removeEventListener("storage", handleChange);
  };
}

interface SidebarContextValue {
  isExpanded: boolean;
  shellPhase: SidebarShellPhase;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
  completeShellAnimation: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const responsiveExpanded = useSyncExternalStore(
    subscribe,
    getClientSidebarExpanded,
    getServerSidebarExpanded,
  );
  const [manualExpanded, setManualExpanded] = useState<boolean | null>(null);
  const [shellPhase, setShellPhase] = useState<SidebarShellPhase>("idle");

  const isExpanded = manualExpanded ?? responsiveExpanded;

  const persist = useCallback((next: boolean) => {
    writeStoredPreference(next);
    setManualExpanded(next);
  }, []);

  const startAnimation = useCallback(
    (next: boolean) => {
      if (next === isExpanded || shellPhase !== "idle") {
        return;
      }

      persist(next);

      if (next) {
        setShellPhase("expand-prep");
        return;
      }

      setShellPhase("collapsing");
    },
    [isExpanded, persist, shellPhase],
  );

  const toggle = useCallback(() => {
    startAnimation(!isExpanded);
  }, [isExpanded, startAnimation]);

  const expand = useCallback(() => startAnimation(true), [startAnimation]);
  const collapse = useCallback(() => startAnimation(false), [startAnimation]);

  const completeShellAnimation = useCallback(() => {
    setShellPhase((current) =>
      current === "collapsing" || current === "expanding" ? "idle" : current,
    );
  }, []);

  useLayoutEffect(() => {
    if (shellPhase !== "expand-prep") {
      return;
    }

    let cancelled = false;
    let outerFrame = 0;
    let innerFrame = 0;

    outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        if (!cancelled) {
          setShellPhase("expanding");
        }
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(outerFrame);
      cancelAnimationFrame(innerFrame);
    };
  }, [shellPhase]);

  const value = useMemo(
    () => ({
      isExpanded,
      shellPhase,
      toggle,
      expand,
      collapse,
      completeShellAnimation,
    }),
    [collapse, completeShellAnimation, expand, isExpanded, shellPhase, toggle],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}
