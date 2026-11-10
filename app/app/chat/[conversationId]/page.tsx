"use client";

import React, { useState, useRef, useEffect, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Copy,
  Check,
  MoreVertical,
  Share2,
  Trash2,
  Edit2,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/context/AppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { RightContextPanel } from "@/components/layout/RightContextPanel";

interface ChatPageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const conversationId = resolvedParams.conversationId;

  const {
    conversations,
    setCurrentConversationId,
    deleteConversation,
    renameConversation,
    sendMessage,
    mascotState,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === conversationId) || conversations[0];

  useEffect(() => {
    if (activeConv) {
      setCurrentConversationId(activeConv.id);
      setNewTitle(activeConv.title);
    }
  }, [activeConv, setCurrentConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages.length]);

  const handleCopyChat = () => {
    if (!activeConv) return;
    const transcript = activeConv.messages
      .map((m) => `[${m.sender.toUpperCase()}]: ${m.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(transcript);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSelectPrompt = (prompt: string) => {
    sendMessage(prompt, { conversationId: activeConv.id });
  };

  const handleRegenerate = () => {
    const lastUserMsg = [...activeConv.messages]
      .reverse()
      .find((m) => m.sender === "user");
    if (lastUserMsg) {
      sendMessage(lastUserMsg.content, { conversationId: activeConv.id });
    }
  };

  const handleSaveRename = () => {
    if (newTitle.trim() && activeConv) {
      renameConversation(activeConv.id, newTitle.trim());
    }
    setIsRenaming(false);
  };

  const handleDelete = () => {
    if (activeConv) {
      deleteConversation(activeConv.id);
      router.push("/app");
    }
  };

  const filteredMessages = activeConv?.messages.filter((m) =>
    searchQuery
      ? m.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  ) || [];

  return (
    <div className="flex-1 flex flex-col xl:flex-row min-w-0 w-full min-h-screen md:h-screen overflow-x-hidden">
      {/* Center Chat Main Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full h-full p-3 md:p-6 pb-2 overflow-x-hidden overflow-y-auto">
        {/* Top Chat Header */}
        <div className="flex items-center justify-between pb-3 px-2 border-b border-white/60">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push("/app")}
              className="p-2 rounded-2xl bg-white/80 hover:bg-white border border-white/80 shadow-sm text-[#1E1B4B] transition-all hover:scale-105 active:scale-95"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5 text-[#1E1B4B]" />
            </button>

            {isRenaming ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
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
              <h2 className="text-base md:text-lg font-bold text-[#1E1B4B] truncate max-w-sm">
                {activeConv?.title || "New Chat"}
              </h2>
            )}
          </div>

          {/* Action Icons & Status */}
          <div className="flex items-center gap-2">
            {/* Search in chat */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-xl text-[#7C7F96] hover:bg-white hover:text-[#1E1B4B] transition-colors"
              title="Search in conversation"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Copy conversation */}
            <button
              onClick={handleCopyChat}
              className="p-2 rounded-xl text-[#7C7F96] hover:bg-white hover:text-[#1E1B4B] transition-colors"
              title="Copy conversation"
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* More Options Menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-xl text-[#7C7F96] hover:bg-white hover:text-[#1E1B4B] transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white/95 backdrop-blur-xl rounded-2xl p-1.5 shadow-xl border border-[#EDE9FE] z-40 flex flex-col gap-1">
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
                      handleCopyChat();
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-[#1E1B4B] hover:bg-[#F3F0FF] text-left"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#6C5CE7]" />
                    <span>Share / Export</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleDelete();
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Chat</span>
                  </button>
                </div>
              )}
            </div>

            {/* Page Header Status & Theme */}
            <PageHeader />
          </div>
        </div>

        {/* Search Input Bar (if toggled) */}
        {showSearch && (
          <div className="py-2">
            <input
              type="text"
              placeholder="Search messages in this chat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-white/80 border border-[#EDE9FE] text-xs text-[#1E1B4B] placeholder-[#94A3B8] outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              autoFocus
            />
          </div>
        )}

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-6">
          {filteredMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onSelectPrompt={handleSelectPrompt}
              onRegenerate={handleRegenerate}
            />
          ))}

          {/* Thinking / Searching Streaming State Animation */}
          {(mascotState === "thinking" || mascotState === "searching") && (
            <div className="flex items-center gap-3 p-4 rounded-3xl bg-white/80 backdrop-blur-md border border-[#EDE9FE] max-w-sm">
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 animate-bounce">
                <Image
                  src="/images/mascot/nimii-avatar.png"
                  alt="Nimii avatar"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#6C5CE7]">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>
                  {mascotState === "searching"
                    ? "Searching the web for verified sources..."
                    : "Formulating thoughtful response..."}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Area: Peeking Mascot + Persistent Composer */}
        <div className="relative pt-2">
          {/* Peeking Kitten artwork right above composer */}
          <div className="absolute -top-12 right-12 z-20 w-28 h-16 select-none pointer-events-none animate-soft-bounce">
            <Image
              src="/images/mascot/kitten-chat-peek.png"
              alt="Peeking kitten"
              fill
              className="object-contain"
            />
          </div>

          <ChatComposer
            conversationId={activeConv?.id}
            placeholder="Ask Nimii anything..."
          />
        </div>
      </div>

      {/* Persistent Right Context Panel */}
      <RightContextPanel />
    </div>
  );
}
