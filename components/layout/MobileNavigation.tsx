"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Brain, CheckCircle2, Clock, Settings } from "lucide-react";
import { useApp } from "@/lib/context/AppContext";

export function MobileNavigation() {
  const pathname = usePathname();
  const { loops } = useApp();
  const pendingLoopsCount = loops.filter((l) => !l.completed).length;

  const navItems = [
    { label: "Home", href: "/app", icon: Home },
    { label: "Memory", href: "/app/memory", icon: Brain },
    {
      label: "Loops",
      href: "/app/loops",
      icon: CheckCircle2,
      badge: pendingLoopsCount > 0 ? pendingLoopsCount : undefined,
    },
    { label: "History", href: "/app/history", icon: Clock },
    { label: "Settings", href: "/app/settings", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-[#EDE9FE] px-3 py-2 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href === "/app" && pathname.startsWith("/app/chat"));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center relative py-1 px-3 rounded-xl transition-all ${
              isActive
                ? "text-[#6C5CE7] font-bold"
                : "text-[#7C7F96] hover:text-[#1E1B4B]"
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-2 bg-[#6C5CE7] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
