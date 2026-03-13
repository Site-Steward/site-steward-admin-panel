import { useEffect, useMemo, useState } from "react";

import api from "../../../util/siteStewardApiClient.js";

import "./ChatThread.css";

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
        const isWaitingForResponse =
          lastPrompt?.state === "pending" && !lastPrompt?.response;

        if (isWaitingForResponse) {
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

  const lastPrompt = prompts.at(-1);
  const isWorking = Boolean(
    lastPrompt?.state === "pending" && !lastPrompt?.response,
  );

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
      {prompts.map((prompt) => (
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
        </div>
      ))}

      {isWorking ? (
        <article className="message message-agent" aria-label="Agent response">
          <p className="working-indicator" aria-live="polite">
            <span className="working-label">working</span>
            <span className="working-dots" aria-hidden="true">
              ...
            </span>
          </p>
        </article>
      ) : null}
    </div>
  );
}
