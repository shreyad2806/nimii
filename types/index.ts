export interface MemoryItem {
  id: string;
  title: string;
  summary: string;
  details?: string;
  date: string;
  time: string;
  category: "Research" | "AI" | "Development" | "Study" | "Design" | "General";
  type: "timeline" | "topics" | "saved-facts" | "decisions" | "sources";
  tags: string[];
  conversationId?: string;
  keyPoints?: string[];
  relatedMemories?: { id: string; title: string; date: string }[];
}

export interface OpenLoopItem {
  id: string;
  title: string;
  description: string;
  category: "Project" | "GitHub" | "Hackathon" | "Study" | "Personal" | "Work";
  timeframe: "today" | "this-week" | "later";
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface Citation {
  id: string;
  title: string;
  domain: string;
  url: string;
  snippet?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  highlights?: string[];
  numberedPoints?: string[];
  citations?: Citation[];
  followUps?: string[];
  isWebSearch?: boolean;
  isRemembered?: boolean;
  liked?: boolean | null;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  date: string;
  timestamp: string;
  messageCount: number;
  tags: string[];
  messages: ChatMessage[];
}

export interface UserSettings {
  language: string;
  timezone: string;
  enableWebSearch: boolean;
  showCitations: boolean;
  theme: "dreamy" | "light" | "dark";
  chatDensity: "compact" | "balanced" | "spacious";
  animations: boolean;
  saveImportantInfo: boolean;
  memoryRetention: "Forever" | "30 Days" | "90 Days";
}

export interface UserProfile {
  name: string;
  email: string;
  avatarInitial: string;
  isGuest: boolean;
  status: "Online" | "Away" | "Offline";
  joinedDate: string;
}
