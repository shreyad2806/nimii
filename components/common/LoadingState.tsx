"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, RefreshCcw } from "lucide-react";

export function LoadingState({ message = "Nimii is thinking..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative w-20 h-20 mb-3 animate-soft-bounce">
        <Image
          src="/images/mascot/nimii-avatar.png"
          alt="Nimii loading"
          fill
          className="object-contain"
        />
      </div>
      <div className="flex items-center gap-2 text-sm font-bold text-[#6C5CE7]">
        <Sparkles className="w-4 h-4 animate-spin" />
        <span>{message}</span>
      </div>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message = "Nimii couldn't load this information right now.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white/70 backdrop-blur-md rounded-3xl border border-rose-100 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-3 font-black text-xl">
        !
      </div>
      <h4 className="text-base font-bold text-[#1E1B4B]">{title}</h4>
      <p className="text-xs text-[#7C7F96] mt-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#6C5CE7] text-white text-xs font-semibold hover:bg-[#5B46D9] transition-all"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
