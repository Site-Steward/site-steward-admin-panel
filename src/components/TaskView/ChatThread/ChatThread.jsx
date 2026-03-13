import { useEffect, useMemo, useState } from "react";

import api from "../../../util/siteStewardApiClient.js";

import "./ChatThread.css";

function renderPromptStatus(prompt) {
  switch (prompt?.state) {
    case "pending":
      return (
        <p className="working-indicator" aria-live="polite">
          <span className="working-label">Working on your request</span>
          <span className="working-dots" aria-hidden="true">
            ...
          </span>
        </p>
      );

    case "building_preview":
      return <p>Response ready. Building change preview now.</p>;

    case "preview_ready":
      return prompt?.preview_url ? (
        <p>
          Preview is ready.{" "}
          <a href={prompt.preview_url} target="_blank" rel="noreferrer">
            Open change preview
          </a>
          .
        </p>
      ) : (
        <p>Preview is marked ready, but no preview link was found.</p>
      );

    case "needs_more_info":
      return <p>Waiting for more information to continue.</p>;

    case "error_build_failed":
      return <p>Preview build failed. Please try again.</p>;

    default:
      return null;
  }
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

  return false;
}

export default function ChatThread({ taskId }) {
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    let timeoutId;

    const loadTask = async () => {
      if (!taskId) {
        setTask(null);
        setError(null);
        return;
      }

      try {
        const nextTask = await api.getTask(taskId);
        if (isCancelled) {
          return;
        }

        setTask(nextTask);
        setError(null);

        const prompts = Array.isArray(nextTask?.prompts)
          ? nextTask.prompts
          : [];
        const lastPrompt = prompts.at(-1);

        if (shouldContinuePolling(lastPrompt)) {
          timeoutId = setTimeout(loadTask, 1000);
        }
      } catch (requestError) {
        if (isCancelled) {
          return;
        }

        setError(requestError);
      }
    };

    loadTask();

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [taskId]);

  const prompts = useMemo(() => {
    return Array.isArray(task?.prompts) ? task.prompts : [];
  }, [task]);

  if (!taskId) {
    return (
      <div className="chat-thread chat-thread-new-task" aria-live="polite">
        <p className="new-task-title">Hello!</p>
        <p className="new-task-subtitle">How can I help you today?</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-thread chat-thread-new-task" aria-live="polite">
        <p className="new-task-title">Could not load messages</p>
        <p className="new-task-subtitle">Please try again in a moment.</p>
      </div>
    );
  }

  return (
    <div className="chat-thread" role="log" aria-live="polite">
      {prompts.map((prompt) => {
        const promptStatus = renderPromptStatus(prompt);

        return (
          <div key={prompt.no}>
            <article className="message message-user" aria-label="User message">
              <p>{prompt.request}</p>
            </article>

            {prompt.response ? (
              <article
                className="message message-agent"
                aria-label="Agent response"
              >
                <p>{prompt.response}</p>
              </article>
            ) : null}

            {promptStatus ? (
              <article
                className="message message-agent"
                aria-label="Prompt status"
              >
                {promptStatus}
              </article>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
