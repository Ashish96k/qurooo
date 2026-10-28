"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/cn";

export const THEME_STORAGE_KEY = "qurooo:theme";

export type ThemeName = "light" | "dark";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readTheme(): ThemeName {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("light");

  useLayoutEffect(() => {
    setThemeState(readTheme());
  }, []);

  const setTheme = useCallback((next: ThemeName) => {
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    setThemeState(next);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [setTheme, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return value;
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { setTheme, theme } = useTheme();
  const buttonClass = compact ? "h-9 w-9 border border-[var(--border-subtle)]" : "h-8 w-8";

  return (
    <div
      className={cn(
        compact
          ? "flex w-full flex-col items-center justify-center gap-2"
          : "inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-soft)] p-0.5",
      )}
    >
      <button
        type="button"
        aria-label="Light theme"
        aria-pressed={theme === "light"}
        onClick={() => setTheme("light")}
        className={cn(
          "flex items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]",
          buttonClass,
          theme === "light" && "bg-[var(--bg-surface)] shadow-sm",
        )}
      >
        <Sun size={compact ? 15 : 14} />
      </button>
      <button
        type="button"
        aria-label="Dark theme"
        aria-pressed={theme === "dark"}
        onClick={() => setTheme("dark")}
        className={cn(
          "flex items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]",
          buttonClass,
          theme === "dark" && "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm",
        )}
      >
        <Moon size={compact ? 15 : 14} />
      </button>
    </div>
  );
}
