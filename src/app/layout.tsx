import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReWire — Neuroplasticity-Powered Rehabilitation",
  description:
    "Track neurological recovery, adapt rehab exercises using neuroplasticity principles, and own your neural data on decentralized storage.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased geo-bg" style={{ background: '#0a0a0a', color: '#f5f0e8', fontFamily: "'Outfit', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
