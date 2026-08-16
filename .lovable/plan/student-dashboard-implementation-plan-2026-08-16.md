# Student Dashboard Implementation Plan

Create a functional and modern student dashboard for SemPrep AI, focusing on exam preparation, unit management, and personalized study recommendations.

## User Interface

- **Dashboard Layout**: Sidebar-based navigation for desktop, bottom-nav or burger menu for mobile.
- **Subject/Unit Selection**: Intuitive picker for engineering subjects and their respective units.
- **Upload Center**: Clean drag-and-drop zone for unit notes (PDFs) and previous-year question papers.
- **Progress Tracking**: Visual progress bars and "Topic Completion" heatmaps.
- **Topic Breakdown**: Modern cards showing "Must Study," "Expected Questions," and mark weightage.
- **Personalized Recommendations**: A "Study First" section based on AI analysis of importance vs. difficulty.

## Technical Details

- **New Route**: Create `src/routes/dashboard.tsx` for the main dashboard view.
- **State Management**: Local state (initially) to handle subject/unit selection and mock data for analysis.
- **Components**:
  - `DashboardSidebar`: Navigation and subject switcher.
  - `UploadZone`: Reusable file upload component with state indicators.
  - `TopicCard`: Displays topic importance, frequency, and recommended study material.
  - `ProgressStats`: Key metrics (topics covered, days to exam, priority score).
- **Icons**: Use `lucide-react` for consistent visual language (Brain, FileText, Layout, TrendingUp).
- **Styling**: Tailwind CSS v4 using semantic tokens (accent, surface, muted) to match the landing page.

## Data Structure (Mock)

```typescript
interface Topic {
  id: string;
  name: string;
  importance: 'High' | 'Medium' | 'Low';
  marks: number;
  frequency: string;
  completed: boolean;
}

interface Unit {
  id: number;
  name: string;
  progress: number;
  topics: Topic[];
}

interface Subject {
  id: string;
  name: string;
  code: string;
  units: Unit[];
}
```
