# 🐾 Nimii — Premium Personal AI Assistant

> **Your AI companion, always by your side.**  
> Search the web. Remember what matters. Turn ideas into action with Open Loops.

---

## 🌟 Overview

**Nimii** is a cozy, thoughtful, anime-inspired personal AI assistant built with Next.js 15 App Router, TypeScript, Tailwind CSS, Framer Motion, and Lucide icons. Designed following the comprehensive visual language in `design.md` and high-fidelity design references, Nimii combines:

1. **Live Web Search**: Real-time information gathering with interactive citation cards, favicons, and verified domain sources.
2. **Persistent Conversational Memory**: Autonomous retention of key decisions, facts, and insights organized into a chronological knowledge timeline.
3. **Open Loops (Task Intelligence)**: Seamless conversion of thoughts and messages into actionable tasks with priority levels, time horizons (*Today*, *This Week*, *Later*), and interactive completion tracking.
4. **Delightful Fluffy Mascot Companion**: An expressive calico kitten accompanying the user across workflows in comforting poses (playing with yarn, sleeping on clouds, holding checklists, typing on a tiny laptop, and celebrating).

---

## 🎨 Visual Identity & Design System

- **Warm Ivory Surface**: Glassmorphic white cards with subtle lavender shadows (`rgba(255, 255, 255, 0.88)` with `backdrop-blur`).
- **Soft Lavender & Purple Primary**: `#6C5CE7` brand purple, `#EDE9FE` soft lavender accents, `#DDD6FE` subtle borders.
- **Deep Navy Typography**: `#1E1B4B` high-contrast headers, `#2D2B55` body text, and `#64748B` slate metadata.
- **Pastel Scenic Horizon**: Dreamy anime-style sky gradient blending soft lavender, blush peach, and distant rolling hills.
- **Cohesive Mascot**: Nimii the kitten rendered across idle, thinking, searching, remembering, celebrating, and sleeping states.

---

## 🚀 Application Routes

| Route | Page Name | Key Features |
|---|---|---|
| `/login` | **Login & Guest Demo** | Google sign-in UI, Email authentication, "Try as Guest" sandbox demo, sleeping cloud mascot, Terms & Privacy. |
| `/onboarding` | **Onboarding Stepper** | Interactive 3-step personalization: name, assistant superpowers (search & memory toggles), and goal alignment. |
| `/app` | **Home Dashboard** | Personalized greeting, animated kitten with yarn ball, large composer with *Search Web* and *Remember This* pills, suggested prompts, Recent Memory card, Open Loops card, Quick Actions, and collapsible right context panel. |
| `/app/chat/[conversationId]` | **Active Chat** | Conversation header, message history, user & assistant bubbles, Key Highlights badges, numbered breakdown, citation cards, action buttons (Helpful, Not helpful, Copy, Regenerate, Save to Memory), follow-up prompt chips, peeking mascot, and persistent composer. |
| `/app/memory` | **Memory Timeline** | Chronological timeline, filter tabs (*Timeline*, *Topics*, *Saved Facts*, *Decisions*, *Sources*), search, date filters, Memory Details side sheet with checklist points and original chat links, and memory insights banner. |
| `/app/loops` | **Open Loops** | Task intelligence board grouped by *Today*, *This Week*, *Later*, and *Completed*. Checkboxes to complete/reopen, priority badges (High, Medium, Low), category badges (Project, GitHub, Hackathon, Study), Loop Stats donut chart, and Add Loop modal. |
| `/app/history` | **Conversation History** | Searchable conversation library grouped by date (*Today*, *Yesterday*, *Older*), topic filtering, sort order, message counts, resume chat button, rename, export JSON, and pagination. |
| `/app/settings` | **Settings Studio** | General preferences (language, timezone, search toggle, citation toggle), Appearance (Dreamy, Light, Dark themes, chat density, animations), Memory retention controls, data export & reset modal, mascot laptop card, and quick links. |
| `/app/profile` | **User Profile** | Profile details, avatar initial, lifetime assistant activity statistics, guest/pro mode switcher, and session controls. |

---

## 🛠️ Project Architecture

```
minimi/
├── app/
│   ├── app/
│   │   ├── chat/[conversationId]/
│   │   │   └── page.tsx           # Active Chat interface
│   │   ├── history/
│   │   │   └── page.tsx           # Conversation archive
│   │   ├── loops/
│   │   │   └── page.tsx           # Open Loops task board
│   │   ├── memory/
│   │   │   └── page.tsx           # Memory timeline & details
│   │   ├── profile/
│   │   │   └── page.tsx           # Profile & lifetime stats
│   │   ├── settings/
│   │   │   └── page.tsx           # Full settings studio
│   │   ├── layout.tsx             # 3-column app shell & navigation
│   │   └── page.tsx               # Home dashboard
│   ├── login/
│   │   └── page.tsx               # Login & Guest demo
│   ├── onboarding/
│   │   └── page.tsx               # Initial user onboarding
│   ├── globals.css                # Custom glassmorphism, themes & animations
│   ├── layout.tsx                 # Root HTML shell & AppProvider
│   └── page.tsx                   # Root redirect to /app
├── components/
│   ├── chat/
│   │   ├── AssistantResponse.tsx  # Rich assistant message cards
│   │   ├── ChatComposer.tsx       # Bottom composer with search & memory pills
│   │   ├── CitationCard.tsx       # Web citation badges
│   │   └── MessageBubble.tsx      # User & assistant chat bubbles
│   ├── home/
│   │   └── SuggestedPrompts.tsx   # Quick suggestion pill chips
│   ├── layout/
│   │   ├── MobileNavigation.tsx   # Mobile bottom navigation bar
│   │   ├── PageHeader.tsx         # Responsive header, status & theme switch
│   │   ├── RightContextPanel.tsx  # Persistent right memory/loops drawer
│   │   └── Sidebar.tsx            # Desktop persistent sidebar
│   ├── loops/
│   │   ├── LoopStatsCard.tsx      # Metrics & SVG priority donut chart
│   │   ├── OpenLoopCard.tsx       # Interactive task item card
│   │   └── TaskModal.tsx          # Create / edit task modal
│   ├── mascot/
│   │   └── NimiiMascot.tsx        # Reusable emotive mascot component
│   ├── memory/
│   │   ├── MemoryCard.tsx         # Knowledge timeline entry card
│   │   └── MemoryDetailsPanel.tsx # Side panel for memory inspection
│   └── common/
│       ├── EmptyState.tsx         # Empty state with mascot
│       ├── ErrorState.tsx         # Error fallback
│       └── LoadingState.tsx       # Loading indicator
├── lib/
│   ├── context/
│   │   └── AppContext.tsx         # Unified state & LocalStorage sync
│   ├── data/
│   │   └── mockData.ts            # Development data layer (swappable with backend)
│   └── utils.ts                   # Tailwind merge & clsx utility
├── public/
│   └── images/
│       ├── backgrounds/           # Scenic dreamy anime landscape
│       ├── design-reference/      # Authoritative design PNGs
│       └── mascot/                # High-res cropped mascot sprites
├── design.md                      # Authoritative design system specifications
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

---

## ✨ Features & Functionality

- **Live Local Persistence**: All user interactions (submitting queries, creating/completing tasks, renaming chats, changing themes, updating preferences) automatically persist to browser `localStorage`.
- **Search Web Mode**: Toggle on/off dynamically in the composer. When enabled, assistant responses cite verifiable documentation and external links.
- **Remember This Mode**: Toggle on/off dynamically. Messages tagged with *Remember This* automatically save into the knowledge timeline.
- **Responsive Across Viewports**:
  - **Desktop (>= 1200px)**: Three-column layout (Sidebar + Main Workspace + Context Panel).
  - **Tablet (768px - 1199px)**: Responsive workspace with collapsible context.
  - **Mobile (< 768px)**: Single-column application with compact header, hamburger slide-over drawer, responsive composer, and bottom navigation bar. Tested without horizontal overflow.
- **Theme Preferences**: Supports **Dreamy** (default pastel aesthetic), **Light** (crisp lavender), and **Dark** (deep navy night sky).
