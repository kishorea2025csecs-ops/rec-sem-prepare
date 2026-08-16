# Plan - Professional Typography Upgrade

Upgrade the typography to a professional "Canva-like" aesthetic using high-quality modern fonts that convey authority and clarity for an engineering exam preparation platform.

## Proposed Changes

### Visual Design
- **New Font Palette**:
  - **Display (Headings)**: `Syne` and `Space Grotesk` for a bold, distinctive, and technical look.
  - **Body (Sans)**: `Plus Jakarta Sans` for high readability and a premium modern feel.
  - **Secondary/UI**: `Outfit` for clean, geometric accents.
- **Styling Enhancements**:
  - Apply `uppercase` and increased letter-spacing to primary headings for a more professional "strictly business" aesthetic.
  - Refine font weights to create stronger visual hierarchy (Extra Bold for titles, Medium for body).

## Technical Details
- **Google Fonts**: Add `Plus Jakarta Sans`, `Space Grotesk`, `Outfit`, and `Syne` to `src/routes/__root.tsx`.
- **CSS Tokens**: Update `--font-display` and `--font-sans` in `src/styles.css`.
- **Component Updates**:
  - Update `src/routes/index.tsx` (Landing Page) to use new display font styles and uppercase transformation on the hero title.
  - Update `src/routes/dashboard.tsx` to align dashboard headers with the new professional style.
- **Verification**: Check font loading in the preview and verify that no layout shifts occur.

## User Review Required
- Does this selection of modern geometric and technical fonts meet your expectations for a "professional/Canva-like" design?
