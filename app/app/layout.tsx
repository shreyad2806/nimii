"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { FloatingNimiiCompanion } from "@/components/mascot/FloatingNimiiCompanion";
import { useApp } from "@/lib/context/AppContext";
import { X } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useApp();

  return (
    <div className="relative min-h-screen w-full flex bg-[#F7F5FC] scenic-background text-[#1E1B4B] overflow-x-hidden">
      {/* Background Scenic Landscape Overlay */}
      <div className="fixed inset-0 pointer-events-none scenic-background-overlay opacity-70 z-0" />

      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex z-20">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl bg-white/95">
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#7C7F96] hover:bg-[#F3F0FF]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 min-h-screen pb-16 md:pb-0 overflow-y-auto">
        {children}
      </div>

      {/* Floating 3D Interactive Nimii Companion */}
      <FloatingNimiiCompanion />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNavigation />
    </div>
  );
}
