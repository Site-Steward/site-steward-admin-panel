import { useEffect, useState } from "react";

import api from "@/util/siteStewardApiClient.js";
import ChatThread from "./ChatThread/ChatThread.jsx";
import MessageComposer from "./MessageComposer/MessageComposer.jsx";
import { useTaskRefreshLoop } from "./useTaskRefreshLoop.js";
import {
  getLatestPrompt,
  getPromptCount,
  isPendingPromptSynced,
} from "./timelineMessages.js";
import { useTimeline } from "./useTimeline.js";

import stewardCounterLogo from "@/assets/counter_326x167.png";
import "./TaskView.css";

let activeTaskBootstrapPromise = null;

export default function TaskView({ taskId }) {
  const [error, setError] = useState(null);
  const [task, setTask] = useState(null);
  const [pendingPrompt, setPendingPrompt] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const timeline = useTimeline({ task, pendingPrompt });
  const latestPrompt = getLatestPrompt(task);
  const previewReady =
    !pendingPrompt &&
    latestPrompt?.state === "preview_ready" &&
    Boolean(latestPrompt?.preview_url);

  useEffect(() => {
    let isCancelled = false;
    setError(null);
    setTask(null);
    setPendingPrompt(null);

    loadTask(taskId)
      .then((task) => {
        if (!isCancelled) {
          setTask(task);
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          handleError(error, setError);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [taskId]);

  // Refreshes immediately then according to polling interval
  useTaskRefreshLoop({
    task,
    onRefresh: (refreshedTask) => {
      setTask(refreshedTask);
      setPendingPrompt((currentPendingPrompt) =>
        isPendingPromptSynced(refreshedTask?.prompts, currentPendingPrompt)
          ? null
          : currentPendingPrompt,
      );
    },
    onError: (error) => {
      console.error("Error refreshing task:", error);
    },
  });

  const hasMessages = timeline?.length > 0;
  const isLoadingTask = !task && !error;

  return (
    <section
      className="task-view"
      aria-label="Task conversation"
      data-task-id={task?.id}
    >
      <h2 className="view-header">{task?.friendly_title || `New Task`}</h2>

      <div className="task-view-thread-region">
        {error ? (
          <p className="task-view-status error" role="alert">
            {error}
          </p>
        ) : null}

        {hasMessages ? (
          <ChatThread
            timeline={timeline}
            onAccept={
              previewReady && task?.id
                ? async () => {
                    if (isAccepting) {
                      return;
                    }

                    setIsAccepting(true);
                    try {
                      await api.acceptTask(task.id);
                      const refreshedTask = await api.getTask(task.id);
                      setTask(refreshedTask);
                    } catch (requestError) {
                      handleError(requestError, setError);
                    } finally {
                      setIsAccepting(false);
                    }
                  }
                : undefined
            }
            isAccepting={isAccepting}
          />
        ) : isLoadingTask && taskId ? (
          <p className="task-view-status">Loading conversation...</p>
        ) : (
          <div className="welcome-message">
            <img
              src={stewardCounterLogo}
              alt="Steward Logo"
              className="logo"
            />
            <h2>Hello</h2>
            <p>How can I help you today?</p>
          </div>
        )}
      </div>

      <MessageComposer
        task={task}
        onSubmit={async (message) => {
          const pendingMessage = {
            id: getPendingPromptId(),
            request: message,
            expectedPromptIndex: null,
          };

          setError(null);
          setPendingPrompt(pendingMessage);

          try {
            const activeTask = await ensureTask({ task, taskId, setTask });
            const syncedPendingMessage = {
              ...pendingMessage,
              expectedPromptIndex: getPromptCount(activeTask),
            };

            setPendingPrompt((currentPendingPrompt) =>
              currentPendingPrompt?.id === pendingMessage.id
                ? syncedPendingMessage
                : currentPendingPrompt,
            );

            await api.replyToTask(activeTask.id, message);

            const refreshedTask = await api.getTask(activeTask.id);
            setTask(refreshedTask);
            setPendingPrompt((currentPendingPrompt) =>
              isPendingPromptSynced(
                refreshedTask?.prompts,
                currentPendingPrompt ?? syncedPendingMessage,
              )
                ? null
                : (currentPendingPrompt ?? syncedPendingMessage),
            );
          } catch (requestError) {
            handleError(requestError, setError);
            setPendingPrompt(null);
          }
        }}
      />
    </section>
  );
}

async function getOrCreateActiveTask() {
  try {
    return await api.getActiveTask();
  } catch (error) {
    if (error?.status === 404) {
      return await api.createTask();
    }
    throw error;
  }
}

async function loadTask(taskId) {
  if (taskId) {
    return await api.getTask(taskId);
  }

  return await getOrCreateActiveTaskOnce();
}

async function ensureTask({ task, taskId, setTask }) {
  if (task?.id) {
    return task;
  }

  const resolvedTask = await loadTask(taskId);
  setTask(resolvedTask);
  return resolvedTask;
}

function getOrCreateActiveTaskOnce() {
  if (!activeTaskBootstrapPromise) {
    activeTaskBootstrapPromise = getOrCreateActiveTask().finally(() => {
      activeTaskBootstrapPromise = null;
    });
  }

  return activeTaskBootstrapPromise;
}

function handleError(error, setError) {
  console.error("Error in TaskView:", error);
  setError("Sorry, something went wrong. Please try again.");
}

function getPendingPromptId() {
  if (typeof crypto?.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `pending-${Date.now()}`;
}
