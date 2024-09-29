import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Zwemtraining Generator - Met liefde gemaakt door Bram",
  description: "Genereer gepersonaliseerde zwemtrainingen met behulp van AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <Script
          strategy="afterInteractive"
          defer
          data-domain="zwemschema-generator.vercel.app"
          src="https://plausible.io/js/script.file-downloads.outbound-links.pageview-props.tagged-events.js"
        />
        <Script id="plausible-setup" strategy="afterInteractive">
          {`
            window.plausible = window.plausible || function() { 
              (window.plausible.q = window.plausible.q || []).push(arguments) 
            }
          `}
        </Script>
      </body>
    </html>
  );
}
