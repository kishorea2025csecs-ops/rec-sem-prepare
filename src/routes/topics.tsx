import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/topics")({
  component: () => <div>Important Topics</div>,
});
