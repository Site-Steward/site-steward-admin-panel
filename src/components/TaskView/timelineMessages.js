export function buildTimeline({ prompts = [], pendingPrompt = null }) {
  const safePrompts = Array.isArray(prompts) ? prompts : [];
  const messages = safePrompts.flatMap((prompt, index) =>
    buildPromptMessages(prompt, index),
  );

  if (pendingPrompt && !isPendingPromptSynced(safePrompts, pendingPrompt)) {
    messages.push(...buildPendingPromptMessages(pendingPrompt));
  }

  return messages;
}

export function getLatestPrompt(task) {
  const prompts = Array.isArray(task?.prompts) ? task.prompts : [];
  return prompts.at(-1) ?? null;
}

export function getPromptCount(task) {
  return Array.isArray(task?.prompts) ? task.prompts.length : 0;
}

export function isPendingPromptSynced(prompts, pendingPrompt) {
  if (!pendingPrompt) {
    return false;
  }

  const safePrompts = Array.isArray(prompts) ? prompts : [];
  const syncedPrompt = safePrompts[pendingPrompt.expectedPromptIndex];

  return syncedPrompt?.request === pendingPrompt.request;
}

function buildPromptMessages(prompt, index) {
  const promptKey = getPromptKey(prompt, index);
  const response = prompt?.response?.trim();
  const messages = [
    {
      id: `${promptKey}-request`,
      type: "user-request",
      request: prompt?.request ?? "",
    },
  ];

  if (response) {
    messages.push({
      id: `${promptKey}-response`,
      type: "agent-response",
      response,
    });
  }

  switch (prompt?.state) {
    case "pending":
      messages.push({
        id: `${promptKey}-progress`,
        type: "agent-working",
        title: response
          ? "Finishing the last details"
          : "Steward is working on it",
        detail: response
          ? "One more step before the result is ready."
          : "Waiting for the agent response to come back.",
        animateDots: true,
      });
      break;

    case "building_preview":
      messages.push({
        id: `${promptKey}-preview-building`,
        type: "building-preview",
        title: "Building your preview",
        detail: "The response is ready and the change preview is on its way.",
      });
      break;

    case "preview_ready":
      if (prompt?.preview_url) {
        messages.push({
          id: `${promptKey}-preview-ready`,
          type: "preview-ready",
          previewUrl: prompt.preview_url,
          note: "Please let me know if you would like any adjustments.",
        });
      } else {
        messages.push({
          id: `${promptKey}-preview-finalizing`,
          type: "building-preview",
          title: "Finalizing your preview",
          detail: "The response is ready and the preview link should appear shortly.",
        });
      }
      break;

    case "needs_more_info":
      messages.push({
        id: `${promptKey}-needs-more-info`,
        type: "agent-working",
        title: "Waiting for your reply",
        detail: "The agent needs a bit more information before it can continue.",
      });
      break;

    case "error_build_failed":
      messages.push({
        id: `${promptKey}-preview-error`,
        type: "error",
        errorMessage: "The preview build failed. Please try again.",
      });
      break;

    case "error":
      messages.push({
        id: `${promptKey}-error`,
        type: "error",
        errorMessage:
          prompt?.error_message ||
          "Sorry, something went wrong while processing your request.",
      });
      break;

    default:
      break;
  }

  return messages;
}

function buildPendingPromptMessages(pendingPrompt) {
  return [
    {
      id: `${pendingPrompt.id}-request`,
      type: "user-request",
      request: pendingPrompt.request,
      isPending: true,
    },
    {
      id: `${pendingPrompt.id}-progress`,
      type: "agent-working",
      title: "Sending your request",
      detail: "It will appear in the conversation as soon as the task updates.",
      animateDots: true,
      isPending: true,
    },
  ];
}

function getPromptKey(prompt, index) {
  return prompt?.id ?? prompt?.prompt_number ?? prompt?.number ?? index;
}
