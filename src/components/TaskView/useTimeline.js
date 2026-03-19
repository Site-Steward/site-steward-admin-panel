export function useTimeline({ task, pendingClientMessage }) {
  return task ? generateMessageList(task.prompts, pendingClientMessage) : null;
}

function generateMessageList(prompts = [], pendingClientMessage) {
  const messages = [];

  console.log("prompts", prompts);

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];

    messages.push({ type: "user-request", request: prompt.request });

    if (prompt.state === "error") {
      // Error
      messages.push({
        type: "error",
        errorMessage: prompt.error_message,
      });
    } else {
      // Progress message
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
          messages.push({
            type: "preview-ready",
            previewUrl: prompt.preview_url,
          });
          break;
      }
    }
  }

  if (pendingClientMessage) {
    messages.push({ type: "user", text: pendingClientMessage });
  }

  return messages;
}
