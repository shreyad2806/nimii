"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Home,
  Brain,
  CheckCircle2,
  Clock,
  Settings,
  Plus,
  ChevronDown,
  LogOut,
  User,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/context/AppContext";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loops, logout, loginAsGuest } = useApp();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Count active pending loops
  const pendingLoopsCount = loops.filter((l) => !l.completed).length;

  const navItems = [
    { label: "Home", href: "/app", icon: Home },
    { label: "Memory", href: "/app/memory", icon: Brain },
    {
      label: "Open Loops",
      href: "/app/loops",
      icon: CheckCircle2,
      badge: pendingLoopsCount > 0 ? pendingLoopsCount : undefined,
    },
    { label: "History", href: "/app/history", icon: Clock },
    { label: "Settings", href: "/app/settings", icon: Settings },
  ];

  const handleNewChat = () => {
    router.push("/app");
  };

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between p-4 bg-white/70 backdrop-blur-xl border-r border-white/60 min-h-screen">
      {/* Top Section */}
      <div className="flex flex-col gap-4">
        {/* Brand Header */}
        <Link href="/app" className="flex items-center gap-2.5 px-2 py-1.5 group">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/images/mascot/nimii-avatar.png"
              alt="Nimii"
              fill
              className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-[#1E1B4B]">Nimii</span>
            <span className="text-[10px] font-semibold text-[#8B5CF6]">®</span>
          </div>
        </Link>

        {/* New Chat Action Button */}
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 bg-[#6C5CE7] hover:bg-[#5B46D9] active:bg-[#4E38C4] text-white py-3 px-4 rounded-2xl font-medium shadow-md shadow-[#6C5CE7]/20 transition-all transform active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>New Chat</span>
        </button>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === "/app" && pathname.startsWith("/app/chat"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-colors font-medium text-sm ${
                  isActive
                    ? "bg-[#EDE9FE] text-[#6C5CE7] shadow-sm shadow-[#6C5CE7]/5 font-semibold"
                    : "text-[#4B4E6D] hover:bg-[#F3F0FF] hover:text-[#1E1B4B]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? "text-[#6C5CE7]" : "text-[#7C7F96]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-[#6C5CE7] text-white"
                        : "bg-[#6C5CE7] text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-3">
        {/* Take a break sleeping kitten card */}
        <div className="bg-gradient-to-br from-white/90 to-[#F5F2FC]/80 backdrop-blur-md rounded-2xl p-3 border border-[#E9E4F5] text-center shadow-sm relative overflow-hidden">
          <div className="relative w-20 h-14 mx-auto mb-1">
            <Image
              src="/images/mascot/kitten-sleepy.png"
              alt="Sleeping kitten"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-xs font-semibold text-[#1E1B4B]">Take a break!</p>
          <p className="text-[11px] text-[#7C7F96] mt-0.5 leading-tight">
            Nimii will keep remembering for you ♡
          </p>
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#F3F0FF] transition-colors"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#4A72FF] text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                {user.avatarInitial}
              </div>
              <span className="text-sm font-semibold text-[#1E1B4B] truncate">
                {user.name}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#7C7F96] flex-shrink-0" />
          </button>

          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-[#EDE9FE] z-50 flex flex-col gap-1">
              <Link
                href="/app/profile"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#1E1B4B] hover:bg-[#F3F0FF]"
              >
                <User className="w-4 h-4 text-[#6C5CE7]" />
                <span>View Profile</span>
              </Link>
              <Link
                href="/app/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#1E1B4B] hover:bg-[#F3F0FF]"
              >
                <Settings className="w-4 h-4 text-[#6C5CE7]" />
                <span>Account Settings</span>
              </Link>
              {user.isGuest ? (
                <Link
                  href="/login"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#6C5CE7] hover:bg-[#EDE9FE]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sign In with Account</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    loginAsGuest();
                    setUserMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#7C7F96] hover:bg-[#F3F0FF] text-left"
                >
                  <User className="w-4 h-4" />
                  <span>Switch to Guest Demo</span>
                </button>
              )}
              <div className="h-px bg-[#F1EFF8] my-1" />
              <button
                onClick={() => {
                  logout();
                  setUserMenuOpen(false);
                  router.push("/login");
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-50 text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
