import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Videomatic",
  description: "Sync and craft your best moments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden no-scrollbar">
      <body className="text-white">
        {children}
      </body>
    </html>
  );
}
