# Consolidation Plan - Single Page Experience

Merge all preparation tools, analytics, and interactive modules into a single, high-performance scrolling page at the root route.

## User Experience
- Unified scrolling journey from Landing → Analytics → Roadmap → Resources.
- Navigation header with smooth-scrolling anchor links.
- "The Learner Orbit" 3D model integrated directly into the analytics section.
- Interactive preparation tools (Topics, PYQs, Planner) available without route changes.

## Technical Changes
- **Root Component (`src/routes/index.tsx`)**:
  - Incorporate state management from `dashboard.tsx` (analysis progress, tab switching, lesson steps).
  - Merge component logic for `Topics`, `QuestionBank`, and `StudyPlanner`.
  - Add smooth-scroll anchor sections (`#analytics`, `#roadmap`, `#resources`).
- **Styles (`src/styles.css`)**:
  - Add `scroll-behavior: smooth` to `:root`.
- **Cleanup**:
  - Redirect or remove `dashboard.tsx`, `topics.tsx`, `question-bank.tsx`, and `study-planner.tsx` once merged.

## Execution Steps
1. Update `src/styles.css` for smooth scrolling.
2. Update `src/routes/index.tsx` with unified state and component structure.
3. Consolidate functional sections (Analytics, Roadmap, Resources) into the main JSX.
4. Verify navigation and interactivity.
