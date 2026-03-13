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
      <ChatThread taskId={activeTaskId} />

      <MessageComposer
        taskId={activeTaskId}
        onTaskCreated={(createdTaskId) => setActiveTaskId(createdTaskId)}
      />
    </section>
  );
}
