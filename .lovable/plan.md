# Plan - Independent Section Scrolling with Persistent 3D Background

Implement a layout where each major section of the landing page is its own scrollable container. This ensures the 3D orbit background (which is `fixed`) remains visible while the content within each section can be scrolled independently, preventing the 3D elements from obstructing or being obstructed by content transitions in a standard long scroll.

## User Review Required

> [!IMPORTANT]
> This change will transition the website from a standard "long scroll" behavior to a "section-based" scroll behavior (similar to a vertical slider or "scroll snap" but with independent internal scrolling for content-heavy sections).

## Proposed Changes

### 3D Background & Layout
- Maintain `StudySpaceCanvas` as a `fixed` background element.
- Update `src/routes/index.tsx` layout to use a flex container that fills the viewport.
- Configure main sections (Hero, How it Works, Features, Tamil Help, Community) to be `snap-start` scroll targets with `h-screen` or `min-h-screen`.

### Styling Updates
- Update `src/styles.css` to include utility classes for section-based scrolling.
- Ensure the header remains `fixed` and `z-index`ed above all sections.
- Add `snap-y snap-mandatory` to the main container.

### Component Refinement
- Adjust `src/routes/index.tsx` sections to handle overflow internally where necessary.
- Ensure smooth transitions between sections while maintaining the 3D parallax effect.

## Technical Details

- **Container CSS**: `h-screen overflow-y-auto snap-y snap-mandatory` for the wrapper.
- **Section CSS**: `h-screen w-full snap-start overflow-y-auto` (internal scroll for overflow).
- **Parallax Logic**: `StudySpace.tsx` will still use `window.scrollY` or a passed scroll value from the snap container to drive the 3D camera.
