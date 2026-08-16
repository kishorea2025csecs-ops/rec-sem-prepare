# Implementation Plan - PDF Analysis & PYQ Integration

Enhance the Student Dashboard with specialized UI for PDF upload analysis and Previous Year Question (PYQ) pattern recognition.

## User Interface Changes

### Dashboard Enhancements
- **Dynamic Tabs**: Update the "Preparation Plan" tab to include a new "PYQ Analysis" view.
- **Upload Center**: Enhance the "Unit Notes" tab with a "Process with AI" state that shows extracted concepts (Definitions, Formulas, Diagrams).
- **Question Mapping**: Add a dedicated section where questions from PYQs are mapped to specific unit topics with importance metrics.

### New Components
- **TopicAnalysisCard**: A detailed view for a single topic showing its exam history, expected marks, and specific preparation tips (e.g., "learn the diagram").
- **AnalysisStatus**: A progress indicator for PDF processing (Analyzing → Extracting Formulas → Mapping Questions).
- **PYQPatternGrid**: A visual representation of question frequency (e.g., "High Priority", "Frequently Asked").

## Technical Details

### State Management
- Implement `analysisStatus` ('idle' | 'uploading' | 'analyzing' | 'complete') to drive the UI transitions.
- Mock the AI extraction results for:
    - `importantConcepts`: List of definitions and key terms.
    - `examPatterns`: Array of { question, appearances, expectedMarks, preparationStrategy }.

### UI Elements
- Use **Lucide icons** for different content types: `Zap` for formulas, `Image` for diagrams, `History` for past questions.
- Maintain the "Academic Dark" theme with `accent` (amber) for high-priority items and `primary` (indigo) for standard study tasks.
- Ensure all AI-generated text uses cautious language ("frequently asked", "high priority") as requested.

## Verification Plan
- **Manual Test**: Navigate to Dashboard, switch between "Unit Notes" and "Previous Papers" tabs.
- **Visual Check**: Verify the "Topic Analysis" card displays the expected 8/13 mark breakdown and frequency stats.
- **Accessibility**: Ensure the upload and analysis states are screen-reader friendly.
