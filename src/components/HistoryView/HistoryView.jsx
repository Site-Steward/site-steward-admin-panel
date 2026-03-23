import { useEffect, useState } from "react";

import api from "@/util/siteStewardApiClient.js";

import "./HistoryView.css";

export default function HistoryView() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadHistory() {
      setStatus("loading");
      setErrorMessage("");

      try {
        const tasks = await api.listTasks();
        if (isCancelled) {
          return;
        }

        setItems(buildHistoryItems(tasks));
        setStatus("ready");
      } catch (error) {
        console.error("Error loading task history:", error);
        if (isCancelled) {
          return;
        }

        setErrorMessage("Sorry, task history could not be loaded.");
        setStatus("error");
      }
    }

    loadHistory();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <section className="history-view" aria-label="Task history">
      <header className="history-view-header">
        <h2>History</h2>
        <p>Inactive tasks with committed code.</p>
      </header>

      {status === "loading" ? (
        <p className="history-view-status">Loading history...</p>
      ) : null}

      {status === "error" ? (
        <p className="history-view-status error">{errorMessage}</p>
      ) : null}

      {status === "ready" && items.length === 0 ? (
        <p className="history-view-status">
          No inactive tasks with committed code yet.
        </p>
      ) : null}

      {status === "ready" && items.length > 0 ? (
        <ol className="history-list">
          {items.map((item) => (
            <li key={item.id} className="history-card">
              <div className="history-card-main">
                <div className="history-card-heading">
                  <h3>{item.title}</h3>
                  <span className={`history-state ${item.state}`}>
                    {formatStateLabel(item.state)}
                  </span>
                </div>

                <p className="history-card-meta">
                  <span>Task #{item.id}</span>
                  <span>{item.commitLabel}</span>
                  <span>{item.updatedLabel}</span>
                </p>
              </div>

              <button
                type="button"
                className="ui secondary"
                disabled
                title="Undo is not implemented yet"
              >
                Undo
              </button>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}

function buildHistoryItems(tasks) {
  return [...tasks]
    .filter(isCommittedInactiveTask)
    .sort((left, right) => (right.updated_at ?? 0) - (left.updated_at ?? 0))
    .map((task) => {
      const latestPromptCommit = getLatestPromptCommit(task);
      const commitSha = task.merge_commit_sha || latestPromptCommit?.commit_sha;
      const commitSource = task.merge_commit_sha ? "Merged" : "Preview commit";

      return {
        id: task.id,
        state: task.state,
        title: task.friendly_title?.trim() || `Task #${task.id}`,
        commitLabel: `${commitSource}: ${shortSha(commitSha)}`,
        updatedLabel: `Updated ${formatTimestamp(task.updated_at)}`,
      };
    });
}

function isCommittedInactiveTask(task) {
  if (!task || task.state === "active") {
    return false;
  }

  return Boolean(task.merge_commit_sha || getLatestPromptCommit(task));
}

function getLatestPromptCommit(task) {
  const prompts = Array.isArray(task?.prompts) ? task.prompts : [];
  return [...prompts]
    .reverse()
    .find((prompt) => typeof prompt?.commit_sha === "string" && prompt.commit_sha);
}

function formatStateLabel(state) {
  return String(state ?? "unknown").replaceAll("_", " ");
}

function shortSha(value) {
  return typeof value === "string" ? value.slice(0, 7) : "unknown";
}

function formatTimestamp(value) {
  if (!Number.isFinite(value)) {
    return "recently";
  }

  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
