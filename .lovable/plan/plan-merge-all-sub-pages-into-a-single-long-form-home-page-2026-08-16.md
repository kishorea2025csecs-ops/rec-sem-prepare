# Plan - Merge all sub-pages into a single long-form home page

Merge the Dashboard, Topics, Question Bank, and Study Planner content into a single scrolling experience on the index route, with the interactive 3D Study Space serving as the focal point.

## User Review Required

> [!IMPORTANT]
> The application will transition from a multi-page dashboard to a single long-form page. Navigation will now scroll to sections instead of switching routes.

- Do you want to keep the sidebar navigation, or should it be a top-navigation bar only?
- Should the profile page also be merged, or remains a separate route?

## Proposed Changes

### Routes & Components

#### [MERGE] `src/routes/index.tsx`
- Combine the current landing page with `Dashboard`, `Topics`, `Question Bank`, and `Study Planner` content.
- Restructure into sections:
  1. **Hero**: Existing hero + Interactive 3D Study Space.
  2. **Analytics**: Moved from Dashboard (Selection Rate, Accuracy, 3D Concept Analysis).
  3. **Roadmap**: Moved from Dashboard (7-step Lesson Roadmap).
  4. **Topics**: Moved from Topics page.
  5. **Question Bank**: Moved from Question Bank page.
  6. **Planner**: Moved from Study Planner page.
  7. **How it Works / Features**: Existing landing page sections.

#### [REFACTOR] `src/components/StudySpace.tsx`
- Ensure it handles scrolling gracefully (sticky or parallax).

#### [CLEANUP] `src/routes/dashboard.tsx`, `src/routes/topics.tsx`, `src/routes/question-bank.tsx`, `src/routes/study-planner.tsx`
- Remove these routes as their content is now on the index.

### Styles
- Add smooth scrolling to the `html` element.
- Ensure consistent cyber-neon styling across all merged sections.

## Verification Plan

### Automated Tests
- Check that `http://localhost:8080/` renders all sections (Analytics, Topics, etc.).
- Verify that clicking "Important Topics" in the nav scrolls to the correct section.
- Check that the 3D Study Space is correctly positioned between the hero and content sections.

### Manual Verification
- Scroll through the entire page to ensure no layout breaks.
- Interact with the 3D objects and verify they still trigger tooltips/sections.
