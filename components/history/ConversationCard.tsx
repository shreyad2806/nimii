"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  MoreVertical,
  Globe,
  Lightbulb,
  CheckSquare,
  FileText,
  Code,
  Trash2,
  Edit2,
  Download,
} from "lucide-react";
import { Conversation } from "@/lib/data/mockData";

interface ConversationCardProps {
  conversation: Conversation;
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

export function ConversationCard({
  conversation,
  onResume,
  onDelete,
  onRename,
}: ConversationCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);

  const getCategoryIcon = (tags: string[]) => {
    const joined = tags.join(" ").toLowerCase();
    if (joined.includes("web search") || joined.includes("globe")) {
      return <Globe className="w-5 h-5 text-[#6C5CE7]" />;
    }
    if (joined.includes("study") || joined.includes("education")) {
      return <CheckSquare className="w-5 h-5 text-[#10B981]" />;
    }
    if (joined.includes("research") || joined.includes("tech")) {
      return <Lightbulb className="w-5 h-5 text-[#F59E0B]" />;
    }
    if (joined.includes("design")) {
      return <FileText className="w-5 h-5 text-[#8B5CF6]" />;
    }
    return <Code className="w-5 h-5 text-[#6366F1]" />;
  };

  const getIconBg = (tags: string[]) => {
    const joined = tags.join(" ").toLowerCase();
    if (joined.includes("web search")) return "bg-[#EDE9FE]";
    if (joined.includes("study")) return "bg-[#D1FAE5]";
    if (joined.includes("research")) return "bg-[#FEF3C7]";
    if (joined.includes("design")) return "bg-[#F3E8FF]";
    return "bg-[#E0E7FF]";
  };

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(conversation, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `${conversation.title.replace(/\s+/g, "_")}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSaveRename = () => {
    if (editTitle.trim()) {
      onRename(conversation.id, editTitle.trim());
    }
    setIsRenaming(false);
  };

  return (
    <div className="group p-4 md:p-5 rounded-3xl bg-white/85 hover:bg-white border border-white/80 hover:border-[#DDD6FE] shadow-glass-sm hover:shadow-md transition-all flex items-center justify-between gap-4">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Category Icon */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${getIconBg(
            conversation.tags
          )}`}
        >
          {getCategoryIcon(conversation.tags)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {isRenaming ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveRename();
                  if (e.key === "Escape") setIsRenaming(false);
                }}
                className="px-3 py-1 rounded-xl bg-purple-50 border border-[#6C5CE7] text-sm font-bold text-[#1E1B4B] outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveRename}
                className="text-xs font-bold text-[#6C5CE7] hover:underline"
              >
                Save
              </button>
            </div>
          ) : (
            <h4
              onClick={() => onResume(conversation.id)}
              className="font-bold text-[#1E1B4B] group-hover:text-[#6C5CE7] transition-colors text-sm md:text-base leading-snug cursor-pointer truncate"
            >
              {conversation.title}
            </h4>
          )}

          <p className="text-xs md:text-sm text-[#64748B] mt-1 line-clamp-1">
            {conversation.preview}
          </p>

          {/* Tags */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {conversation.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F5F2FC] text-[#6C5CE7]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Time, Messages count, Resume button, 3-dots */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-medium text-[#1E1B4B]">
            {conversation.timestamp}
          </p>
          <p className="text-[11px] text-[#7C7F96]">
            {conversation.messageCount} messages
          </p>
        </div>

        {/* Resume Button */}
        <button
          onClick={() => onResume(conversation.id)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#EDE9FE] hover:bg-[#DDD6FE] text-xs font-bold text-[#6C5CE7] transition-all transform active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-[#6C5CE7]" />
          <span>Resume</span>
        </button>

        {/* Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-full text-[#7C7F96] hover:bg-[#F3F0FF] hover:text-[#1E1B4B] transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-white/95 backdrop-blur-xl rounded-2xl p-1.5 shadow-xl border border-[#EDE9FE] z-30 flex flex-col gap-1">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setIsRenaming(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-[#1E1B4B] hover:bg-[#F3F0FF] text-left"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span>Rename</span>
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleExport();
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-[#1E1B4B] hover:bg-[#F3F0FF] text-left"
              >
                <Download className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span>Export Chat</span>
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(conversation.id);
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
