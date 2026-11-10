"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  RotateCcw,
  Bookmark,
  ChevronDown,
} from "lucide-react";
import { ChatMessage } from "@/lib/data/mockData";
import { CitationCard } from "./CitationCard";
import { useApp } from "@/lib/context/AppContext";

interface AssistantResponseProps {
  message: ChatMessage;
  onSelectPrompt?: (prompt: string) => void;
  onRegenerate?: () => void;
}

export function AssistantResponse({
  message,
  onSelectPrompt,
  onRegenerate,
}: AssistantResponseProps) {
  const { addMemory } = useApp();
  const [copied, setCopied] = useState(false);
  const [savedMemory, setSavedMemory] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(
    message.liked === true ? "up" : message.liked === false ? "down" : null
  );
  const [showAllSources, setShowAllSources] = useState(false);

  const handleCopy = () => {
    const fullText = [
      message.content,
      message.highlights?.map((h, i) => `${i + 1}. ${h}`).join("\n"),
    ]
      .filter(Boolean)
      .join("\n\n");

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToMemory = () => {
    addMemory({
      title: message.highlights?.[0]?.slice(0, 45) || "Assistant Key Insight",
      summary: message.content,
      details: message.highlights?.join("\n"),
      date: "Today • " + new Date().toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }),
      time: message.timestamp,
      category: "AI",
      type: "saved-facts",
      tags: ["Chat Insight", "Saved"],
    });
    setSavedMemory(true);
    setTimeout(() => setSavedMemory(false), 2500);
  };

  return (
    <div className="flex items-start gap-3 md:gap-4 group">
      {/* Assistant Kitten Avatar */}
      <div className="relative w-10 h-10 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-white/80 bg-white">
        <Image
          src="/images/mascot/nimii-avatar.png"
          alt="Nimii"
          fill
          className="object-contain p-0.5"
        />
      </div>

      {/* Message Content Container */}
      <div className="flex-1 max-w-3xl space-y-3">
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-white/90 shadow-glass space-y-4">
          {/* Main content lead */}
          <div className="text-sm md:text-[15px] text-[#1E1B4B] leading-relaxed">
            {message.content}
          </div>

          {/* Highlights badge & list */}
          {message.highlights && message.highlights.length > 0 && (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE9FE] text-[#6C5CE7] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Key Highlights</span>
              </div>

              <div className="space-y-2.5">
                {message.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#EDE9FE] text-[#6C5CE7] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-[#2D2B55] leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Citations section */}
          {message.citations && message.citations.length > 0 && (
            <div className="pt-2 w-full">
              <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 w-full">
                {message.citations.map((citation) => (
                  <CitationCard key={citation.id} citation={citation} />
                ))}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-purple-50 flex-wrap">
            <div className="flex items-center gap-1">
              {/* Thumbs up */}
              <button
                type="button"
                onClick={() => setFeedback(feedback === "up" ? null : "up")}
                className={`p-1.5 rounded-xl text-xs flex items-center gap-1 transition-colors ${
                  feedback === "up"
                    ? "bg-[#EDE9FE] text-[#6C5CE7] font-semibold"
                    : "text-[#7C7F96] hover:bg-[#F3F0FF] hover:text-[#1E1B4B]"
                }`}
                title="Helpful"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="text-xs">Helpful</span>
              </button>

              {/* Thumbs down */}
              <button
                type="button"
                onClick={() => setFeedback(feedback === "down" ? null : "down")}
                className={`p-1.5 rounded-xl text-xs flex items-center gap-1 transition-colors ${
                  feedback === "down"
                    ? "bg-rose-100 text-rose-600 font-semibold"
                    : "text-[#7C7F96] hover:bg-[#F3F0FF] hover:text-[#1E1B4B]"
                }`}
                title="Not helpful"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span className="text-xs">Not helpful</span>
              </button>

              {/* Copy */}
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-xl text-xs text-[#7C7F96] hover:bg-[#F3F0FF] hover:text-[#1E1B4B] flex items-center gap-1 transition-colors"
                title="Copy response"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {/* Regenerate */}
              {onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="p-1.5 rounded-xl text-xs text-[#7C7F96] hover:bg-[#F3F0FF] hover:text-[#1E1B4B] flex items-center gap-1 transition-colors"
                  title="Regenerate response"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              )}

              {/* Save to Memory */}
              <button
                type="button"
                onClick={handleSaveToMemory}
                className={`p-1.5 rounded-xl text-xs flex items-center gap-1 transition-colors ${
                  savedMemory
                    ? "bg-emerald-100 text-emerald-700 font-bold"
                    : "text-[#7C7F96] hover:bg-[#F3F0FF] hover:text-[#6C5CE7]"
                }`}
                title="Save this to Memory"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{savedMemory ? "Saved to Memory!" : "Save to Memory"}</span>
              </button>
            </div>

            {/* Sources dropdown trigger if citations present */}
            {message.citations && message.citations.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAllSources(!showAllSources)}
                className="text-xs text-[#7C7F96] hover:text-[#6C5CE7] flex items-center gap-1 font-medium"
              >
                <span>{message.citations.length} sources</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Follow-up suggestions */}
        {message.followUps && message.followUps.length > 0 && (
          <div className="space-y-2 pt-1 pl-1">
            <div className="flex items-center gap-1 text-xs font-semibold text-[#6C5CE7]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>You might also ask...</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {message.followUps.map((question, qIdx) => (
                <button
                  key={qIdx}
                  type="button"
                  onClick={() => onSelectPrompt?.(question)}
                  className="px-3.5 py-1.5 rounded-2xl bg-white/70 hover:bg-white text-xs text-[#1E1B4B] hover:text-[#6C5CE7] font-medium border border-[#EDE9FE] shadow-sm hover:shadow-md transition-all text-left"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
