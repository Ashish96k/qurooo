import type { Metadata } from "next";
import { Caveat, Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Qurooo",
    template: "%s | Qurooo",
  },
  description:
    "Design. Generate. Make It Yours. A fast, design-first QR code generator that runs entirely in your browser.",
  applicationName: "Qurooo",
  keywords: [
    "QR code generator",
    "design-first QR",
    "custom QR code",
    "browser QR generator",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--bg-page)] font-sans text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
