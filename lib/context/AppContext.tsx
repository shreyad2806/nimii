"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type {
  ChatMessage,
  Conversation,
  MemoryItem,
  OpenLoopItem,
  UserProfile,
  UserSettings,
} from "@/types";
import {
  INITIAL_USER,
  INITIAL_SETTINGS,
  INITIAL_MEMORIES,
  INITIAL_OPEN_LOOPS,
  INITIAL_CONVERSATIONS,
} from "@/lib/data/mockData";
import { authService } from "@/lib/services/auth";
import { createClient } from "@/lib/supabase/client";

async function getAuthenticatedProfile() {
  const result = await authService.getProfile();
  if (result.error) {
    console.warn("Could not load profile from Supabase:", result.error);
    return null;
  }

  return result.data;
}

interface AppContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  loginAsGuest: () => Promise<void> | void;
  logout: () => Promise<void> | void;

  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;

  memories: MemoryItem[];
  addMemory: (memory: Omit<MemoryItem, "id">) => void;
  deleteMemory: (id: string) => void;
  selectedMemory: MemoryItem | null;
  setSelectedMemory: (mem: MemoryItem | null) => void;

  loops: OpenLoopItem[];
  addLoop: (loop: Omit<OpenLoopItem, "id" | "completed" | "createdAt">) => void;
  toggleLoop: (id: string) => void;
  deleteLoop: (id: string) => void;
  updateLoop: (id: string, updates: Partial<OpenLoopItem>) => void;

  conversations: Conversation[];
  currentConversationId: string;
  setCurrentConversationId: (id: string) => void;
  activeConversation: Conversation | undefined;
  sendMessage: (
    content: string,
    options?: { isWebSearch?: boolean; isRemembered?: boolean; conversationId?: string }
  ) => Promise<string>;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, newTitle: string) => void;

  searchWebEnabled: boolean;
  setSearchWebEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
  rememberThisEnabled: boolean;
  setRememberThisEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;

  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (val: boolean) => void;
  isRightPanelOpen: boolean;
  setIsRightPanelOpen: (val: boolean) => void;

  mascotState: "idle" | "thinking" | "searching" | "remembering" | "celebrating" | "sleeping";
  setMascotState: (state: "idle" | "thinking" | "searching" | "remembering" | "celebrating" | "sleeping") => void;

  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [settings, setSettings] = useState<UserSettings>(INITIAL_SETTINGS);
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(INITIAL_MEMORIES[0]);
  const [loops, setLoops] = useState<OpenLoopItem[]>(INITIAL_OPEN_LOOPS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [currentConversationId, setCurrentConversationId] = useState<string>("conv-1");

  const [searchWebEnabled, setSearchWebEnabled] = useState<boolean>(true);
  const [rememberThisEnabled, setRememberThisEnabled] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);
  const [mascotState, setMascotState] = useState<
    "idle" | "thinking" | "searching" | "remembering" | "celebrating" | "sleeping"
  >("idle");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("nimii_user");
      if (storedUser) setUser(JSON.parse(storedUser));

      const storedSettings = localStorage.getItem("nimii_settings");
      if (storedSettings) setSettings(JSON.parse(storedSettings));

      const storedMemories = localStorage.getItem("nimii_memories");
      if (storedMemories) setMemories(JSON.parse(storedMemories));

      const storedLoops = localStorage.getItem("nimii_loops");
      if (storedLoops) setLoops(JSON.parse(storedLoops));

      const storedConvs = localStorage.getItem("nimii_conversations");
      if (storedConvs) setConversations(JSON.parse(storedConvs));
    } catch {
      // LocalStorage not available or parse error
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("nimii_user", JSON.stringify(user));
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem("nimii_settings", JSON.stringify(settings));
      // Apply theme class
      const root = document.documentElement;
      root.classList.remove("dark", "theme-light");
      if (settings.theme === "dark") {
        root.classList.add("dark");
      } else if (settings.theme === "light") {
        root.classList.add("theme-light");
      }
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem("nimii_memories", JSON.stringify(memories));
    } catch {}
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem("nimii_loops", JSON.stringify(loops));
    } catch {}
  }, [loops]);

  useEffect(() => {
    try {
      localStorage.setItem("nimii_conversations", JSON.stringify(conversations));
    } catch {}
  }, [conversations]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  // Sync with Supabase Auth state
  useEffect(() => {
    if (!authService.isConfigured()) return;

    let isMounted = true;
    const supabase = createClient();

    const syncUser = async () => {
      try {
        const { data: { user: sbUser } } = await supabase.auth.getUser();
        if (sbUser && isMounted) {
          const profile = await getAuthenticatedProfile();
          const displayName =
            profile?.display_name ||
            sbUser.user_metadata?.full_name ||
            sbUser.user_metadata?.display_name ||
            sbUser.email?.split("@")[0] ||
            (sbUser.is_anonymous ? "Guest Explorer" : "Explorer");

          const userEmail = sbUser.email || (sbUser.is_anonymous ? "guest@nimii.ai" : "");
          const avatarInitial = displayName.charAt(0).toUpperCase() || "E";
          const isGuest = Boolean(sbUser.is_anonymous);
          const joinedDate = sbUser.created_at
            ? new Date(sbUser.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
            : "Today";

          setUser((prev) => ({
            ...prev,
            id: sbUser.id,
            name: displayName,
            email: userEmail,
            avatarInitial,
            isGuest,
            status: "Online",
            joinedDate,
          }));
        }
      } catch (err) {
        console.warn("Could not sync user from Supabase session:", err);
      }
    };

    syncUser();

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        if (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") {
          if (session?.user) {
            const sbUser = session.user;
            const profile = await getAuthenticatedProfile();
            const displayName =
              profile?.display_name ||
              sbUser.user_metadata?.full_name ||
              sbUser.user_metadata?.display_name ||
              sbUser.email?.split("@")[0] ||
              (sbUser.is_anonymous ? "Guest Explorer" : "Explorer");

            const userEmail = sbUser.email || (sbUser.is_anonymous ? "guest@nimii.ai" : "");
            const avatarInitial = displayName.charAt(0).toUpperCase() || "E";
            const isGuest = Boolean(sbUser.is_anonymous);
            const joinedDate = sbUser.created_at
              ? new Date(sbUser.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
              : "Today";

            setUser((prev) => ({
              ...prev,
              id: sbUser.id,
              name: displayName,
              email: userEmail,
              avatarInitial,
              isGuest,
              status: "Online",
              joinedDate,
            }));
          }
        } else if (event === "SIGNED_OUT") {
          setUser({
            ...INITIAL_USER,
            isGuest: false,
          });
          try {
            localStorage.removeItem("nimii_user");
          } catch {}
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loginAsGuest = async () => {
    if (authService.isConfigured()) {
      const res = await authService.signInAsGuest();
      if (res.user) {
        setUser({
          id: res.user.id,
          name: "Guest Explorer",
          email: "guest@nimii.ai",
          avatarInitial: "G",
          isGuest: true,
          status: "Online",
          joinedDate: "Today",
        });
        return;
      }
    }
    // Fallback if Supabase is offline or unconfigured
    setUser({
      name: "Guest Explorer",
      email: "guest@nimii.ai",
      avatarInitial: "G",
      isGuest: true,
      status: "Online",
      joinedDate: "Today",
    });
  };

  const logout = async () => {
    if (authService.isConfigured()) {
      await authService.signOut();
    }
    setUser({
      ...INITIAL_USER,
      isGuest: false,
    });
    try {
      localStorage.removeItem("nimii_user");
    } catch {}
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const addMemory = (mem: Omit<MemoryItem, "id">) => {
    const newId = `mem-${Date.now()}`;
    const newMemory: MemoryItem = {
      ...mem,
      id: newId,
    };
    setMemories((prev) => [newMemory, ...prev]);
    setSelectedMemory(newMemory);
    setMascotState("remembering");
    setTimeout(() => setMascotState("idle"), 2500);
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (selectedMemory?.id === id) {
      setSelectedMemory(null);
    }
  };

  const addLoop = (loop: Omit<OpenLoopItem, "id" | "completed" | "createdAt">) => {
    const newLoop: OpenLoopItem = {
      ...loop,
      id: `loop-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setLoops((prev) => [newLoop, ...prev]);
  };

  const toggleLoop = (id: string) => {
    setLoops((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const nextCompleted = !l.completed;
          return {
            ...l,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return l;
      })
    );
  };

  const deleteLoop = (id: string) => {
    setLoops((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLoop = (id: string, updates: Partial<OpenLoopItem>) => {
    setLoops((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const activeConversation = conversations.find((c) => c.id === currentConversationId);

  const sendMessage = async (
    content: string,
    options?: { isWebSearch?: boolean; isRemembered?: boolean; conversationId?: string }
  ): Promise<string> => {
    const targetConvId = options?.conversationId || currentConversationId;
    const isSearch = options?.isWebSearch !== undefined ? options.isWebSearch : searchWebEnabled;
    const isRemember = options?.isRemembered !== undefined ? options.isRemembered : rememberThisEnabled;

    setMascotState(isSearch ? "searching" : "thinking");

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      isWebSearch: isSearch,
      isRemembered: isRemember,
    };

    let targetConv = conversations.find((c) => c.id === targetConvId);
    let effectiveConvId = targetConvId;

    if (!targetConv) {
      // Create new conversation
      effectiveConvId = `conv-${Date.now()}`;
      targetConv = {
        id: effectiveConvId,
        title: content.slice(0, 36) + (content.length > 36 ? "..." : ""),
        preview: content,
        date: "Today",
        timestamp: userMessage.timestamp,
        messageCount: 2,
        tags: isSearch ? ["Web Search", "General"] : ["General"],
        messages: [userMessage],
      };
      setConversations((prev) => [targetConv!, ...prev]);
      setCurrentConversationId(effectiveConvId);
    } else {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === effectiveConvId
            ? {
                ...c,
                preview: content,
                timestamp: userMessage.timestamp,
                messageCount: c.messages.length + 1,
                messages: [...c.messages, userMessage],
              }
            : c
        )
      );
    }

    // If "Remember this" is enabled, automatically create a memory
    if (isRemember) {
      addMemory({
        title: content.slice(0, 40),
        summary: `Saved key insight: "${content}"`,
        details: content,
        date: "Today • " + new Date().toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }),
        time: userMessage.timestamp,
        category: "General",
        type: "saved-facts",
        tags: ["Saved Note", "Assistant"],
        conversationId: effectiveConvId,
      });
    }

    // Simulate intelligent assistant response
    await new Promise((r) => setTimeout(r, 900));

    const assistantMsg: ChatMessage = {
      id: `msg-ai-${Date.now()}`,
      sender: "assistant",
      content: `I've ${isSearch ? "searched the live web and " : ""}analyzed your inquiry about "${content}":`,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      highlights: [
        `Key insight: Tailored analysis based on your query "${content.slice(0, 30)}..."`,
        isSearch
          ? "Live Web Data: Verified sources with authoritative real-time context."
          : "Persistent Memory: Cross-referenced with your previous notes and preferences.",
        "Actionable next step: You can turn this directly into an Open Loop task below.",
      ],
      citations: isSearch
        ? [
            {
              id: `cit-${Date.now()}-1`,
              title: "Verified Documentation & Standards",
              domain: "developer.mozilla.org",
              url: "https://developer.mozilla.org",
            },
            {
              id: `cit-${Date.now()}-2`,
              title: "Official Industry Insights",
              domain: "techcrunch.com",
              url: "https://techcrunch.com",
            },
          ]
        : undefined,
      followUps: [
        `Can you elaborate more on this topic?`,
        `Add this action item to my Open Loops`,
        `Save this summary to my Memory Timeline`,
      ],
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === effectiveConvId
          ? {
              ...c,
              messageCount: c.messages.length + 1,
              messages: [...c.messages, assistantMsg],
            }
          : c
      )
    );

    setMascotState("celebrating");
    setTimeout(() => setMascotState("idle"), 1500);

    return effectiveConvId;
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      if (remaining.length > 0) {
        setCurrentConversationId(remaining[0].id);
      }
    }
  };

  const renameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  const resetToDefaults = () => {
    setUser(INITIAL_USER);
    setSettings(INITIAL_SETTINGS);
    setMemories(INITIAL_MEMORIES);
    setSelectedMemory(INITIAL_MEMORIES[0]);
    setLoops(INITIAL_OPEN_LOOPS);
    setConversations(INITIAL_CONVERSATIONS);
    setCurrentConversationId("conv-1");
    try {
      localStorage.clear();
    } catch {}
  };

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        loginAsGuest,
        logout,
        settings,
        updateSettings,
        memories,
        addMemory,
        deleteMemory,
        selectedMemory,
        setSelectedMemory,
        loops,
        addLoop,
        toggleLoop,
        deleteLoop,
        updateLoop,
        conversations,
        currentConversationId,
        setCurrentConversationId,
        activeConversation,
        sendMessage,
        deleteConversation,
        renameConversation,
        searchWebEnabled,
        setSearchWebEnabled,
        rememberThisEnabled,
        setRememberThisEnabled,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        isRightPanelOpen,
        setIsRightPanelOpen,
        mascotState,
        setMascotState,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
