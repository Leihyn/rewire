import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhysioPrep - Physiotherapy Study & Quiz",
  description: "Interactive physiotherapy study tool with MCQs and notes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
