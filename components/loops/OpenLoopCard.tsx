"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  MoreVertical,
  Calendar,
  Briefcase,
  Github,
  Trophy,
  BookOpen,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  Check,
} from "lucide-react";
import type { OpenLoopItem } from "@/types";

interface OpenLoopCardProps {
  loop: OpenLoopItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (loop: OpenLoopItem) => void;
}

export function OpenLoopCard({
  loop,
  onToggle,
  onDelete,
  onEdit,
}: OpenLoopCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "GitHub":
        return <Github className="w-3.5 h-3.5" />;
      case "Hackathon":
        return <Trophy className="w-3.5 h-3.5 text-amber-500" />;
      case "Study":
        return <BookOpen className="w-3.5 h-3.5 text-blue-500" />;
      default:
        return <Briefcase className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-pink-50 text-pink-600 border border-pink-100">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            <span>High</span>
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#6C5CE7] border border-[#DDD6FE]">
            <span className="text-xs">∧</span>
            <span>Medium</span>
          </span>
        );
      case "Low":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            <ArrowDown className="w-3 h-3 stroke-[2.5]" />
            <span>Low</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative group p-4 md:p-5 rounded-3xl bg-white/85 hover:bg-white border border-white/80 hover:border-[#DDD6FE] shadow-glass-sm hover:shadow-md transition-all flex items-start justify-between gap-4">
      {/* Left: Checkbox & Content */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Interactive Custom Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(loop.id)}
          className={`mt-1 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center flex-shrink-0 ${
            loop.completed
              ? "bg-[#10B981] border-[#10B981] text-white"
              : "border-[#C4B5FD] hover:border-[#6C5CE7] bg-white/50"
          }`}
          aria-label={loop.completed ? "Mark incomplete" : "Mark complete"}
        >
          {loop.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <h4
            className={`font-bold text-sm md:text-base leading-snug transition-all ${
              loop.completed
                ? "line-through text-[#94A3B8]"
                : "text-[#1E1B4B] group-hover:text-[#6C5CE7]"
            }`}
          >
            {loop.title}
          </h4>
          <p className="text-xs md:text-sm text-[#64748B] mt-1 leading-relaxed">
            {loop.description}
          </p>

          {/* Badges row */}
          <div className="flex items-center gap-2.5 mt-3 flex-wrap">
            {/* Category tag */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#F5F2FC] text-[#4B4E6D]">
              {getCategoryIcon(loop.category)}
              <span>{loop.category}</span>
            </span>

            {/* Due date tag */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold ${
                loop.dueDate.toLowerCase().includes("today")
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-white text-[#7C7F96] border border-[#EDE9FE]"
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>{loop.dueDate}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Priority Badge & 3-dots Menu */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {getPriorityBadge(loop.priority)}

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-full text-[#7C7F96] hover:bg-[#F3F0FF] hover:text-[#1E1B4B] transition-colors"
            aria-label="Actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white/95 backdrop-blur-xl rounded-2xl p-1.5 shadow-xl border border-[#EDE9FE] z-30 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(loop);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-[#1E1B4B] hover:bg-[#F3F0FF] text-left"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(loop.id);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 text-left"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
