import { useEffect, useState } from "react";

import ChatThread from "./ChatThread/ChatThread.jsx";
import MessageComposer from "./MessageComposer/MessageComposer.jsx";

import "./TaskView.css";

export default function TaskView({ taskId }) {
  const [activeTaskId, setActiveTaskId] = useState(taskId);

  useEffect(() => {
    setActiveTaskId(taskId);
  }, [taskId]);

  return (
    <section
      className="task-view"
      aria-label="Task conversation"
      data-task-id={activeTaskId}
    >
      {activeTaskId ? 
        <ChatThread taskId={activeTaskId} /> :
        <div className="welcome-message">
          <h2>Hello</h2>
          <p>How can I help you today?</p>
        </div>
      }

      <MessageComposer
        taskId={activeTaskId}
        onTaskCreated={(createdTaskId) => setActiveTaskId(createdTaskId)}
      />
    </section>
  );
}
