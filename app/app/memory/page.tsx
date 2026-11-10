"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Brain,
  Clock,
  Hash,
  Bookmark,
  CheckCircle2,
  Paperclip,
  Search,
  Calendar,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useApp } from "@/lib/context/AppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { MemoryCard } from "@/components/memory/MemoryCard";
import { MemoryDetailsPanel } from "@/components/memory/MemoryDetailsPanel";
import { MemoryItem } from "@/lib/data/mockData";

export default function MemoryPage() {
  const { memories, selectedMemory, setSelectedMemory } = useApp();
  const [activeTab, setActiveTab] = useState<
    "timeline" | "topics" | "saved-facts" | "decisions" | "sources"
  >("timeline");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("All Time");

  const filterTabs = [
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "topics", label: "Topics", icon: Hash },
    { id: "saved-facts", label: "Saved Facts", icon: Bookmark },
    { id: "decisions", label: "Decisions", icon: CheckCircle2 },
    { id: "sources", label: "Sources", icon: Paperclip },
  ];

  // Filter memories
  const filteredMemories = memories.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === "timeline") return true;
    if (activeTab === "topics") return m.type === "topics" || m.category === "AI";
    if (activeTab === "saved-facts") return m.type === "saved-facts" || m.category === "Design";
    if (activeTab === "decisions") return m.type === "decisions" || m.category === "Development";
    if (activeTab === "sources") return m.type === "sources" || m.tags.includes("Web Search");
    return true;
  });

  // Group by date
  const groupedByDate: Record<string, MemoryItem[]> = {};
  filteredMemories.forEach((mem) => {
    const dateKey = mem.date;
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
    groupedByDate[dateKey].push(mem);
  });

  return (
    <div className="flex-1 flex flex-col xl:flex-row min-w-0 p-4 md:p-8 space-y-6">
      {/* Center & Left Content */}
      <div className="flex-1 flex flex-col min-w-0 space-y-6">
        {/* Top Header Controls */}
        <PageHeader />

        {/* Top Banner with Relaxed Lying Mascot */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] flex items-center justify-center text-[#6C5CE7] shadow-sm">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E1B4B]">
                Memory
              </h1>
              <p className="text-xs md:text-sm text-[#64748B] mt-0.5">
                Your past conversations, saved insights and important moments.
              </p>
            </div>
          </div>

          {/* Banner Mascot Kitten Artwork */}
          <div className="relative w-64 h-28 md:w-80 md:h-36 select-none pointer-events-none self-end md:self-auto animate-soft-bounce">
            <Image
              src="/images/mascot/kitten-banner-memory.png"
              alt="Nimii lying down"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Filter Tabs & Search Controls Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Subnav Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 overflow-x-auto">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#6C5CE7] text-white shadow-sm"
                      : "text-[#4B4E6D] hover:bg-white hover:text-[#1E1B4B]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Date Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 text-[#7C7F96] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search your memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white/80 border border-white/80 text-xs text-[#1E1B4B] placeholder-[#94A3B8] outline-none focus:ring-2 focus:ring-[#6C5CE7] shadow-glass-sm"
              />
            </div>

            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-white/80 border border-white/80 text-xs font-semibold text-[#1E1B4B] outline-none shadow-glass-sm cursor-pointer"
            >
              <option value="All Time">All Time</option>
              <option value="Today">Today</option>
              <option value="Past Week">Past Week</option>
              <option value="Past Month">Past Month</option>
            </select>
          </div>
        </div>

        {/* Grouped Memories Timeline */}
        <div className="space-y-6">
          {Object.keys(groupedByDate).length === 0 ? (
            <div className="text-center py-12 bg-white/60 rounded-3xl p-8 border border-white/80">
              <p className="text-sm font-bold text-[#1E1B4B]">No memories found</p>
              <p className="text-xs text-[#7C7F96] mt-1">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            Object.entries(groupedByDate).map(([dateLabel, items]) => (
              <div key={dateLabel} className="space-y-3">
                {/* Date Heading with Dot */}
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6C5CE7]" />
                  <h3 className="font-bold text-xs md:text-sm text-[#1E1B4B]">
                    {dateLabel}
                  </h3>
                </div>

                {/* Items */}
                <div className="space-y-3 pl-5 border-l-2 border-[#EDE9FE] ml-1">
                  {items.map((mem) => (
                    <MemoryCard
                      key={mem.id}
                      memory={mem}
                      isSelected={selectedMemory?.id === mem.id}
                      onSelect={(m) => setSelectedMemory(m)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Banner: Memory Insights */}
        <div className="bg-gradient-to-r from-white/90 via-[#F7F4FD]/90 to-white/90 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-glass flex items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#EDE9FE] flex items-center justify-center text-[#6C5CE7] flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-[#1E1B4B]">
                Memory Insights
              </h4>
              <p className="text-xs text-[#64748B] mt-0.5">
                You&apos;ve researched Next.js 15, LangGraph and AI agents recently!
              </p>
            </div>
          </div>

          {/* Peeking Kitten Mascot Artwork */}
          <div className="relative w-28 h-16 flex-shrink-0 select-none pointer-events-none animate-soft-bounce">
            <Image
              src="/images/mascot/kitten-peeking.png"
              alt="Peeking kitten"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Memory Details Panel */}
      <div className="w-full xl:w-96 flex-shrink-0">
        <MemoryDetailsPanel
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      </div>
    </div>
  );
}
