import { buildTimeline } from "./timelineMessages.js";

export function useTimeline({ task, pendingPrompt }) {
  if (!task && !pendingPrompt) {
    return null;
  }

  return buildTimeline({
    prompts: task?.prompts,
    pendingPrompt,
  });
}
