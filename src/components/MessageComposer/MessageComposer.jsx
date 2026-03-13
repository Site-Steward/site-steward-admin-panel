import { ArrowUp, Plus } from "lucide-react";

import "./MessageComposer.css";

export default function MessageComposer() {
  return (
    <form className="message-composer" aria-label="Message composer">
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
  );
}
