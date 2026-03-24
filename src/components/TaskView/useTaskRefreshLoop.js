import { useEffect } from "react";
import api from "@/util/siteStewardApiClient.js";

const POLLING_INTERVAL_MS = 3000;

/**
 * Custom React hook to manage a polling loop for refreshing a
 * task's data.
 */
export function useTaskRefreshLoop({ task, onRefresh, onError }) {
  const taskId = task?.id;
  const prompts = Array.isArray(task?.prompts) ? task.prompts : [];
  const lastPrompt = prompts[prompts.length - 1];
  const shouldPoll = shouldContinuePolling(lastPrompt);

  useEffect(() => {
    if (!taskId) {
      return;
    }

    let isCancelled = false;
    let timeoutId;

    const loadTask = async () => {
      try {
        const refreshedTask = await api.getTask(taskId);
        if (isCancelled) {
          return;
        }

        const refreshedPrompts = Array.isArray(refreshedTask?.prompts)
          ? refreshedTask.prompts
          : [];
        const refreshedLastPrompt = refreshedPrompts[refreshedPrompts.length - 1];

        onRefresh(refreshedTask);

        if (shouldContinuePolling(refreshedLastPrompt)) {
          timeoutId = setTimeout(loadTask, POLLING_INTERVAL_MS);
        }
      } catch (requestError) {
        if (isCancelled) {
          return;
        }
        onError(requestError);
      }
    };

    loadTask(); // onRefresh triggers when Promise settled; no need to await

    // Return cleanup function
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [taskId, shouldPoll, lastPrompt?.preview_url]);
}

function shouldContinuePolling(lastPrompt) {
  if (!lastPrompt) {
    return false;
  }

  if (lastPrompt.state === "pending") {
    return true;
  }

  if (lastPrompt.state === "building_preview") {
    return true;
  }

  if (lastPrompt.state === "preview_ready" && !lastPrompt.preview_url) {
    return true;
  }

  if (lastPrompt.state === "error") {
    return false;
  }

  return false;
}
