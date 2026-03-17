import { useEffect } from "react";
import api from "../../../util/siteStewardApiClient.js";

const POLLING_INTERVAL_MS = 1000; // 1 second

export function useTaskRefreshLoop({ taskId, onRefresh, onError }) {
  useEffect(() => {
    let isCancelled = false;
    let timeoutId;

    const loadTask = async () => {
      if (!taskId) {
        return;
      }

      try {
        const refreshedTask = await api.getTask(taskId);
        if (isCancelled) {
          return;
        }

        onRefresh(refreshedTask);

        if (shouldContinuePolling(lastPrompt)) {
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
  }, [taskId]);
}

function shouldContinuePolling(lastPrompt) {
  if (!lastPrompt) {
    return false;
  }

  if (lastPrompt.state === "pending" && !lastPrompt.response) {
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
