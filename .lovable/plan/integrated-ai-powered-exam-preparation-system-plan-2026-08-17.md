# Integrated AI-Powered Exam Preparation System Plan

Upgrade SemPrep AI into a data-driven learning system by connecting the existing dashboard with new analytics, interactive 3D concept graphs, and a performance-based study planner.

## User-Facing Changes

### Dashboard Enhancements
- **Exam Readiness Command Center**: A new header card displaying overall readiness %, topic coverage, question accuracy, and revision consistency.
- **AI Recommendation Engine**: Dynamic text providing personalized advice (e.g., "Focus next on Bayesian Networks...").
- **Preparation Analytics Card**: Visualizing Selection Rate (relevant questions prepared), Accuracy, and Revision KPI (consistency score).

### Interactive 3D Concept Analysis
- **Dynamic Concept Graph**: A Three.js/WebGL graph on Subject/Unit pages showing topics as nodes and relationships as edges.
- **Mastery Mapping**: Nodes colored and scaled based on importance (node size), mastery (color), and priority (glow).
- **Detail Panel**: Clicking a node reveals exam frequency, accuracy, and quick actions (Start Learning, Practice, Revise).

### Dynamic Important Topics
- **Performance Integration**: Topics now display real-time accuracy and mastery metrics alongside exam frequency.
- **AI Insight**: Contextual tips based on semester history vs. personal weak spots.

### Personalized Study Planner
- **Data-Driven Scheduling**: The planner now accounts for topic priority, historical frequency, personal accuracy, and remaining days until the exam.

### Revision System
- **Tracking & Streaks**: Record revision sessions to calculate consistency and improvement over time.

## Technical Details

### Database Schema (Implemented)
- `subjects`, `units`, `topics`, `questions`: Core academic structure.
- `topic_progress`, `question_attempts`, `revision_sessions`: User activity tracking.
- `study_plans`, `study_plan_items`: Personalized scheduling.
- `concept_nodes`, `concept_edges`: 3D graph metadata.

### Backend Logic
- **`prep.server.ts`**: New server module to calculate Readiness %, Selection Rate, and Revision KPI.
- **AI Recommendation Engine**: Refined server function to rank topics based on frequency, marks, and personal weakness.

### Frontend Components
- **`Header.tsx`**: Consistent navigation pill across all views.
- **`ConceptGraph.tsx`**: A dedicated, lifecycle-managed WebGL component for the interactive 3D graph.
- **`PreparationAnalytics.tsx`**: Reusable card for high-level metrics.

### Security
- **Hardened RLS**: All user tables strictly scoped to `auth.uid() = user_id`.
- **Domain Enforcement**: Persistent `@rajalakshmi.edu.in` restriction at the trigger level.
