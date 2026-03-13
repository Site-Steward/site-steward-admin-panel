import ChatThread from "./ChatThread/ChatThread.jsx";
import MessageComposer from "./MessageComposer/MessageComposer.jsx";

import "./TaskView.css";

export default function TaskView({ taskId }) {
  return (
    <section
      className="task-view"
      aria-label="Task conversation"
      data-task-id={taskId}
    >
      <ChatThread />

      <MessageComposer />
    </section>
  );
}
