"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Brain,
  CheckCircle2,
  Search,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/context/AppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { SuggestedPrompts } from "@/components/home/SuggestedPrompts";
import { RightContextPanel } from "@/components/layout/RightContextPanel";
import { TaskModal } from "@/components/loops/TaskModal";

export default function HomePage() {
  const router = useRouter();
  const { user, memories, loops, toggleLoop, addLoop } = useApp();
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleSelectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
  };

  const recentMemory = memories[0] || {
    title: "You explored LangGraph",
    summary: "Discussed agentic workflows and memory management...",
    time: "2h ago",
  };

  const activeLoop = loops.find((l) => !l.completed) || loops[0];

  return (
    <div className="flex-1 flex flex-col xl:flex-row min-w-0">
      {/* Center Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 px-4 md:px-7 pt-2 md:pt-2.5 pb-6 space-y-3 md:space-y-3.5">
        {/* Header Controls */}
        <PageHeader />

        {/* Hero Banner with Kitten Playing with Yarn */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-3 pt-0">
          {/* Greeting Typography */}
          <div className="space-y-1 z-10 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl lg:text-[32px] font-extrabold text-[#1E1B4B] tracking-tight flex items-center justify-center md:justify-start gap-2">
              <span>{getGreeting()}, {user.name.split(" ")[0]}!</span>
              <span className="text-amber-400">✨</span>
            </h1>
            <p className="text-xs md:text-sm text-[#4B4E6D] font-medium">
              Search the web. Remember what matters.
            </p>
          </div>

          {/* 3D Kitten with Yarn Ball artwork with responsive clamp sizing */}
          <div className="relative w-[clamp(170px,20vw,270px)] h-[clamp(105px,12vw,145px)] select-none pointer-events-none flex-shrink-0 animate-soft-bounce">
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2.5 bg-black/10 blur-sm rounded-full pointer-events-none"
              aria-hidden="true"
            />
            <Image
              src="/images/mascot/nimii-3d-yarn.png"
              alt="Nimii 3D kitten playing with purple yarn"
              fill
              className="object-contain relative z-10 drop-shadow-sm"
              priority
            />
          </div>
        </div>

        {/* Chat Composer */}
        <div className="w-full">
          <ChatComposer initialValue={selectedPrompt} />
        </div>

        {/* Suggested Prompts */}
        <SuggestedPrompts onSelectPrompt={handleSelectPrompt} />

        {/* Bottom Three Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-0.5">
          {/* 1. Recent Memory Card */}
          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-glass flex flex-col justify-between relative overflow-hidden group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#EDE9FE] flex items-center justify-center text-[#6C5CE7]">
                    <Brain className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-bold text-[#1E1B4B] text-sm">
                    Recent Memory
                  </h3>
                </div>
                <Link
                  href="/app/memory"
                  className="text-xs font-semibold text-[#6C5CE7] hover:underline flex items-center gap-1"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E1B4B] group-hover:text-[#6C5CE7] transition-colors truncate">
                    {recentMemory.title}
                  </span>
                  <span className="text-[10px] text-[#7C7F96] flex-shrink-0">
                    {recentMemory.time}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] line-clamp-2">
                  {recentMemory.summary}
                </p>
              </div>
            </div>

            {/* 3D Resting Kitten bottom graphic */}
            <div className="relative w-24 h-12 self-center mt-3 select-none pointer-events-none opacity-90 group-hover:scale-105 transition-transform animate-soft-bounce">
              <Image
                src="/images/mascot/nimii-3d-rest.png?v=3d"
                alt="Nimii 3D resting kitten"
                fill
                className="object-contain drop-shadow-sm"
              />
            </div>
          </div>

          {/* 2. Open Loops Card */}
          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-glass flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-bold text-[#1E1B4B] text-sm">
                    Open Loops
                  </h3>
                </div>
                <Link
                  href="/app/loops"
                  className="text-xs font-semibold text-[#E17055] hover:underline flex items-center gap-1"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {activeLoop && (
                <div
                  onClick={() => toggleLoop(activeLoop.id)}
                  className="space-y-1.5 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border transition-all flex items-center justify-center flex-shrink-0 ${
                          activeLoop.completed
                            ? "bg-[#10B981] border-[#10B981]"
                            : "border-[#C4B5FD] group-hover:border-[#6C5CE7]"
                        }`}
                      >
                        {activeLoop.completed && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>
                      <span
                        className={`text-xs truncate ${
                          activeLoop.completed
                            ? "line-through text-[#94A3B8]"
                            : "font-bold text-[#1E1B4B] group-hover:text-[#6C5CE7]"
                        }`}
                      >
                        {activeLoop.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex-shrink-0">
                      {activeLoop.dueDate}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-1 pl-5">
                    {activeLoop.description}
                  </p>
                </div>
              )}
            </div>

            {/* Add a new loop pill button */}
            <div className="mt-4 pt-2 flex justify-center">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white hover:bg-[#F3F0FF] text-xs font-bold text-[#6C5CE7] border border-[#DDD6FE] shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add a new loop</span>
              </button>
            </div>
          </div>

          {/* 3. Quick Actions Card */}
          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-glass flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-[#1E1B4B] text-sm mb-3">
                Quick Actions
              </h3>

              {/* 3 Action Tiles */}
              <div className="grid grid-cols-3 gap-2">
                {/* Search */}
                <button
                  onClick={() => router.push("/app")}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F8F6FC] hover:bg-[#EDE9FE] transition-all group"
                >
                  <Search className="w-5 h-5 text-[#6C5CE7] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-[#1E1B4B]">Search</span>
                </button>

                {/* Memory */}
                <button
                  onClick={() => router.push("/app/memory")}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F8F6FC] hover:bg-[#EDE9FE] transition-all group"
                >
                  <Brain className="w-5 h-5 text-[#6C5CE7] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-[#1E1B4B]">Memory</span>
                </button>

                {/* Loops */}
                <button
                  onClick={() => router.push("/app/loops")}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#F8F6FC] hover:bg-[#EDE9FE] transition-all group"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#6C5CE7] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-[#1E1B4B]">Loops</span>
                </button>
              </div>
            </div>

            {/* Nimii's got you footer */}
            <div className="mt-4 pt-2 text-center">
              <span className="text-xs font-bold text-[#6C5CE7] inline-flex items-center gap-1.5">
                <span>Nimii&apos;s got you!</span>
                <span className="text-sm">🐾</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Right Context Panel (Desktop) */}
      <RightContextPanel />

      {/* Add Loop Modal */}
      <TaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addLoop}
      />
    </div>
  );
}
