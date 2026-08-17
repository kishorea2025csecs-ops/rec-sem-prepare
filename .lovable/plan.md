# Implementation Plan - Fully Functional SemPrep AI Features

Upgrade SemPrep AI from a prototype to a fully functional exam preparation system by implementing core logic for the Question Bank, Topics, Study Planner, and Analytics pages, and ensuring all navigation and action buttons are connected to backend logic.

## User Review Required

> [!IMPORTANT]
> The AI will generate revision plans based on a simple linear distribution of topics across the available days. I will use the "Important Topics" list generated during PDF analysis to populate the feature pages.

## Proposed Changes

### 1. Question Bank (`src/routes/questions.tsx`)
- Replace "Coming Soon" with a functional search and filter interface.
- Implement `QuestionCard` component with "View Solution", "Mark Prepared", and "Practice" buttons.
- Connect "Mark Prepared" to `topic_progress` or a new `prepared_questions` table.
- Display questions extracted during AI analysis of uploaded materials.

### 2. Important Topics (`src/routes/topics.tsx`)
- Display high-priority topics extracted from uploaded notes and PYQs.
- Implement "Start Learning" (opens topic details/explanation) and "Watch Tutorial" (opens YouTube Tamil query).
- Show priority, marks, frequency, and mastery levels (connected to `topic_progress`).

### 3. Study Planner (`src/routes/planner.tsx`)
- Implement form to capture Exam Date, Units, Study Hours, and Preparation Level.
- Logic to generate a daily revision schedule saved to `study_plans` and `study_plan_items`.
- Dashboard-integrated progress tracking for scheduled tasks.

### 4. Analytics (`src/routes/analytics.tsx`)
- Replace placeholders with live data from `getPreparationStats` server function.
- Display Question Accuracy, Mastery Trends, and Revision KPI.
- Integrate 3D readiness visualization using existing `ProgressWheel3D`.

### 5. Dashboard & Global Navigation (`src/routes/dashboard.tsx`, `src/components/Sidebar.tsx`)
- Ensure all "Study Recommendation" and "Open Planner" buttons navigate to the correct routes.
- Connect "Lesson Roadmap" steps to specific unit/topic filtered views.
- Fix any broken "Coming Soon" tooltips or disabled buttons.

### 6. Backend Logic (`src/lib/*.server.ts`)
- Add `getQuestionBank` server function to fetch questions from analyzed materials.
- Add `generateStudyPlan` server function to create the revision schedule.
- Add `updateTopicMastery` to handle "Mark Prepared" actions.

## Technical Details
- **Data Model**: Leverage existing `topics`, `questions`, `topic_progress`, `question_attempts`, and `study_plans` tables.
- **Routing**: Use `@tanstack/react-router` for all navigation.
- **State Management**: Use TanStack Query for caching and synchronizing backend data.
- **UI**: Maintain glassmorphic "Pro Developer" aesthetic using Tailwind CSS and Framer Motion.
- **Security**: Maintain `@rajalakshmi.edu.in` domain restriction and RLS policies.
