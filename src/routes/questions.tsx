import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/questions")({
  component: () => <div>Question Bank</div>,
});
