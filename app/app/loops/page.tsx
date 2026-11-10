"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Search,
  Plus,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { useApp } from "@/lib/context/AppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { OpenLoopCard } from "@/components/loops/OpenLoopCard";
import { LoopStatsCard } from "@/components/loops/LoopStatsCard";
import { TaskModal } from "@/components/loops/TaskModal";
import { OpenLoopItem } from "@/lib/data/mockData";

export default function LoopsPage() {
  const { loops, toggleLoop, deleteLoop, updateLoop, addLoop } = useApp();
  const [activeTab, setActiveTab] = useState<"all" | "today" | "this-week" | "later" | "completed">("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<OpenLoopItem | null>(null);

  const todayCount = loops.filter((l) => l.timeframe === "today" && !l.completed).length;
  const thisWeekCount = loops.filter((l) => l.timeframe === "this-week" && !l.completed).length;
  const laterCount = loops.filter((l) => l.timeframe === "later" && !l.completed).length;
  const completedCount = loops.filter((l) => l.completed).length;

  const filteredLoops = loops.filter((loop) => {
    const matchesSearch =
      loop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loop.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "completed") return loop.completed;
    if (loop.completed) return false;
    if (activeTab === "today") return loop.timeframe === "today";
    if (activeTab === "this-week") return loop.timeframe === "this-week";
    if (activeTab === "later") return loop.timeframe === "later";
    return true;
  });

  const handleEdit = (task: OpenLoopItem) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveModal = (data: Omit<OpenLoopItem, "id" | "completed" | "createdAt">) => {
    if (editingTask) {
      updateLoop(editingTask.id, data);
      setEditingTask(null);
    } else {
      addLoop(data);
    }
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row min-w-0 px-4 md:px-7 pt-2 md:pt-2.5 pb-6 gap-5">
      {/* Center Left Main Tasks Area */}
      <div className="flex-1 flex flex-col min-w-0 space-y-3 md:space-y-3.5">
        {/* Top Header */}
        <PageHeader />

        {/* Top Banner with Kitten Artwork */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-0.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-[#EDE9FE] flex items-center justify-center text-[#6C5CE7] shadow-sm flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#1E1B4B]">
                Open Loops
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Turn conversations into action. Never lose track!
              </p>
            </div>
          </div>

          {/* Banner Kitten Artwork with clamp sizing */}
          <div className="relative w-[clamp(160px,18vw,240px)] h-[clamp(75px,8vw,110px)] select-none pointer-events-none self-end md:self-auto animate-soft-bounce">
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/10 blur-sm rounded-full pointer-events-none"
              aria-hidden="true"
            />
            <Image
              src="/images/mascot/nimii-3d-checklist.png"
              alt="Nimii 3D watching tasks with checklist"
              fill
              className="object-contain relative z-10 drop-shadow-sm"
              priority
            />
          </div>
        </div>

        {/* Filter Tabs & Search Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab("today")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "today"
                  ? "bg-[#6C5CE7] text-white shadow-sm"
                  : "text-[#4B4E6D] hover:bg-white hover:text-[#1E1B4B]"
              }`}
            >
              Today ({todayCount})
            </button>
            <button
              onClick={() => setActiveTab("this-week")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "this-week"
                  ? "bg-[#6C5CE7] text-white shadow-sm"
                  : "text-[#4B4E6D] hover:bg-white hover:text-[#1E1B4B]"
              }`}
            >
              This Week ({thisWeekCount})
            </button>
            <button
              onClick={() => setActiveTab("later")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "later"
                  ? "bg-[#6C5CE7] text-white shadow-sm"
                  : "text-[#4B4E6D] hover:bg-white hover:text-[#1E1B4B]"
              }`}
            >
              Later ({laterCount})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "completed"
                  ? "bg-[#6C5CE7] text-white shadow-sm"
                  : "text-[#4B4E6D] hover:bg-white hover:text-[#1E1B4B]"
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative md:w-64">
            <Search className="w-4 h-4 text-[#7C7F96] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search open loops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white/80 border border-white/80 text-xs text-[#1E1B4B] placeholder-[#94A3B8] outline-none focus:ring-2 focus:ring-[#6C5CE7] shadow-glass-sm"
            />
          </div>
        </div>

        {/* Task List Container */}
        <div className="space-y-4">
          {filteredLoops.length === 0 ? (
            <div className="text-center py-12 bg-white/60 rounded-3xl p-8 border border-white/80">
              <p className="text-sm font-bold text-[#1E1B4B]">
                {activeTab === "completed"
                  ? "No completed tasks yet"
                  : "No pending loops in this view"}
              </p>
              <p className="text-xs text-[#7C7F96] mt-1">
                Enjoy your clear mind, or add a new action item below!
              </p>
            </div>
          ) : (
            filteredLoops.map((loop) => (
              <OpenLoopCard
                key={loop.id}
                loop={loop}
                onToggle={toggleLoop}
                onDelete={deleteLoop}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>

        {/* Bottom Banner Tip */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-glass-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-[#4B4E6D]">
            <Lightbulb className="w-4 h-4 text-[#6C5CE7] flex-shrink-0" />
            <span>
              <strong>Tip:</strong> You can create a new loop from any important message or memory.
            </span>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="text-xs font-bold text-[#6C5CE7] hover:underline flex items-center gap-1 flex-shrink-0"
          >
            <span>Learn how</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Column: Stats Card & Add CTA */}
      <div className="w-full xl:w-80 flex-shrink-0">
        <LoopStatsCard
          onOpenAddModal={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
        />
      </div>

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveModal}
        initialTask={editingTask}
      />
    </div>
  );
}
