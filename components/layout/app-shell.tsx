import type { ReactNode } from "react";

import { QuroooLogo } from "./qurooo-logo";

interface AppShellProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function AppShell({ children, footer, header, sidebar }: AppShellProps) {
  return (
    <div className="relative flex min-h-screen">
      {sidebar}

      <div className="relative flex min-h-screen flex-1 flex-col">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(22,194,163,0.14),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(124,92,252,0.12),_transparent_36%)]" />

        <div className="relative mx-auto flex w-full max-w-[1320px] flex-1 flex-col gap-5 px-4 py-5 sm:px-6 lg:py-7">
          <div className="flex items-center lg:hidden">
            <QuroooLogo height={28} priority />
          </div>

          {header}
          <main className="flex flex-1 flex-col gap-5">{children}</main>
          {footer}
        </div>
      </div>
    </div>
  );
}
