"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Clock,
  Search,
  Filter,
  ChevronDown,
  RotateCcw,
  BarChart2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useApp } from "@/lib/context/AppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConversationCard } from "@/components/history/ConversationCard";

export default function HistoryPage() {
  const router = useRouter();
  const {
    conversations,
    setCurrentConversationId,
    deleteConversation,
    renameConversation,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [dateRange, setDateRange] = useState("All Time");
  const [sortBy, setSortBy] = useState("Newest First");
  const [currentPage, setCurrentPage] = useState(1);

  const topicsList = ["All", "AI", "Development", "Study", "Design", "Others"];

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedTopic("All");
    setDateRange("All Time");
    setSortBy("Newest First");
  };

  const handleResume = (id: string) => {
    setCurrentConversationId(id);
    router.push(`/app/chat/${id}`);
  };

  // Filter conversations
  const filteredConvs = conversations.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedTopic !== "All") {
      const matchTopic = c.tags.some(
        (t) => t.toLowerCase() === selectedTopic.toLowerCase()
      );
      if (!matchTopic) return false;
    }

    return true;
  });

  // Group by date label
  const groupedByDate: Record<string, typeof conversations> = {};
  filteredConvs.forEach((c) => {
    const dateKey = c.date;
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
    groupedByDate[dateKey].push(c);
  });

  return (
    <div className="flex-1 flex flex-col xl:flex-row min-w-0 px-4 md:px-7 pt-2 md:pt-2.5 pb-6 gap-5">
      {/* Center Left Main Area */}
      <div className="flex-1 flex flex-col min-w-0 space-y-3 md:space-y-3.5">
        {/* Top Header */}
        <PageHeader />

        {/* Top Banner with Curled Sleeping Kitten */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-[#EDE9FE] flex items-center justify-center text-[#6C5CE7] shadow-sm">
              <Clock className="w-5 h-5 md:w-5.5 md:h-5.5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#1E1B4B]">
                History
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Find and revisit your past conversations.
              </p>
            </div>
          </div>

          {/* Banner Sleeping Kitten Artwork with responsive clamp sizing */}
          <div className="relative w-[clamp(150px,16vw,220px)] h-[clamp(60px,7vw,90px)] select-none pointer-events-none self-end md:self-auto animate-soft-bounce">
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/10 blur-sm rounded-full pointer-events-none"
              aria-hidden="true"
            />
            <Image
              src="/images/mascot/nimii-3d-sleeping.png"
              alt="Nimii 3D curled sleeping kitten"
              fill
              className="object-contain relative z-10 drop-shadow-sm"
              priority
            />
          </div>
        </div>

        {/* Search & Quick Filters Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7C7F96] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/80 border border-white/80 text-xs text-[#1E1B4B] placeholder-[#94A3B8] outline-none focus:ring-2 focus:ring-[#6C5CE7] shadow-glass-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-white/80 border border-white/80 text-xs font-semibold text-[#1E1B4B] outline-none shadow-glass-sm cursor-pointer"
            >
              <option value="All Time">All Time</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
            </select>

            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-white/80 border border-white/80 text-xs font-semibold text-[#1E1B4B] outline-none shadow-glass-sm cursor-pointer"
            >
              {topicsList.map((top) => (
                <option key={top} value={top}>
                  {top === "All" ? "All Topics" : top}
                </option>
              ))}
            </select>

            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-white/80 hover:bg-white border border-white/80 text-xs font-semibold text-[#6C5CE7] shadow-glass-sm transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>

        {/* Grouped Conversations */}
        <div className="space-y-6">
          {Object.keys(groupedByDate).length === 0 ? (
            <div className="text-center py-12 bg-white/60 rounded-3xl p-8 border border-white/80">
              <p className="text-sm font-bold text-[#1E1B4B]">No conversations found</p>
              <p className="text-xs text-[#7C7F96] mt-1">
                Try searching with different terms or clear filters.
              </p>
            </div>
          ) : (
            Object.entries(groupedByDate).map(([dateLabel, convs]) => (
              <div key={dateLabel} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6C5CE7]" />
                  <h3 className="font-bold text-xs md:text-sm text-[#1E1B4B]">
                    {dateLabel}
                  </h3>
                </div>

                <div className="space-y-3 pl-4 border-l-2 border-[#EDE9FE] ml-1">
                  {convs.map((conv) => (
                    <ConversationCard
                      key={conv.id}
                      conversation={conv}
                      onResume={handleResume}
                      onDelete={deleteConversation}
                      onRename={renameConversation}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Bar (< 1 2 3 >) */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-xl bg-white/80 hover:bg-white border border-white text-xs text-[#7C7F96] hover:text-[#1E1B4B] shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                currentPage === page
                  ? "bg-[#6C5CE7] text-white shadow-sm"
                  : "bg-white/80 hover:bg-white text-[#4B4E6D]"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
            className="p-2 rounded-xl bg-white/80 hover:bg-white border border-white text-xs text-[#7C7F96] hover:text-[#1E1B4B] shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Sidebar: Filters & Stats */}
      <div className="w-full xl:w-80 flex-shrink-0 space-y-4">
        {/* Filters Card */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-glass space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#6C5CE7]" />
            <h3 className="font-bold text-[#1E1B4B] text-sm">Filters</h3>
          </div>

          {/* Topics Chips */}
          <div>
            <h4 className="text-xs font-bold text-[#1E1B4B] mb-2 flex items-center gap-1.5">
              <span>Topics</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {topicsList.map((top) => (
                <button
                  key={top}
                  onClick={() => setSelectedTopic(top)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedTopic === top
                      ? "bg-[#6C5CE7] text-white shadow-sm"
                      : "bg-[#F8F6FC] text-[#4B4E6D] hover:bg-[#EDE9FE]"
                  }`}
                >
                  {top}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h4 className="text-xs font-bold text-[#1E1B4B] mb-1.5">
              Date Range
            </h4>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F8F6FC] border border-[#DDD6FE] text-xs font-semibold text-[#1E1B4B] outline-none"
            >
              <option value="All Time">All Time</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <h4 className="text-xs font-bold text-[#1E1B4B] mb-1.5">
              Sort By
            </h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F8F6FC] border border-[#DDD6FE] text-xs font-semibold text-[#1E1B4B] outline-none"
            >
              <option value="Newest First">Newest First</option>
              <option value="Oldest First">Oldest First</option>
              <option value="Most Messages">Most Messages</option>
            </select>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-glass">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="w-4 h-4 text-[#6C5CE7]" />
            <h3 className="font-bold text-[#1E1B4B] text-sm">Quick Stats</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-2xl bg-[#F8F6FC]">
              <p className="text-lg font-bold text-[#1E1B4B]">42</p>
              <p className="text-[10px] text-[#7C7F96]">Total</p>
            </div>
            <div className="p-2 rounded-2xl bg-[#EDE9FE]/50">
              <p className="text-lg font-bold text-[#6C5CE7]">35</p>
              <p className="text-[10px] text-[#7C7F96]">This Month</p>
            </div>
            <div className="p-2 rounded-2xl bg-emerald-50">
              <p className="text-lg font-bold text-[#10B981]">12</p>
              <p className="text-[10px] text-[#7C7F96]">This Week</p>
            </div>
          </div>
        </div>

        {/* Bottom Celebration Mascot Card */}
        <div className="bg-gradient-to-br from-white/90 to-[#F6F3FD]/90 backdrop-blur-md rounded-3xl p-5 border border-white/80 text-center shadow-glass relative overflow-hidden group">
          <div className="relative w-32 h-20 mx-auto mb-2 select-none pointer-events-none animate-soft-bounce">
            <Image
              src="/images/mascot/nimii-3d-celebrating.png"
              alt="Nimii 3D mascot celebration"
              fill
              className="object-contain drop-shadow-sm"
            />
          </div>
          <h4 className="font-bold text-[#1E1B4B] text-xs">
            Your memories, always with you ♡
          </h4>
        </div>
      </div>
    </div>
  );
}
