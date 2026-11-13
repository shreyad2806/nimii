"use client";

import React, { useState } from "react";
import Link from "next/navigation";
import { useRouter } from "next/navigation";
import {
  FileText,
  X,
  Clock,
  CheckCircle2,
  MessageSquare,
  Bookmark,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import type { MemoryItem } from "@/types";

interface MemoryDetailsPanelProps {
  memory: MemoryItem | null;
  onClose: () => void;
}

export function MemoryDetailsPanel({ memory, onClose }: MemoryDetailsPanelProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  if (!memory) return null;

  const handleSaveAgain = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleViewChat = () => {
    if (memory.conversationId) {
      router.push(`/app/chat/${memory.conversationId}`);
    } else {
      router.push(`/app`);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-white/90 shadow-glass flex flex-col gap-5 h-full overflow-y-auto">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F1EFF8]">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#6C5CE7]" />
          <h3 className="font-bold text-[#1E1B4B] text-base">Memory Details</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-[#7C7F96] hover:bg-[#F3F0FF] hover:text-[#1E1B4B] transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Title & Tag */}
      <div>
        <h4 className="text-lg font-bold text-[#1E1B4B] leading-snug">
          {memory.title}
        </h4>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EDE9FE] text-[#6C5CE7]">
            {memory.category}
          </span>
          <span className="text-xs text-[#7C7F96] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{memory.date} • {memory.time}</span>
          </span>
        </div>
      </div>

      {/* Description / Summary */}
      <p className="text-sm text-[#2D2B55] leading-relaxed">
        {memory.details || memory.summary}
      </p>

      {/* Key Points Checklist Box */}
      {memory.keyPoints && memory.keyPoints.length > 0 && (
        <div className="bg-[#F8F6FC] rounded-2xl p-4 border border-[#EDE9FE] space-y-2.5">
          {memory.keyPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#6C5CE7] flex-shrink-0 mt-0.5" />
              <span className="text-xs text-[#2D2B55] font-medium leading-relaxed">
                {point}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Original Conversation Link */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F5F2FC] border border-[#EDE9FE]">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#6C5CE7]" />
          <span className="text-xs font-semibold text-[#1E1B4B]">
            Original Conversation
          </span>
        </div>
        <button
          onClick={handleViewChat}
          className="text-xs font-bold text-[#6C5CE7] hover:underline flex items-center gap-1"
        >
          <span>View Chat</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Related Memories */}
      {memory.relatedMemories && memory.relatedMemories.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#6C5CE7]">
            ✦ Related Memories
          </span>
          <div className="space-y-2">
            {memory.relatedMemories.map((rel) => (
              <div
                key={rel.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#EDE9FE] hover:border-[#C4B5FD] cursor-pointer transition-all shadow-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-[#6C5CE7] flex-shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-[#1E1B4B] truncate">
                      {rel.title}
                    </p>
                    <p className="text-[10px] text-[#7C7F96]">{rel.date}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#7C7F96] flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save to Memory Button */}
      <div className="mt-auto pt-2">
        <button
          onClick={handleSaveAgain}
          className="w-full flex items-center justify-center gap-2 bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#6C5CE7] font-bold text-xs py-3 px-4 rounded-2xl transition-all"
        >
          <Bookmark className="w-4 h-4" />
          <span>{saved ? "Saved to Memory!" : "Save to Memory"}</span>
        </button>
      </div>
    </div>
  );
}
