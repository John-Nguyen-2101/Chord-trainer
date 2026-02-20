import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chord Trainer",
  description: "MVP chord trainer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}