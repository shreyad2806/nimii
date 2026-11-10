"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const DEFAULT_PROMPTS = [
  { text: "What's new in React 19?", full: "What's new in React 19 and React Server Components?" },
  { text: "Summarize this article", full: "Can you summarize key insights from the article I'm reading?" },
  { text: "What did I ask yesterday?", full: "What topics and questions did I explore yesterday in our conversations?" },
  { text: "Track my tasks", full: "Review my current Open Loops and tell me what's due today." },
];

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-bold text-[#6C5CE7]">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Try asking...</span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {DEFAULT_PROMPTS.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(item.full)}
            className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/75 hover:bg-white border border-white/80 shadow-glass-sm hover:shadow-md transition-all text-xs font-semibold text-[#1E1B4B] hover:text-[#6C5CE7] hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>{item.text}</span>
            <ArrowRight className="w-3 h-3 text-[#A5A6C2] group-hover:text-[#6C5CE7] group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
}
