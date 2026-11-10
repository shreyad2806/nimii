"use client";

import React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  mascotPose?: "sleepy" | "celebrating" | "checklist" | "sleeping";
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  mascotPose = "sleepy",
}: EmptyStateProps) {
  const poseSrc = {
    sleepy: "/images/mascot/nimii-3d-rest.png",
    celebrating: "/images/mascot/nimii-3d-celebrating.png",
    checklist: "/images/mascot/nimii-3d-checklist.png",
    sleeping: "/images/mascot/nimii-3d-sleeping.png",
  }[mascotPose];

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white/70 backdrop-blur-md rounded-3xl border border-white/80 shadow-glass-sm max-w-lg mx-auto">
      <div className="relative w-28 h-20 mb-3 animate-soft-bounce">
        <Image
          src={poseSrc}
          alt="Nimii mascot"
          fill
          className="object-contain"
        />
      </div>

      <h3 className="text-base md:text-lg font-bold text-[#1E1B4B]">
        {title}
      </h3>
      <p className="text-xs md:text-sm text-[#7C7F96] mt-1 max-w-sm leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5B46D9] text-white font-bold text-xs shadow-md shadow-[#6C5CE7]/20 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
