"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sparkles, Globe, Brain, CheckCircle2, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/context/AppContext";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser, settings, updateSettings } = useApp();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user.name);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Research & Learning",
    "Open Loops & Productivity",
  ]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleFinish = () => {
    updateUser({ name });
    router.push("/app");
  };

  return (
    <div className="min-h-screen w-full relative bg-[#F6F4FC] scenic-background flex items-center justify-center p-4 md:p-8">
      <div className="fixed inset-0 pointer-events-none scenic-background-overlay opacity-50 z-0" />

      <div className="relative z-10 w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-4xl p-8 md:p-10 border border-white shadow-2xl flex flex-col gap-6">
        {/* Progress bar */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s <= step ? "bg-[#6C5CE7]" : "bg-[#EDE9FE]"
              }`}
            />
          ))}
        </div>

        {/* Mascot Banner */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-28 h-24 mb-2 animate-soft-bounce">
            <Image
              src={
                step === 1
                  ? "/images/mascot/nimii-3d-yarn.png"
                  : step === 2
                  ? "/images/mascot/nimii-3d-laptop.png"
                  : "/images/mascot/nimii-3d-celebrating.png"
              }
              alt="Nimii onboarding mascot"
              fill
              className="object-contain"
            />
          </div>

          <h2 className="text-2xl font-black text-[#1E1B4B]">
            {step === 1 && "Welcome to Nimii! What's your name?"}
            {step === 2 && "Tailor Nimii's Superpowers"}
            {step === 3 && "You're All Set!"}
          </h2>
          <p className="text-xs md:text-sm text-[#7C7F96] mt-1">
            {step === 1 && "Nimii loves remembering who they are talking to."}
            {step === 2 && "Customize how Nimii searches and retains context."}
            {step === 3 && "Let's explore your personal sanctuary for thoughts and tasks."}
          </p>
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                Your preferred name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Shreya"
                className="w-full px-4 py-3 rounded-2xl bg-[#F8F6FC] border border-[#DDD6FE] text-sm text-[#1E1B4B] font-semibold outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              />
            </div>
            <button
              onClick={() => {
                if (name.trim()) updateUser({ name: name.trim() });
                setStep(2);
              }}
              className="w-full py-3.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5B46D9] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Step 2: Superpowers */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2.5">
              <div
                onClick={() => updateSettings({ enableWebSearch: !settings.enableWebSearch })}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8F6FC] border border-[#EDE9FE] cursor-pointer hover:border-[#6C5CE7] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#6C5CE7] flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E1B4B]">Live Web Search</p>
                    <p className="text-[11px] text-[#7C7F96]">Fetch real-time documentation and citations</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableWebSearch}
                  readOnly
                  className="w-4 h-4 accent-[#6C5CE7]"
                />
              </div>

              <div
                onClick={() => updateSettings({ saveImportantInfo: !settings.saveImportantInfo })}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8F6FC] border border-[#EDE9FE] cursor-pointer hover:border-[#6C5CE7] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-amber-600 flex items-center justify-center">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E1B4B]">Persistent Memory</p>
                    <p className="text-[11px] text-[#7C7F96]">Automatically retain preferences & decisions</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.saveImportantInfo}
                  readOnly
                  className="w-4 h-4 accent-[#6C5CE7]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-2xl text-xs font-bold text-[#7C7F96] hover:bg-[#F3F0FF]"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5B46D9] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Finish */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#F5F2FC] border border-[#EDE9FE] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6C5CE7]">
                <Sparkles className="w-4 h-4" />
                <span>Ready to start pair-programming & remembering</span>
              </div>
              <p className="text-xs text-[#4B4E6D]">
                Nimii is configured for <strong>{user.name}</strong> with real-time web search and memory intelligence enabled.
              </p>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-4 rounded-2xl bg-[#6C5CE7] hover:bg-[#5B46D9] text-white font-bold text-sm shadow-lg shadow-[#6C5CE7]/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Enter Nimii Studio</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
