"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Calendar,
  CheckCircle2,
  Brain,
  MessageSquare,
  Edit2,
  Check,
  ArrowRight,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/context/AppContext";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, memories, loops, conversations, logout, loginAsGuest } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saved, setSaved] = useState(false);

  const completedLoops = loops.filter((l) => l.completed).length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      avatarInitial: (name.trim() || user.name)[0].toUpperCase(),
    });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col px-4 md:px-7 pt-2 md:pt-2.5 pb-6 space-y-3.5 max-w-4xl mx-auto w-full">
      <PageHeader
        showBack
        backHref="/app"
        title="User Profile"
        subtitle="Manage your personal details and assistant activity"
      />

      {/* Main Profile Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/80 shadow-glass space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-[#F1EFF8]">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-[#4A72FF] text-white flex items-center justify-center font-black text-2xl shadow-md border-4 border-white">
              {user.avatarInitial}
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl md:text-2xl font-black text-[#1E1B4B]">
                  {user.name}
                </h2>
                {user.isGuest ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Guest Demo
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE9FE] text-[#6C5CE7]">
                    Pro Member
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7C7F96] mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{user.email}</span>
              </p>
              <p className="text-[11px] text-[#A5A6C2] mt-1 flex items-center justify-center sm:justify-start gap-1">
                <Calendar className="w-3 h-3" />
                <span>Member since {user.joinedDate}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#EDE9FE] hover:bg-[#DDD6FE] text-xs font-bold text-[#6C5CE7] transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="space-y-4 p-4 rounded-2xl bg-[#F8F6FC] border border-[#DDD6FE]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DDD6FE] text-xs font-semibold text-[#1E1B4B] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DDD6FE] text-xs font-semibold text-[#1E1B4B] outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#6C5CE7] text-white text-xs font-bold shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}

        {saved && (
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-bold text-center">
            Profile updated successfully!
          </div>
        )}

        {/* Lifetime Activity Stats */}
        <div>
          <h3 className="text-sm font-bold text-[#1E1B4B] mb-3">
            Lifetime Assistant Activity
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-[#F8F6FC] border border-white">
              <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#6C5CE7] flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-[#1E1B4B]">{conversations.length}</p>
              <p className="text-xs text-[#7C7F96] mt-0.5">Conversations</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F6FC] border border-white">
              <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-amber-600 flex items-center justify-center mx-auto mb-2">
                <Brain className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-[#1E1B4B]">{memories.length}</p>
              <p className="text-xs text-[#7C7F96] mt-0.5">Memories Saved</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F6FC] border border-white">
              <div className="w-8 h-8 rounded-xl bg-[#D1FAE5] text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-[#1E1B4B]">{completedLoops}</p>
              <p className="text-xs text-[#7C7F96] mt-0.5">Loops Closed</p>
            </div>
          </div>
        </div>

        {/* 3D AI Companion Bond Showcase Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#FAF7FF] to-[#EDE9FE]/60 border border-[#DDD6FE] flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden group">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 animate-soft-bounce">
              <Image
                src="/images/mascot/nimii-3d-celebrating.png?v=3d"
                alt="Nimii 3D companion mascot"
                fill
                className="object-contain drop-shadow-md"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6C5CE7] text-white text-[10px] font-bold tracking-wide uppercase shadow-sm">
                <Sparkles className="w-3 h-3" />
                <span>Companion Bond: Level 5</span>
              </div>
              <h3 className="text-base font-black text-[#1E1B4B] mt-1.5">
                Nimii loves assisting you!
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5 max-w-sm">
                Your conversational memory and tasks are actively synced. Nimii is always ready by your side. ♡
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert("Nimii purrs softly! ♡ 'Thank you for being the best human companion!'");
              }}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#F3F0FF] border border-[#C4B5FD] shadow-sm text-xs font-bold text-[#6C5CE7] transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <span>Pet Nimii</span>
              <span>🐾</span>
            </button>
          </div>
        </div>

        {/* Mode Switch & Sign out */}
        <div className="pt-4 border-t border-[#F1EFF8] flex items-center justify-between flex-wrap gap-3">
          <div>
            {user.isGuest ? (
              <button
                onClick={() => router.push("/login")}
                className="flex items-center gap-2 text-xs font-bold text-[#6C5CE7] hover:underline"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sign in with Google / Email</span>
              </button>
            ) : (
              <button
                onClick={loginAsGuest}
                className="flex items-center gap-2 text-xs font-bold text-[#7C7F96] hover:text-[#1E1B4B]"
              >
                <User className="w-4 h-4" />
                <span>Switch to Guest Demo Mode</span>
              </button>
            )}
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
