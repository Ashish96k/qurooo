import Image from "next/image";

import { cn } from "@/lib/cn";

interface QuroooMarkProps {
  className?: string;
  size?: number;
  alt?: string;
}

interface QuroooLogoProps {
  className?: string;
  height?: number;
  alt?: string;
  priority?: boolean;
}

const LOGO_SHORT_WIDTH = 804;
const LOGO_SHORT_HEIGHT = 272;

export function QuroooMark({
  alt = "Qurooo mark",
  className,
  size = 32,
}: QuroooMarkProps) {
  return (
    <Image
      src="/qurooo-logos/icon-mark-gradient-1024.png"
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    />
  );
}

export function QuroooLogo({
  alt = "Qurooo",
  className,
  height = 30,
  priority = false,
}: QuroooLogoProps) {
  const width = Math.round((LOGO_SHORT_WIDTH / LOGO_SHORT_HEIGHT) * height);

  return (
    <Image
      src="/qurooo-logos/logo-short-horizontal.png"
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto", className)}
    />
  );
}
