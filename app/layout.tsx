import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProvider } from "@/lib/context/AppContext";

export const metadata: Metadata = {
  title: "Nimii — Your AI companion, always by your side",
  description: "A premium personal AI assistant with web search, persistent conversational memory, and actionable Open Loops.",
  icons: {
    icon: "/images/mascot/nimii-avatar.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#6C5CE7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F7F5FC] text-[#1E1B4B] antialiased selection:bg-[#EDE9FE] selection:text-[#6C5CE7]">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
