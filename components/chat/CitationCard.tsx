"use client";

import React from "react";
import { ExternalLink, Globe } from "lucide-react";
import type { Citation } from "@/types";

export function CitationCard({ citation }: { citation: Citation }) {
  // Pick an icon or avatar letter for source
  const domain = citation.domain.toLowerCase();
  const isGoogle = domain.includes("google");
  const isOpenAI = domain.includes("openai");
  const isAnthropic = domain.includes("anthropic");

  return (
    <a
      href={citation.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-white/95 hover:bg-white rounded-2xl border border-[#EDE9FE] shadow-sm hover:shadow-md transition-all group w-full sm:w-auto sm:min-w-[180px] sm:flex-1 min-w-0"
    >
      <div className="w-8 h-8 rounded-xl bg-[#F5F2FC] flex items-center justify-center flex-shrink-0 text-[#6C5CE7] font-bold text-xs">
        {isOpenAI ? (
          <span className="text-[#10A37F] font-black">AI</span>
        ) : isGoogle ? (
          <span className="text-[#4285F4] font-black">G</span>
        ) : isAnthropic ? (
          <span className="text-[#D97706] font-black">AI</span>
        ) : (
          <Globe className="w-4 h-4 text-[#6C5CE7]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h5 className="text-xs font-bold text-[#1E1B4B] group-hover:text-[#6C5CE7] transition-colors truncate">
          {citation.title}
        </h5>
        <p className="text-[11px] text-[#7C7F96] truncate">{citation.domain}</p>
      </div>

      <ExternalLink className="w-3.5 h-3.5 text-[#A5A6C2] group-hover:text-[#6C5CE7] flex-shrink-0 transition-colors" />
    </a>
  );
}
