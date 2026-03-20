
import ChangeDialog from "../ChangeDialog/ChangeDialog";

import "./ChatThread.css";

export default function ChatThread({ timeline, onAccept, isAccepting = false }) {

  return timeline ? (
    <div className="chat-thread" role="log" aria-live="polite">
      {timeline.map((message, index) => {
        switch (message.type) {
          case "user-request":
            return (
              <p key={index} className="message user-request">
                  {message.request}
              </p>
            );

          case "agent-response":
            return (
              <div key={index} className="message agent-response">
                <p>{message.response}</p>
              </div>
            );

          case "agent-working":
            return (
              <div key={index} className="message agent-working">
                {renderPromptStatus(message.prompt)}
              </div>
            );

          case "building-preview":
            return (
              <div key={index} className="message building-preview">
                <p>Response ready. Building change preview now.</p>
              </div>
            );

          case "preview-ready":
            return (
              <div key={index} className="message preview-ready">

                <ChangeDialog
                  previewUrl={message.previewUrl}
                  onAccept={onAccept}
                  onOpenPreview={() => {}}
                  isAccepting={isAccepting}
                />
                  
                <p>
                  Please let me know if you would like any adjustments.
                </p>
              </div>
            );

          default:
            return (
              <div key={index} className="message error">
                <p>Sorry, something went wrong with processing your request.</p>
              </div>
            );
        }
      })}
    </div>
  ) : (
    <div className="chat-thread no-task">Loading...</div>
  );
}

function renderPromptStatus(prompt) {
  switch (prompt?.state) {
    case "pending":
      return (
        <p className="working-indicator" aria-live="polite">
          <span className="working-label">Working on your request</span>
          <span className="working-dots" aria-hidden="true">
            ...
          </span>
        </p>
      );

    case "building_preview":
      return <p>Response ready. Building change preview now.</p>;

    case "preview_ready":
      return prompt?.preview_url ? (
        <p>
          Preview is ready.{" "}
          <a href={prompt.preview_url} target="_blank" rel="noreferrer">
            Open change preview
          </a>
          .
        </p>
      ) : (
        <p>Preview is marked ready, but no preview link was found.</p>
      );

    case "needs_more_info":
      return <p>Waiting for more information to continue.</p>;

    case "error_build_failed":
      return <p>Preview build failed. Please try again.</p>;

    default:
      return null;
  }
}
