import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MLB Home Run Celebration Ranker",
  description: "Browse, add, and vote on MLB home run celebration GIFs.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

