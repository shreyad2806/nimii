"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  Bookmark,
  Paperclip,
  ArrowRight,
  Send,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/context/AppContext";

interface ChatComposerProps {
  placeholder?: string;
  initialValue?: string;
  conversationId?: string;
  compact?: boolean;
  onSendSuccess?: (conversationId: string) => void;
}

export function ChatComposer({
  placeholder = "Ask Nimii anything...",
  initialValue = "",
  conversationId,
  compact = false,
  onSendSuccess,
}: ChatComposerProps) {
  const router = useRouter();
  const {
    searchWebEnabled,
    setSearchWebEnabled,
    rememberThisEnabled,
    setRememberThisEnabled,
    sendMessage,
    mascotState,
  } = useApp();

  const [prompt, setPrompt] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialValue) {
      setPrompt(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const convId = await sendMessage(trimmed, {
        isWebSearch: searchWebEnabled,
        isRemembered: rememberThisEnabled,
        conversationId,
      });

      setPrompt("");
      setAttachmentName(null);

      if (onSendSuccess) {
        onSendSuccess(convId);
      } else if (!conversationId) {
        router.push(`/app/chat/${convId}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full bg-white/90 backdrop-blur-md rounded-3xl border border-white/90 shadow-glass transition-all focus-within:shadow-float focus-within:border-[#C4B5FD] ${
        compact ? "p-2.5" : "p-4"
      }`}
    >
      {/* Attached file chip if any */}
      {attachmentName && (
        <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDE9FE] text-[#6C5CE7] text-xs rounded-full font-medium">
          <Paperclip className="w-3.5 h-3.5" />
          <span className="truncate max-w-[200px]">{attachmentName}</span>
          <button
            type="button"
            onClick={() => setAttachmentName(null)}
            className="ml-1 hover:text-rose-500 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Text Input */}
      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={compact ? 1 : 2}
        className="w-full bg-transparent text-[#1E1B4B] placeholder-[#94A3B8] resize-none outline-none text-sm md:text-base font-normal leading-relaxed"
      />

      {/* Bottom Controls Bar */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-purple-50">
        {/* Left Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Web Toggle */}
          <button
            type="button"
            onClick={() => setSearchWebEnabled((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              searchWebEnabled
                ? "bg-[#EDE9FE] text-[#6C5CE7] border border-[#C4B5FD]"
                : "bg-transparent text-[#7C7F96] hover:bg-[#F3F0FF] hover:text-[#1E1B4B]"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Search Web</span>
          </button>

          {/* Remember This Toggle */}
          <button
            type="button"
            onClick={() => setRememberThisEnabled((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              rememberThisEnabled
                ? "bg-[#EDE9FE] text-[#6C5CE7] border border-[#C4B5FD]"
                : "bg-transparent text-[#7C7F96] hover:bg-[#F3F0FF] hover:text-[#1E1B4B]"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Remember this</span>
          </button>
        </div>

        {/* Right Actions: Paperclip & Submit */}
        <div className="flex items-center gap-2">
          {/* File attachment input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-[#7C7F96] hover:text-[#6C5CE7] hover:bg-[#F3F0FF] rounded-full transition-colors"
            title="Attach file or screenshot"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!prompt.trim() || isSubmitting}
            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
              prompt.trim() && !isSubmitting
                ? "bg-[#6C5CE7] text-white hover:bg-[#5A49D6] active:scale-95 shadow-md shadow-[#6C5CE7]/30"
                : "bg-[#E2DEFA] text-[#A5A6C2] cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
