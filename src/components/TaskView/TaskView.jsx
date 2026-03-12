import { ArrowUp, Copy, Ellipsis, Plus, RefreshCw } from "lucide-react";

import "./TaskView.css";

export default function TaskView({ taskId }) {
  return (
    <section className="task-view" aria-label="Task conversation" data-task-id={taskId}>
      <div className="task-thread" role="log" aria-live="polite">
        <article className="message message-user" aria-label="User message">
          <p>Test message</p>
        </article>

        <article className="message message-agent" aria-label="Agent response">
          <p>
            Message received. How can I help? If you want to test a location
            lookup or weather query, tell me a place (or latitude/longitude),
            and I&apos;ll run a quick check.
          </p>

          <div className="message-actions" aria-label="Message actions">
            <button type="button" aria-label="Copy message">
              <Copy size={15} strokeWidth={1.8} />
            </button>
            <button type="button" aria-label="Regenerate response">
              <RefreshCw size={15} strokeWidth={1.8} />
            </button>
            <button type="button" aria-label="More actions">
              <Ellipsis size={15} strokeWidth={1.8} />
            </button>
            <span className="response-time" aria-label="Response duration">
              2.36s
            </span>
          </div>
        </article>
      </div>

      <form className="composer" aria-label="Message composer">
        <label className="sr-only" htmlFor="task-input">
          Send a message
        </label>
        <textarea
          id="task-input"
          name="message"
          placeholder="Send a message..."
          rows={2}
        />

        <div className="composer-controls">
          <button type="button" className="attach-button" aria-label="Attach">
            <Plus size={20} strokeWidth={2} />
          </button>
          <button type="submit" className="send-button" aria-label="Send">
            <ArrowUp size={18} strokeWidth={2.3} />
          </button>
        </div>
      </form>
    </section>
  );
}
