"use client";

import React from "react";
import type { ChatMessage } from "@/types";
import { AssistantResponse } from "./AssistantResponse";
import { useApp } from "@/lib/context/AppContext";

interface MessageBubbleProps {
  message: ChatMessage;
  onSelectPrompt?: (prompt: string) => void;
  onRegenerate?: () => void;
}

export function MessageBubble({
  message,
  onSelectPrompt,
  onRegenerate,
}: MessageBubbleProps) {
  const { user } = useApp();

  if (message.sender === "assistant") {
    return (
      <AssistantResponse
        message={message}
        onSelectPrompt={onSelectPrompt}
        onRegenerate={onRegenerate}
      />
    );
  }

  // User Message
  return (
    <div className="flex items-start justify-end gap-3 pl-12">
      <div className="flex flex-col items-end max-w-2xl">
        <div className="bg-[#EDE9FE]/90 text-[#1E1B4B] px-5 py-3 rounded-3xl rounded-tr-sm text-sm md:text-[15px] font-medium shadow-sm border border-[#DDD6FE]">
          {message.content}
        </div>
        <span className="text-[10px] text-[#7C7F96] mt-1 mr-1">
          {message.timestamp}
        </span>
      </div>

      <div className="w-8 h-8 rounded-full bg-[#4A72FF] text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0 mt-1">
        {user.avatarInitial}
      </div>
    </div>
  );
}
