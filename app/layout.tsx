import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pure & Honest | R&D Workspace",
  description: "Private research, product development and innovation workspace for Pure & Honest."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}