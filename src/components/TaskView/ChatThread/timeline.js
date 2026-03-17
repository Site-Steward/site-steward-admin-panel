import { useState } from "react";

import api from "../../../util/siteStewardApiClient.js";
import { useTaskRefreshLoop } from "./useTaskRefreshLoop.js";

export function useTimeline({ taskId, onError }) {
  const [task, setTask] = useState(null);
  const [pendingClientMessage, setPendingClientMessage] = useState(null);

  // Refreshes immediately then per polling interval
  useTaskRefreshLoop({
    taskId,
    onRefresh: (refreshedTask) => {
      setTask(refreshedTask);
    },
    onError
  });

  return task? {
    messages: generateMessageList(task.prompts, pendingClientMessage),

    submit: async (message) => {
      setPendingClientMessage(message);
      try {
        const refreshedTask = await api.addTaskPrompt(taskId, message);
        setPendingClientMessage(null);
        setTask(refreshedTask);
      } catch (requestError) {
        onError(requestError);
      }
    },
  } : null;
}

function generateMessageList(prompts, pendingClientMessage) {
  const messages = [];

  // TODO: probably should useMemo on prompt-derived so when
  // pendingClientMessage is defined the message list updates
  // instantly.
  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];

    messages.push({ type: "user-request", request: prompt.request });

    // For all but the last prompt, display agent response directly
    if (i < prompts.length - 1) {
      messages.push({ type: "agent-response", response: prompt.response });

      // Last prompt...
    } else {
      
      // Error
      if (prompt.state === "error") {
        messages.push({
          type: "error"
        });

        // Progress update
      } else {

        switch (prompt.state) {
          case "pending":
            messages.push({ type: "agent-working" });
            break;

          case "building_preview":
            messages.push({ type: "agent-response", response: prompt.response });
            messages.push({ type: "building-preview" });
            break;

          case "preview_ready":
            messages.push({ type: "agent-response", response: prompt.response });
            messages.push({ type: "preview-ready", previewUrl: prompt.preview_url });
            break;
        }

      }
    }

    if (pendingClientMessage) {
      messages.push({ type: "user", text: pendingClientMessage });
    }

    return messages;
  }
}
