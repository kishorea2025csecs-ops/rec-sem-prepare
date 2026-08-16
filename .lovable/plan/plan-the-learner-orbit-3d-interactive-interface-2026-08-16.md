# Plan: "The Learner Orbit" 3D Interactive Interface

Implement a modern, interactive "Learner Orbit" 3D interface for the landing page hero section, replacing the existing room background with a sleek, glassmorphic card system inspired by the provided reference.

## Proposed Changes

### Styles & Theme
- Update `src/styles.css` to include the new "The Learner Orbit" theme variables:
  - Deep space background: `#0A0A16` (OKLCH mapping)
  - Neon accents: Electric Blue (`#00D2FF`) and Vibrant Purple (`#9D4EDD`)
  - Glassmorphism utilities for frosted glass effects
- Add keyframe animations for floating 3D elements and pulsing effects.

### Landing Page (Hero Section)
- Modify `src/routes/index.tsx`:
  - Replace the current Spline background iframe with a new interactive 3D component.
  - Implement a **3D Parallax Card**: A glassmorphic card that tilts based on mouse position.
  - Add **Floating 3D Elements**: Pulsing spheres, toruses, and cones around the hero content using Framer Motion or pure CSS 3D transforms.
  - Integrate the Spline widget carousel reference (`https://my.spline.design/widgetscarouselcopycopy-cfc7yNWcEtRgYFIXmHzEZWoV-JSW/`) if suitable as a background, or recreate the aesthetic with native components for better performance and interactivity.

### Component Logic
- Add mouse tracking hooks to drive the parallax effect.
- Ensure the interface remains fully responsive and accessible.

## Technical Details
- **Parallax**: `useMotionValue`, `useSpring`, and `useTransform` from `framer-motion` for smooth card tilting.
- **Glassmorphism**: `backdrop-blur` with low-opacity borders and backgrounds.
- **3D Elements**: Use `perspective` and `translate3d` CSS properties for depth, combined with SVG/CSS-based pulsing shapes.
- **Color Mapping**:
  - Background: `oklch(0.14 0.04 260)`
  - Electric Blue: `oklch(0.75 0.2 210)`
  - Vibrant Purple: `oklch(0.6 0.25 300)`
