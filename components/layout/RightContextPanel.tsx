"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/context/AppContext";

export function RightContextPanel() {
  const { memories, loops, toggleLoop } = useApp();

  const recentMemories = memories.slice(0, 3);
  const pendingLoops = loops.filter((l) => !l.completed).slice(0, 3);
  const isAllCaughtUp = pendingLoops.length === 0;

  return (
    <aside className="w-80 flex-shrink-0 hidden xl:flex flex-col gap-3.5 px-3 md:px-4 pt-2 md:pt-2.5 pb-6 overflow-y-auto max-h-screen">
      {/* 1. Your Memory Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-glass">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#6C5CE7]" />
            <h3 className="font-bold text-[#1E1B4B] text-sm">Your Memory</h3>
          </div>
          <Link
            href="/app/memory"
            className="text-xs font-semibold text-[#6C5CE7] hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Timeline items */}
        <div className="relative pl-4 space-y-4 before:content-[''] before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#DDD6FE]">
          {recentMemories.map((mem) => (
            <div key={mem.id} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#6C5CE7] ring-4 ring-white" />
              <div className="flex flex-col">
                <span className="text-[11px] text-[#7C7F96] font-medium">
                  {mem.date.split("•")[0].trim()} • {mem.time}
                </span>
                <Link
                  href={`/app/memory?selected=${mem.id}`}
                  className="text-xs font-semibold text-[#1E1B4B] group-hover:text-[#6C5CE7] transition-colors leading-snug mt-0.5"
                >
                  {mem.title}
                </Link>
                <div className="mt-1">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EDE9FE] text-[#6C5CE7]">
                    {mem.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Your Open Loops Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-glass">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            <h3 className="font-bold text-[#1E1B4B] text-sm">Your Open Loops</h3>
          </div>
          <Link
            href="/app/loops"
            className="text-xs font-semibold text-[#E17055] hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {loops.slice(0, 3).map((loop) => (
            <div
              key={loop.id}
              onClick={() => toggleLoop(loop.id)}
              className="flex items-start justify-between gap-2.5 cursor-pointer group"
            >
              <div className="flex items-start gap-2.5 flex-1">
                <div
                  className={`mt-0.5 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center flex-shrink-0 ${
                    loop.completed
                      ? "bg-[#10B981] border-[#10B981]"
                      : "border-[#C4B5FD] group-hover:border-[#6C5CE7]"
                  }`}
                >
                  {loop.completed && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>
                <span
                  className={`text-xs leading-snug transition-all ${
                    loop.completed
                      ? "line-through text-[#94A3B8]"
                      : "font-medium text-[#1E1B4B] group-hover:text-[#6C5CE7]"
                  }`}
                >
                  {loop.title}
                </span>
              </div>
              <span
                className={`text-[10px] font-semibold flex-shrink-0 ${
                  loop.dueDate.toLowerCase().includes("today")
                    ? "text-[#E17055]"
                    : loop.dueDate.toLowerCase().includes("tomorrow")
                    ? "text-[#6C5CE7]"
                    : "text-[#7C7F96]"
                }`}
              >
                {loop.dueDate}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Cheerful Caught-Up Celebration Card */}
      <div className="bg-gradient-to-br from-white/90 to-[#FAF7FF]/90 backdrop-blur-md rounded-3xl p-4 border border-white/90 text-center shadow-glass relative overflow-hidden group">
        <div className="relative w-28 h-18 mx-auto mb-1 animate-soft-bounce">
          <Image
            src="/images/mascot/nimii-3d-celebrating.png?v=3d"
            alt="Nimii 3D celebrating mascot"
            fill
            className="object-contain drop-shadow-sm"
          />
        </div>
        <h4 className="font-bold text-[#1E1B4B] text-xs">
          {isAllCaughtUp ? "You're all caught up!" : "Nimii's cheering for you!"}
        </h4>
        <p className="text-[11px] text-[#7C7F96] mt-0.5">
          {isAllCaughtUp
            ? "No pending tasks for now 🎉"
            : "Small steps lead to great achievements ✨"}
        </p>
      </div>
    </aside>
  );
}
