"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  ArrowLeft,
  Menu,
} from "lucide-react";
import { useApp } from "@/lib/context/AppContext";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  showBack = false,
  backHref,
  children,
}: PageHeaderProps) {
  const router = useRouter();
  const { user, settings, updateSettings, setIsMobileSidebarOpen } = useApp();
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const toggleTheme = () => {
    const nextTheme = settings.theme === "dreamy" ? "dark" : settings.theme === "dark" ? "light" : "dreamy";
    updateSettings({ theme: nextTheme });
  };

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <header className="flex items-center justify-between gap-3 py-1 px-0 z-20 w-full">
      {/* Left side: Back button or Mobile Menu + Title */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden p-2 rounded-xl bg-white/80 border border-white/60 shadow-sm text-[#1E1B4B]"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {showBack && (
          <button
            onClick={handleBack}
            className="p-2 rounded-2xl bg-white/80 hover:bg-white border border-white/80 shadow-sm text-[#1E1B4B] transition-all hover:scale-105 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[#1E1B4B]" />
          </button>
        )}

        {title && (
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#1E1B4B] tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs md:text-sm text-[#64748B] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2.5">
        {/* Online Status Pill */}
        <div className="relative">
          <button
            onClick={() => setStatusMenuOpen(!statusMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-white/80 shadow-glass-sm text-xs font-semibold text-[#1E1B4B] transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>{user.status}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7C7F96]" />
          </button>

          {statusMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-32 bg-white/95 backdrop-blur-xl rounded-2xl p-1.5 shadow-xl border border-[#EDE9FE] z-50 flex flex-col gap-1">
              {(["Online", "Away", "Offline"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    // Update user status
                    setStatusMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-[#1E1B4B] hover:bg-[#F3F0FF] text-left"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      st === "Online"
                        ? "bg-[#10B981]"
                        : st === "Away"
                        ? "bg-[#F59E0B]"
                        : "bg-[#94A3B8]"
                    }`}
                  />
                  <span>{st}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch theme (current: ${settings.theme})`}
          className="p-2 rounded-full bg-white/80 hover:bg-white border border-white/80 shadow-glass-sm text-[#1E1B4B] transition-all hover:scale-105 active:scale-95"
          aria-label="Toggle theme"
        >
          {settings.theme === "dark" ? (
            <Moon className="w-4 h-4 text-[#8B5CF6]" />
          ) : settings.theme === "light" ? (
            <Sun className="w-4 h-4 text-[#F59E0B]" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
          )}
        </button>
      </div>
    </header>
  );
}
