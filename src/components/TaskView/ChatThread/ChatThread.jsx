import { Copy, Ellipsis, RefreshCw } from "lucide-react";

import "./ChatThread.css";

export default function ChatThread() {
  return (
    <div className="chat-thread" role="log" aria-live="polite">
      <article className="message message-user" aria-label="User message">
        <p>Test message</p>
      </article>

      <article className="message message-agent" aria-label="Agent response">
        <p>
          Message received. How can I help? If you want to test a location
          lookup or weather query, tell me a place (or latitude/longitude), and
          I&apos;ll run a quick check.
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
  );
}
