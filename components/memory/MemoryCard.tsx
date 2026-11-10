"use client";

import React from "react";
import { Globe, Lightbulb, CheckSquare, Bookmark, FileText, ArrowRight } from "lucide-react";
import { MemoryItem } from "@/lib/data/mockData";

interface MemoryCardProps {
  memory: MemoryItem;
  isSelected?: boolean;
  onSelect: (memory: MemoryItem) => void;
}

export function MemoryCard({ memory, isSelected, onSelect }: MemoryCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Research":
        return <Globe className="w-5 h-5 text-[#6C5CE7]" />;
      case "AI":
        return <Lightbulb className="w-5 h-5 text-[#F59E0B]" />;
      case "Development":
        return <CheckSquare className="w-5 h-5 text-[#10B981]" />;
      case "Design":
        return <Bookmark className="w-5 h-5 text-[#EC4899]" />;
      default:
        return <FileText className="w-5 h-5 text-[#6C5CE7]" />;
    }
  };

  const getIconBg = (category: string) => {
    switch (category) {
      case "Research":
        return "bg-[#F3F0FF]";
      case "AI":
        return "bg-[#FEF3C7]";
      case "Development":
        return "bg-[#D1FAE5]";
      case "Design":
        return "bg-[#FCE7F3]";
      default:
        return "bg-[#EDE9FE]";
    }
  };

  return (
    <div
      onClick={() => onSelect(memory)}
      className={`p-4 md:p-5 rounded-3xl bg-white/85 hover:bg-white border transition-all cursor-pointer shadow-glass-sm hover:shadow-md flex items-center justify-between gap-4 ${
        isSelected
          ? "border-[#6C5CE7] ring-2 ring-[#6C5CE7]/20"
          : "border-white/80 hover:border-[#DDD6FE]"
      }`}
    >
      <div className="flex items-start gap-4 flex-1">
        {/* Category Icon Badge */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${getIconBg(
            memory.category
          )}`}
        >
          {getCategoryIcon(memory.category)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#1E1B4B] text-sm md:text-base leading-snug">
            {memory.title}
          </h4>
          <p className="text-xs md:text-sm text-[#4B4E6D] mt-1 line-clamp-2">
            {memory.summary}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-[#7C7F96]">
            <span>{memory.time}</span>
            <span>•</span>
            <span className="font-medium text-[#6C5CE7]">{memory.tags.join(" • ")}</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(memory);
        }}
        className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#EDE9FE]/70 hover:bg-[#EDE9FE] text-xs font-semibold text-[#6C5CE7] transition-all flex-shrink-0"
      >
        <span>View Details</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
