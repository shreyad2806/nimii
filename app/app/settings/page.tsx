"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Settings,
  Brain,
  Shield,
  Palette,
  User,
  Globe,
  Clock,
  Sparkles,
  Download,
  Trash2,
  ExternalLink,
  HelpCircle,
  FileText,
  Check,
  ArrowRight,
  Database,
} from "lucide-react";
import { useApp } from "@/lib/context/AppContext";
import { PageHeader } from "@/components/layout/PageHeader";

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings, memories, conversations, resetToDefaults } = useApp();
  const [activeTab, setActiveTab] = useState<
    "general" | "memory" | "privacy" | "appearance" | "account"
  >("general");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "memory", label: "Memory", icon: Brain },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "account", label: "Account", icon: User },
  ];

  const handleSaveChanges = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportAll = () => {
    const exportBundle = {
      exportDate: new Date().toISOString(),
      settings,
      memories,
      conversations,
    };
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nimii-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleConfirmClear = () => {
    resetToDefaults();
    setShowClearModal(false);
    router.push("/app");
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row min-w-0 px-4 md:px-7 pt-2 md:pt-2.5 pb-6 gap-5">
      {/* Center Main Settings Area */}
      <div className="flex-1 flex flex-col min-w-0 space-y-3 md:space-y-3.5">
        {/* Top Header */}
        <PageHeader
          showBack
          backHref="/app"
          title="Settings"
          subtitle="Customize Nimii to work just the way you like!"
        />

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 overflow-x-auto w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#6C5CE7] text-white shadow-sm"
                    : "text-[#4B4E6D] hover:bg-white hover:text-[#1E1B4B]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. General Preferences */}
          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-glass flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <Settings className="w-5 h-5 text-[#6C5CE7]" />
                <h3 className="font-bold text-[#1E1B4B] text-base">
                  General Preferences
                </h3>
              </div>
              <p className="text-xs text-[#7C7F96]">
                Manage your core preferences
              </p>
            </div>

            <div className="space-y-4">
              {/* Language */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1E1B4B]">
                  <Globe className="w-4 h-4 text-[#7C7F96]" />
                  <span>Language</span>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value })}
                  className="px-3 py-1.5 rounded-xl bg-[#F8F6FC] border border-[#DDD6FE] text-xs font-bold text-[#1E1B4B] outline-none"
                >
                  <option value="English">🇺🇸 English</option>
                  <option value="Spanish">🇪🇸 Spanish</option>
                  <option value="French">🇫🇷 French</option>
                  <option value="Japanese">🇯🇵 Japanese</option>
                </select>
              </div>

              {/* Timezone */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1E1B4B]">
                  <Clock className="w-4 h-4 text-[#7C7F96]" />
                  <span>Timezone</span>
                </div>
                <select
                  value={settings.timezone}
                  onChange={(e) => updateSettings({ timezone: e.target.value })}
                  className="px-3 py-1.5 rounded-xl bg-[#F8F6FC] border border-[#DDD6FE] text-xs font-bold text-[#1E1B4B] outline-none"
                >
                  <option value="(UTC +05:30) India">(UTC +05:30) India</option>
                  <option value="(UTC -08:00) Pacific">(UTC -08:00) Pacific</option>
                  <option value="(UTC +00:00) London">(UTC +00:00) London</option>
                  <option value="(UTC +09:00) Tokyo">(UTC +09:00) Tokyo</option>
                </select>
              </div>

              {/* Enable Web Search Toggle */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs font-bold text-[#1E1B4B]">Enable Web Search</p>
                  <p className="text-[11px] text-[#7C7F96]">
                    Let Nimii search the web for updated information
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableWebSearch}
                    onChange={(e) => updateSettings({ enableWebSearch: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#E2DEFA] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C5CE7]" />
                </label>
              </div>

              {/* Show Citations Toggle */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-xs font-bold text-[#1E1B4B]">Show Citations</p>
                  <p className="text-[11px] text-[#7C7F96]">
                    See sources for web results
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showCitations}
                    onChange={(e) => updateSettings({ showCitations: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#E2DEFA] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C5CE7]" />
                </label>
              </div>
            </div>
          </div>

          {/* 2. Appearance */}
          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-glass flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <Palette className="w-5 h-5 text-[#6C5CE7]" />
                <h3 className="font-bold text-[#1E1B4B] text-base">Appearance</h3>
              </div>
              <p className="text-xs text-[#7C7F96]">Make it yours</p>
            </div>

            <div className="space-y-4">
              {/* Theme Preview Cards */}
              <div>
                <p className="text-xs font-bold text-[#1E1B4B] mb-2">Theme</p>
                <div className="grid grid-cols-3 gap-2">
                  {/* Dreamy Theme */}
                  <div
                    onClick={() => updateSettings({ theme: "dreamy" })}
                    className={`relative p-2 rounded-2xl border text-center cursor-pointer transition-all ${
                      settings.theme === "dreamy"
                        ? "border-[#6C5CE7] ring-2 ring-[#6C5CE7]/30 bg-purple-50/50"
                        : "border-[#E2DEFA] hover:border-[#6C5CE7]"
                    }`}
                  >
                    <div className="h-12 rounded-xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 mb-1.5 relative overflow-hidden flex items-center justify-center">
                      {settings.theme === "dreamy" && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#6C5CE7] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#1E1B4B]">Dreamy</span>
                  </div>

                  {/* Light Theme */}
                  <div
                    onClick={() => updateSettings({ theme: "light" })}
                    className={`relative p-2 rounded-2xl border text-center cursor-pointer transition-all ${
                      settings.theme === "light"
                        ? "border-[#6C5CE7] ring-2 ring-[#6C5CE7]/30 bg-purple-50/50"
                        : "border-[#E2DEFA] hover:border-[#6C5CE7]"
                    }`}
                  >
                    <div className="h-12 rounded-xl bg-gradient-to-br from-white to-[#F5F2FC] mb-1.5 relative overflow-hidden flex items-center justify-center">
                      {settings.theme === "light" && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#6C5CE7] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#1E1B4B]">Light</span>
                  </div>

                  {/* Dark Theme */}
                  <div
                    onClick={() => updateSettings({ theme: "dark" })}
                    className={`relative p-2 rounded-2xl border text-center cursor-pointer transition-all ${
                      settings.theme === "dark"
                        ? "border-[#6C5CE7] ring-2 ring-[#6C5CE7]/30 bg-purple-50/50"
                        : "border-[#E2DEFA] hover:border-[#6C5CE7]"
                    }`}
                  >
                    <div className="h-12 rounded-xl bg-gradient-to-br from-[#12132D] to-[#1E1B4B] mb-1.5 relative overflow-hidden flex items-center justify-center">
                      {settings.theme === "dark" && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#1E1B4B]">Dark</span>
                  </div>
                </div>
              </div>

              {/* Chat Density */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-[#1E1B4B]">Chat Density</span>
                <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F8F6FC]">
                  {(["compact", "balanced", "spacious"] as const).map((density) => (
                    <button
                      key={density}
                      onClick={() => updateSettings({ chatDensity: density })}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                        settings.chatDensity === density
                          ? "bg-white text-[#6C5CE7] shadow-sm font-bold"
                          : "text-[#7C7F96] hover:text-[#1E1B4B]"
                      }`}
                    >
                      {density}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animations Toggle */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-xs font-bold text-[#1E1B4B]">Animations</p>
                  <p className="text-[11px] text-[#7C7F96]">
                    Enable cute cat animations
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.animations}
                    onChange={(e) => updateSettings({ animations: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#E2DEFA] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C5CE7]" />
                </label>
              </div>
            </div>
          </div>

          {/* 3. Memory Controls */}
          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-glass flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <Database className="w-5 h-5 text-[#6C5CE7]" />
                <h3 className="font-bold text-[#1E1B4B] text-base">
                  Memory Controls
                </h3>
              </div>
              <p className="text-xs text-[#7C7F96]">Control what Nimii remembers</p>
            </div>

            <div className="space-y-4">
              {/* Save Important Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#1E1B4B]">Save Important Info</p>
                  <p className="text-[11px] text-[#7C7F96]">
                    Remember key facts, preferences and decisions
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.saveImportantInfo}
                    onChange={(e) =>
                      updateSettings({ saveImportantInfo: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#E2DEFA] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C5CE7]" />
                </label>
              </div>

              {/* Retention */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#1E1B4B]">Memory Retention</p>
                  <p className="text-[11px] text-[#7C7F96]">Keep memories for</p>
                </div>
                <select
                  value={settings.memoryRetention}
                  onChange={(e) =>
                    updateSettings({ memoryRetention: e.target.value as any })
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#F8F6FC] border border-[#DDD6FE] text-xs font-bold text-[#1E1B4B] outline-none"
                >
                  <option value="Forever">Forever</option>
                  <option value="90 Days">90 Days</option>
                  <option value="30 Days">30 Days</option>
                </select>
              </div>

              {/* Manage Memories */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs font-bold text-[#1E1B4B]">Manage Memories</p>
                  <p className="text-[11px] text-[#7C7F96]">
                    View, edit or delete saved memories
                  </p>
                </div>
                <button
                  onClick={() => router.push("/app/memory")}
                  className="px-3.5 py-1.5 rounded-xl bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#6C5CE7] text-xs font-bold transition-all"
                >
                  Manage →
                </button>
              </div>
            </div>
          </div>

          {/* 4. Privacy & Data */}
          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-glass flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <Shield className="w-5 h-5 text-[#6C5CE7]" />
                <h3 className="font-bold text-[#1E1B4B] text-base">Privacy & Data</h3>
              </div>
              <p className="text-xs text-[#7C7F96]">Your data, your control</p>
            </div>

            <div className="space-y-4">
              {/* Export My Data */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#1E1B4B]">Export My Data</p>
                  <p className="text-[11px] text-[#7C7F96]">
                    Download your conversations and memories
                  </p>
                </div>
                <button
                  onClick={handleExportAll}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#6C5CE7] text-xs font-bold transition-all"
                >
                  <span>Export</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Clear All Data */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs font-bold text-[#1E1B4B]">Clear All Data</p>
                  <p className="text-[11px] text-[#7C7F96]">
                    Permanently delete your data
                  </p>
                </div>
                <button
                  onClick={() => setShowClearModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 transition-all"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tip & Sticky Save Changes Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 border border-white/80 shadow-glass flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#4B4E6D]">
            <Sparkles className="w-4 h-4 text-[#6C5CE7] flex-shrink-0" />
            <span>
              <strong>Tip:</strong> You can manage memory settings to control what Nimii remembers about you.
            </span>
          </div>

          <button
            onClick={handleSaveChanges}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#6C5CE7] hover:bg-[#5B46D9] active:bg-[#4E38C4] text-white text-xs font-bold shadow-md shadow-[#6C5CE7]/30 transition-all transform active:scale-95"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <span>Save Changes</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Mascot Privacy Card & Quick Links */}
      <div className="w-full xl:w-80 flex-shrink-0 space-y-4">
        {/* Mascot Laptop Privacy Card */}
        <div className="bg-gradient-to-br from-white/90 to-[#FAF7FF]/90 backdrop-blur-md rounded-3xl p-6 border border-white/80 text-center shadow-glass relative overflow-hidden group">
          <div className="relative w-[clamp(130px,14vw,170px)] h-[clamp(90px,10vw,120px)] mx-auto mb-2 select-none pointer-events-none animate-soft-bounce">
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/10 blur-sm rounded-full pointer-events-none"
              aria-hidden="true"
            />
            <Image
              src="/images/mascot/nimii-3d-laptop.png"
              alt="Nimii 3D kitten beside laptop"
              fill
              className="object-contain relative z-10 drop-shadow-sm"
              priority
            />
          </div>
          <h4 className="font-bold text-[#1E1B4B] text-sm">
            Your privacy matters!
          </h4>
          <p className="text-xs text-[#7C7F96] mt-1 leading-relaxed">
            Nimii is designed with your control and security in mind. ♡
          </p>
        </div>

        {/* Quick Links Card */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-white/80 shadow-glass space-y-3">
          <h4 className="text-xs font-bold text-[#1E1B4B] flex items-center gap-2">
            <span>Quick Links</span>
          </h4>

          <div className="space-y-1.5">
            <a
              href="https://support.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-[#4B4E6D] hover:text-[#6C5CE7] hover:bg-[#F3F0FF] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-[#7C7F96]" />
                <span>Help Center</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Privacy Policy: Your data stays locally on your device in this version.");
              }}
              className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-[#4B4E6D] hover:text-[#6C5CE7] hover:bg-[#F3F0FF] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#7C7F96]" />
                <span>Privacy Policy</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Terms of Service: Nimii is your friendly AI companion.");
              }}
              className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-[#4B4E6D] hover:text-[#6C5CE7] hover:bg-[#F3F0FF] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#7C7F96]" />
                <span>Terms of Service</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Clear Data */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 border border-white shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#1E1B4B]">
              Reset all memories and settings?
            </h3>
            <p className="text-xs text-[#7C7F96] leading-relaxed">
              This will restore all default mock conversations, open loops, and memories. Your local changes will be cleared.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7C7F96] hover:bg-[#F3F0FF]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
