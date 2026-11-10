# Nimii Design System & Architecture Specification

## 1. Brand Identity & Overview
- **Brand Name**: Nimii
- **Tagline**: Your AI companion, always by your side.
- **Core Value Proposition**: A premium, warm, intelligent personal AI assistant equipped with real-time web search, persistent conversational memory, and actionable Open Loops (task intelligence).
- **Mascot**: Nimii — a fluffy, expressive calico/cream kitten with anime-inspired eyes, soft pink ears, and whimsical sparkles. Nimii accompanies the user across all workflows in different emotive poses (playing with yarn, sleeping on a cloud, holding a checklist, working on a tiny laptop, cheering, and resting).

---

## 2. Color Palette & Design Tokens

### Primary & Accent Colors
- **Primary Brand Purple**: `#6C5CE7` / `#7047EB` (Hover: `#5B46D9`, Active: `#4E38C4`)
- **Purple Light / Soft Lavender**: `#EDE9FE` / `#F3F0FF` / `#E8E5FA`
- **Purple Border / Highlight**: `#DDD6FE` / `#C4B5FD`
- **Deep Navy (Typography & Strong Elements)**: `#1E1B4B` (Heading/Active), `#2D2B55` (Body), `#4B4E6D` (Secondary)
- **Muted Lavender / Slate Text**: `#6B7280` / `#64748B` / `#7C7F96`

### Pastel Landscape & Background Tones
- **Sky Gradient**: Linear gradient from soft pastel blue-lavender (`#DCEBFF` to `#E8E3FA` to `#FDE2EA`)
- **Ivory Glass Card Surface**: `rgba(255, 255, 255, 0.82)` with `backdrop-filter: blur(16px)`
- **Solid White / Card Surface**: `#FFFFFF` with soft border `rgba(230, 228, 245, 0.9)`
- **Peach Accent**: `#FED7AA` / `#FFEDD5` (Soft warm highlights)
- **Emerald Green (Status / Completed)**: `#10B981` / `#D1FAE5`
- **Amber / Orange (Today / Medium Priority)**: `#F59E0B` / `#FEF3C7`
- **Rose / Coral (High Priority / Warning)**: `#EF4444` / `#FEE2E2`

### Shadows & Elevation
- **Card Shadow**: `0 10px 30px -5px rgba(112, 71, 235, 0.07), 0 4px 12px -2px rgba(30, 27, 75, 0.04)`
- **Floating Element Shadow**: `0 14px 34px -4px rgba(112, 71, 235, 0.15), 0 6px 16px -2px rgba(30, 27, 75, 0.06)`
- **Glass Border**: `1px solid rgba(255, 255, 255, 0.8)` with inner subtle lavender contour `1px solid rgba(226, 221, 248, 0.6)`

---

## 3. Typography Hierarchy
- **Font Family**: Plus Jakarta Sans, Outfit, or Inter with fallback to `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`
- **Display Heading**: 28px - 32px, Bold 700 / SemiBold 600, tracking -0.02em, `#1E1B4B`
- **Section Heading**: 20px - 22px, SemiBold 600, `#1E1B4B`
- **Card Title / Subhead**: 15px - 16px, SemiBold 600, `#1E1B4B`
- **Body Text**: 14px, Regular 400 / Medium 500, `#2D2B55` or `#4B4E6D`
- **Caption / Meta**: 12px - 13px, Regular 400 / Medium 500, `#7C7F96`
- **Badge / Pill**: 11px - 12px, Medium 500 / SemiBold 600

---

## 4. Layout Architecture

### Desktop Three-Column Layout (>= 1200px)
1. **Left Persistent Sidebar (`w-64` / 256px)**:
   - Nimii mascot logo + brand title
   - `+ New Chat` prominent CTA pill button
   - Navigation links:
     - Home (`/app`)
     - Memory (`/app/memory`)
     - Open Loops (`/app/loops`) with active count badge `2`
     - History (`/app/history`)
     - Settings (`/app/settings`)
   - Bottom mascot resting widget: "Take a break! Nimii will keep remembering for you ♡"
   - User profile pill with avatar and dropdown menu.
2. **Main Center Workspace (flexible `flex-1` max-w-4xl / max-w-5xl)**:
   - Clean top header (page title or greeting, status pill "Online", theme switch)
   - Dynamic view container matching reference designs
   - Interactive chat composer / timeline / boards
3. **Right Context Panel (`w-80` to `w-88` / 320-352px)**:
   - Top section: "Your Memory" with timeline and "View all →"
   - Middle section: "Your Open Loops" checklist with "View all →"
   - Bottom section: Cheerful celebration card "You're all caught up!" with kitten paws up.

### Tablet (768px - 1199px)
- Sidebar collapses into an icon-rail or slide-over drawer triggered by header hamburger.
- Right context panel folds into a toggleable slide-over drawer.
- Main workspace occupies full width.

### Mobile (< 768px)
- Fixed compact top bar with mascot logo, page title, and status pill.
- Scrollable content area with zero horizontal overflow.
- Mobile bottom navigation bar with icons for Home, Memory, Loops, History, Settings.
- Quick floating drawer / bottom sheet for Memory & Loops context.

---

## 5. Page Specifications

### Page 00 — Login & Guest Demo (`/login`)
- Left side: Whimsical Nimii branding, sleeping kitten on lavender cloud, feature benefit pills ("Search the web", "Remember important details", "Keep track with Open Loops").
- Right side: Clean card with "Welcome to Nimii! Sign in to access your memories, loops and more."
- Google Sign-In button with authentic Google G logo.
- Email Sign-In button with email icon and toggleable password/magic link form.
- Or divider.
- "Try as Guest →" button allowing immediate sandbox exploration without losing state.
- Terms of Service and Privacy Policy footer links.

### Page 01 — Home Dashboard (`/app`)
- Top banner: "Good evening, Shreya! ✨ / Search the web. Remember what matters." with animated kitten playing with yarn ball.
- Large Chat Composer with rounded-3xl ivory background:
  - Input field placeholder: "Ask Nimii anything..."
  - `+ Search Web` pill button (toggleable with active indigo state)
  - `Remember this` bookmark pill button (toggleable)
  - Attachment paperclip icon
  - Send message arrow button with gradient purple fill
- "Try asking..." suggestions chips with right arrows:
  - "What's new in React 19? →"
  - "Summarize this article →"
  - "What did I ask yesterday? →"
  - "Track my tasks →"
- Bottom grid:
  - Recent Memory card (with quick timestamp and mini sleepy kitten)
  - Open Loops card (with active items, today badge, and `+ Add a new loop` button)
  - Quick Actions card (Search, Memory, Loops tiles)

### Page 02 — Active Chat (`/app/chat/[conversationId]`)
- Chat header: Back button, conversation title ("New Chat" or generated title), Search in chat, Copy chat, More options, Online status, Theme toggle.
- Message history stream:
  - User bubble: Soft lavender rounded pill aligned right with user avatar initial.
  - Assistant bubble: Nimii kitten avatar, structured response:
    - Text paragraphs
    - Purple "Key Highlights" badge
    - Numbered badge points (1, 2, 3...)
    - Web Citation Cards: Favicon/Logo, Source Title, Domain, External Link icon (e.g. OpenAI, Google Gemini, Claude)
    - Action buttons row: Helpful (thumbs up), Not helpful (thumbs down), Copy, Regenerate, Save to Memory, Sources count pill.
    - Follow-up suggestions pill carousel ("You might also ask...").
- Persistent bottom composer with web search toggle and attachment button.
- Right context panel live sync.

### Page 03 — Memory Timeline & Knowledge (`/app/memory`)
- Header banner with lying relaxed kitten.
- View switcher: Timeline, Topics, Saved Facts, Decisions, Sources.
- Search input ("Search your memories...") + Date filter ("All Time", "Today", "Past Week", "Past Month") + Calendar picker.
- Grouped entries by date ("Today • Mar 16, 2025", "Yesterday • Mar 15, 2025", "Nov 8, 2025").
- Memory items: Category icon in pastel square, Title, Summary text, Time + Tags, "View Details →" button.
- Memory Details Panel: Detailed summary, extracted points checklist, Original Conversation link ("View Chat →"), Related memories cards, "Save to Memory" button.
- Memory Insights card at bottom.

### Page 04 — Open Loops Task Intelligence (`/app/loops`)
- Header with kitten watching playfully.
- Filter tabs: `Today (2)`, `This Week (1)`, `Later (1)`, `Completed`.
- Search open loops input.
- Task sections grouped by timing.
- Interactive checkboxes to complete/reopen tasks.
- Task cards: Title, Description, Category icon pill (Project, GitHub, Hackathon, Study), Due date badge, Priority indicator (High, Medium, Low with up/down arrows and colored pills), 3-dots actions menu (Edit, Delete, Reschedule).
- Right column:
  - Loop Stats card: Total Loops (4), Pending (2), Completed (2).
  - Priority Breakdown donut chart (High 1, Medium 2, Low 1).
  - Encouraging mascot card ("Stay on track!").
  - `+ Add a New Loop` CTA button opening modal.
- Add/Edit Loop Modal with title, category, priority, due date, notes.

### Page 05 — Conversation History (`/app/history`)
- Search conversations bar.
- Filters: Date range, All Topics, Clear Filters button.
- Right filter sidebar with topic tags (All, AI, Development, Study, Design, Others), date range picker, sort order.
- List of conversation cards grouped by date with message count, timestamp, tags, and prominent "Resume ▶" button + 3-dots menu (Rename, Export JSON/Markdown, Delete).
- Pagination controls (`< 1 2 3 >`).
- Quick stats: Total (42), This Month (35), This Week (12).

### Page 06 — Settings (`/app/settings`)
- Category navigation tabs: General, Memory, Privacy, Appearance, Account.
- General Preferences: Language select, Timezone select, Enable Web Search toggle switch, Show Citations toggle switch.
- Appearance: Theme selection cards (Dreamy, Light, Dark), Chat Density (Compact, Balanced, Spacious), Animations toggle switch.
- Memory Controls: Save Important Info toggle switch, Memory Retention dropdown (Forever, 30 Days, 90 Days), Manage Memories CTA.
- Privacy & Data: Export My Data button, Clear All Data / Delete Account button with confirmation modal.
- Right mascot card ("Your privacy matters!").
- Quick links (Help Center, Privacy Policy, Terms of Service).
- Sticky "Save Changes" notification / action button.

### Page 07 — User Profile (`/app/profile`)
- User avatar, name, email, membership status.
- Account statistics (total conversations, memories saved, loops completed).
- Personal preferences and shortcut actions.

---

## 6. Architecture & Data Flow
- **Data Access Layer (`lib/data/` & `lib/stores/`)**:
  - `memoryStore`: Mock memories with full CRUD, search, filter, and detail retrieval.
  - `loopsStore`: Tasks with status, priority, grouping, creation, completion, deletion.
  - `chatStore`: Conversations, messages, citations, streaming state simulator, web search toggle, remember toggle.
  - `settingsStore`: User preferences, theme, density, animations, memory retention.
  - `userStore`: Active user profile, guest vs authenticated state.
- **Persistence**: Synced with `localStorage` so user edits, task completions, and new chats persist across reloads while retaining fresh mock seeds if reset.
