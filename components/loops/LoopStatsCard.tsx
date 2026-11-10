"use client";

import React from "react";
import Image from "next/image";
import { BarChart2, ArrowRight, Plus } from "lucide-react";
import { useApp } from "@/lib/context/AppContext";

interface LoopStatsCardProps {
  onOpenAddModal: () => void;
}

export function LoopStatsCard({ onOpenAddModal }: LoopStatsCardProps) {
  const { loops } = useApp();

  const totalLoops = loops.length;
  const pendingLoops = loops.filter((l) => !l.completed).length;
  const completedLoops = loops.filter((l) => l.completed).length;

  const highCount = loops.filter((l) => l.priority === "High" && !l.completed).length;
  const mediumCount = loops.filter((l) => l.priority === "Medium" && !l.completed).length;
  const lowCount = loops.filter((l) => l.priority === "Low" && !l.completed).length;

  return (
    <div className="space-y-4">
      {/* Main Stats Card */}
      <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-glass">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#6C5CE7]" />
            <h3 className="font-bold text-[#1E1B4B] text-sm">Loop Stats</h3>
          </div>
          <button className="text-xs font-semibold text-[#6C5CE7] hover:underline flex items-center gap-1">
            <span>View Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Metric Counts */}
        <div className="grid grid-cols-3 gap-2 text-center pb-4 border-b border-[#F1EFF8]">
          <div className="p-2 rounded-2xl bg-[#F8F6FC]">
            <p className="text-xl font-bold text-[#1E1B4B]">{totalLoops}</p>
            <p className="text-[10px] text-[#7C7F96] font-medium mt-0.5">Total Loops</p>
          </div>
          <div className="p-2 rounded-2xl bg-[#EDE9FE]/50">
            <p className="text-xl font-bold text-[#6C5CE7]">{pendingLoops}</p>
            <p className="text-[10px] text-[#7C7F96] font-medium mt-0.5">Pending</p>
          </div>
          <div className="p-2 rounded-2xl bg-emerald-50">
            <p className="text-xl font-bold text-[#10B981]">{completedLoops}</p>
            <p className="text-[10px] text-[#7C7F96] font-medium mt-0.5">Completed</p>
          </div>
        </div>

        {/* Priority Breakdown Donut Chart */}
        <div className="pt-4">
          <h4 className="text-xs font-bold text-[#1E1B4B] mb-3">
            Priority Breakdown
          </h4>
          <div className="flex items-center justify-between gap-4">
            {/* SVG Donut Chart */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#EDE9FE"
                  strokeWidth="5"
                />
                {/* High Segment (Coral/Pink) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#EC4899"
                  strokeWidth="5"
                  strokeDasharray="22 100"
                  strokeDashoffset="0"
                />
                {/* Medium Segment (Purple) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="5"
                  strokeDasharray="45 100"
                  strokeDashoffset="-22"
                />
                {/* Low Segment (Emerald) */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="5"
                  strokeDasharray="20 100"
                  strokeDashoffset="-67"
                />
              </svg>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 flex-1 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
                  <span className="text-[#4B4E6D]">High</span>
                </div>
                <span className="font-bold text-[#1E1B4B]">{highCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  <span className="text-[#4B4E6D]">Medium</span>
                </div>
                <span className="font-bold text-[#1E1B4B]">{mediumCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="text-[#4B4E6D]">Low</span>
                </div>
                <span className="font-bold text-[#1E1B4B]">{lowCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mascot Checklist Card */}
      <div className="bg-gradient-to-br from-white/90 to-[#F6F3FD]/90 backdrop-blur-md rounded-3xl p-5 border border-white/80 text-center shadow-glass relative overflow-hidden group">
        <div className="relative w-[clamp(110px,12vw,140px)] h-[clamp(85px,10vw,110px)] mx-auto mb-2 animate-soft-bounce">
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/10 blur-sm rounded-full pointer-events-none"
            aria-hidden="true"
          />
          <Image
            src="/images/mascot/nimii-3d-checklist.png"
            alt="3D Nimii holding checklist"
            fill
            className="object-contain relative z-10 drop-shadow-sm"
          />
        </div>
        <h4 className="font-bold text-[#1E1B4B] text-sm">Stay on track!</h4>
        <p className="text-xs text-[#7C7F96] mt-1 leading-snug">
          Nimii helps you turn ideas into completed tasks. ♡
        </p>
      </div>

      {/* + Add a New Loop CTA */}
      <button
        onClick={onOpenAddModal}
        className="w-full flex items-center justify-center gap-2 bg-[#6C5CE7] hover:bg-[#5B46D9] active:bg-[#4E38C4] text-white py-3.5 px-4 rounded-2xl font-bold text-sm shadow-md shadow-[#6C5CE7]/25 transition-all transform active:scale-[0.98]"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Add a New Loop</span>
      </button>
    </div>
  );
}
