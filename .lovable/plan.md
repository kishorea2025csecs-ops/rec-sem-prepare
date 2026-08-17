# Plan: Consolidate Dashboard and Re-position Scene Selector

The user wants to move the "Learner Orbit" 3D scene selector to a more "usable location" on the home page and potentially address a missing or misplaced menu bar for logged-in users. Based on the "Pro Developer" aesthetic and "The Learner Orbit" concept, the scene selector should be integrated more intentionally into the UI rather than just being a floating button in the corner.

## User Review Required

> [!IMPORTANT]
> The scene selector is currently a small floating button in the bottom-right. Should it be moved to a more prominent position in the header, or perhaps integrated directly into the "3D Study Space" hero section? I will proceed with moving it to the header for better accessibility.

## Proposed Changes

### UI & Layout Enhancements

#### 1. Global Navigation & Menu Bar
- Update `src/routes/__root.tsx` to include a global, persistent navigation pill if needed, or ensure `src/routes/index.tsx` and `src/routes/dashboard.tsx` share a consistent header component.
- Currently, `index.tsx` and `dashboard.tsx` have separate header implementations. I will extract the "Glass Pill" header into a shared component to ensure the "Menu Bar" is consistent across the app.

#### 2. Re-position Scene Selector
- Move `SceneSelector` from its current floating position in `src/routes/__root.tsx` to the shared navigation header.
- This makes the 3D environment controls a first-class feature of the "Learner Orbit" interface.

#### 3. Home Page Refinement
- Ensure the "Learner Orbit" 3D scene selector is clearly visible and labeled on the landing page.
- Add a "Dashboard" link to the mobile menu for logged-in users.

## Technical Details

### Component Extraction
- Create `src/components/Header.tsx` to house the glass-pill navigation logic.
- Props: `isAuthenticated`, `isVerifiedRec`, `userEmail`.

### Route Updates
- Replace local headers in `src/routes/index.tsx`, `src/routes/dashboard.tsx`, and `src/routes/profile.tsx` with the new `Header` component.
- Remove the floating `SceneSelector` from `src/routes/__root.tsx` and place it inside `Header.tsx`.

### Styling
- Maintain the "Pro Developer" aesthetic with neon cyan/purple glows and Montserrat fonts.
- Ensure the header remains a glassmorphic pill with high-fidelity transitions.
