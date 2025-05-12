import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Property Management System",
  description: "A system for managing properties, property types, and owners",
};

// Using experimental feature - passing locale through props in RSC
export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: Promise<{ locale?: string }>;
}) {
  return (
    <html
      lang={params ? "en" : "en"}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
