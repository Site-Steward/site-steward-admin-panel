import { useEffect, useState } from "react";

import api from "@/util/siteStewardApiClient.js";
import ChatThread from "./ChatThread/ChatThread.jsx";
import MessageComposer from "./MessageComposer/MessageComposer.jsx";
import { useTaskRefreshLoop } from "./useTaskRefreshLoop.js";
import { useTimeline } from "./useTimeline.js";

import "./TaskView.css";

let activeTaskBootstrapPromise = null;

export default function TaskView({ taskId }) {
  const [error, setError] = useState(null);
  const [task, setTask] = useState(null);
  const [pendingClientMessage, setPendingClientMessage] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const timeline = useTimeline({ task, pendingClientMessage });
  const previewReady = timeline?.at(-1)?.type === "preview-ready";

  console.log("timeline", timeline);

  useEffect(() => {
    if (taskId) {
      return;
    }
    let isCancelled = false;
    getOrCreateActiveTaskOnce()
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
    },
    onError: (error) => {
      console.error("Error refreshing task:", error);
    },
  });

  return (
    <section
      className="task-view"
      aria-label="Task conversation"
      data-task-id={task?.id}
    >
      <div className="task-view-thread-region">
        {timeline ? (
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
        ) : (
          <div className="welcome-message">
            <h2>Hello</h2>
            <p>How can I help you today?</p>
          </div>
        )}
      </div>

      <MessageComposer
        task={task}
        onSubmit={async (message) => {
          setPendingClientMessage(message);
          try {
            await api.replyToTask(task.id, message);
          } finally {
            setPendingClientMessage(null);
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
