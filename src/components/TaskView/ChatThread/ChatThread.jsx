import { useEffect, useRef } from "react";

import ChangeDialog from "../ChangeDialog/ChangeDialog";

import "./ChatThread.css";

export default function ChatThread({
  timeline,
  onAccept,
  isAccepting = false,
}) {
  const threadEndRef = useRef(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  }, [isAccepting, timeline?.length, timeline?.at(-1)?.id]);

  if (!timeline) {
    return <div className="chat-thread no-task">Loading conversation...</div>;
  }

  return (
    <div className="chat-thread" role="log" aria-live="polite">
      {timeline.map((message) => renderTimelineMessage(message, onAccept, isAccepting))}
      <div ref={threadEndRef} className="thread-anchor" aria-hidden="true" />
    </div>
  );
}

function renderTimelineMessage(message, onAccept, isAccepting) {
  switch (message.type) {
    case "user-request":
      return (
        <div
          key={message.id}
          className={`message user-request${message.isPending ? " pending" : ""}`}
        >
          <p>{message.request}</p>
        </div>
      );

    case "agent-response":
      return (
        <div key={message.id} className="message agent-response">
          <p>{message.response}</p>
        </div>
      );

    case "agent-working":
    case "building-preview":
      return renderProgressMessage(message);

    case "preview-ready":
      return (
        <div key={message.id} className="message preview-ready">
          <ChangeDialog
            previewUrl={message.previewUrl}
            onAccept={onAccept}
            onOpenPreview={() => {}}
            isAccepting={isAccepting}
          />
          {message.note ? <p className="preview-note">{message.note}</p> : null}
        </div>
      );

    case "error":
    default:
      return (
        <div key={message.id} className="message error">
          <p>
            {message.errorMessage ||
              "Sorry, something went wrong with processing your request."}
          </p>
        </div>
      );
  }
}

function renderProgressMessage(message) {
  return (
    <div
      key={message.id}
      className={`message ${message.type}`}
      role="status"
      aria-label={message.detail ? `${message.title}. ${message.detail}` : message.title}
    >
      <div className="status-heading">
        <span className="status-title">{message.title}</span>
        {message.animateDots ? (
          <span className="working-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        ) : null}
      </div>
      <div className="response-placeholder" aria-hidden="true">
        <span className="placeholder-line primary" />
        <span className="placeholder-line secondary" />
        <span className="placeholder-line tertiary" />
      </div>
    </div>
  );
}
