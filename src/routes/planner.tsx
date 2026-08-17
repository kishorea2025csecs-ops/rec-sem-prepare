import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/planner")({
  component: () => <div>Study Planner</div>,
});
