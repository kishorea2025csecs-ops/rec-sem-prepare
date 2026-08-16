# Plan: Engineering Exam Preparation Platform Phase 2

Implement advanced exam guidance features, AI study tools, and organizational pages (Important Topics, Question Bank, Study Planner) for Rajalakshmi Engineering College students.

## Proposed Changes

### 1. Dashboard Enhancements (`src/routes/dashboard.tsx`)
- **Exam Score Guidance**: Add a detailed section for each topic showing mark-wise structure, examiner expectations, and key diagrams.
- **AI Explanation (3-Level)**: Implement "Quick Understanding", "Exam Explanation", and "Last-Minute Revision" views for each question.
- **Tamil YouTube Learning Resources**: Integrated verified Tamil tutorials for specific concepts with channel info and usage tips.
- **Progress Tracking**: Enhanced visual tracking for topics (Not Started, Learning, Practicing, Prepared, Needs Revision).
- **Study Flow**: Implement the Question -> Concept -> Notes -> Watch -> Structure -> Practice flow.

### 2. New Organizational Routes
- **Important Topics Page (`src/routes/topics.tsx`)**: High-priority topics categorized by frequency, recency, and marks.
- **Question Bank (`src/routes/question-bank.tsx`)**: Searchable, filterable bank with detailed question pages.
- **Study Planner (`src/routes/study-planner.tsx`)**: AI-assisted schedule generator based on exam date, units, and availability.

### 3. Shared Components & Logic
- **AI Assistant**: Sidebar/floating chat to ask context-aware questions about notes and papers.
- **Mock Data Expansion**: Populate the system with realistic examples for REC Engineering subjects (Maths, AI, DBMS).
- **Navigation Update**: Link the new routes in the sidebar and dashboard.

## Technical Details
- **State Management**: Use `useState` for UI tabs and `supabase` for persisting student progress.
- **UI Components**: Shadcn UI (Tabs, Accordion, Progress, ScrollArea, Tooltip) for a professional look.
- **AI Simulation**: Use realistic prompt-based guidance structures until full LLM integration is requested.
- **Filtering**: Client-side filtering for the Question Bank using `useMemo`.
