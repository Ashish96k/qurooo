import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function SidebarPanel({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("xl:sticky xl:top-6", className)} {...props} />;
}
