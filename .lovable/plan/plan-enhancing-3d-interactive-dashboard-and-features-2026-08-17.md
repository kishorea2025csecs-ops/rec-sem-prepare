# Plan: Enhancing 3D Interactive Dashboard and Features

The objective is to transform the user dashboard into a highly interactive, 3D-first experience with a "Learner Orbit" theme, integrating professional animations, a 3D progress wheel, and ensuring all features are functional and visually stunning.

## User Features & UI
- **3D Progress Wheel**: Replace the standard progress bar with a 3D interactive wheel model that displays study details (completion, accuracy, tasks).
- **Interactive 3D Dashboard**: A persistent 3D environment in the dashboard where users can "touch" or click 3D objects to open specific menu options or tools.
- **Professional Animations**: Enhanced Framer Motion and Three.js transitions for all cards, buttons, and section changes.
- **REC Branding & Security**: Maintain the verified `@rajalakshmi.edu.in` restriction for all AI features.

## Technical Details
- **Three.js / React Three Fiber**:
  - Implement a `ProgressWheel3D` component using a torus or specialized geometry with segments representing topics/units.
  - Update `StudySpace.tsx` or create a `DashboardSpace.tsx` for the interactive dashboard environment.
  - Add raycasting/hover states to 3D objects in the dashboard to trigger UI actions.
- **Framer Motion**:
  - Add "floating" and "professional shimmer" effects to all dashboard buttons and cards.
  - Smooth interpolation for 3D camera transitions when switching dashboard views.
- **State Management**:
  - Sync the 3D wheel state with `public.study_progress` data from Supabase.
  - Ensure real-time updates when a user marks a topic as "Prepared".

## Components to Update/Create
- `src/components/ProgressWheel3D.tsx`: The new 3D progress visualizer.
- `src/routes/dashboard.tsx`: Overhaul the UI to integrate the 3D wheel and interactive elements.
- `src/components/StudySpace.tsx`: Refine animations and object quality (stars, cones, cubes as requested).

## Security
- Continue enforcing RLS on `study_materials` and `study_progress`.
- Ensure identity fields remain locked via the existing database triggers.
