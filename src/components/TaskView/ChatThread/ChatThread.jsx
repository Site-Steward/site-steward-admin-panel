import { useTimeline } from "./timeline";
import "./ChatThread.css";

export default function ChatThread({ taskId }) {
  
  const timeline = useTimeline({
    taskId,
    onError: (error) => console.error(error)
  });

  return ( timeline ?
    <div className="chat-thread" role="log" aria-live="polite">
      {timeline.messages.map((message, index) => {
        switch (message.type) {

          case "user-request":
            return (
              <div key={index} className="message user-request">
                <div className="message-label">You</div>
                <div className="message-content">{message.request}</div>
              </div>
            );

          case "agent-response":
            return (
              <div key={index} className="message agent-response">
                <div className="message-label">Steward</div>
                <div className="message-content">{message.response}</div>
              </div>
            );

          case "agent-working":
            return (
              <div key={index} className="message agent-working">
                <div className="message-label">Steward</div>
                {renderPromptStatus(message.prompt)}
              </div>
            );
          
          case "building-preview":
            return (
              <div key={index} className="message building-preview">
                <div className="message-label">Steward</div>
                <p>Response ready. Building change preview now.</p>
              </div>
            );
          
          case "preview-ready":
            return (
              <div key={index} className="message preview-ready">
                <div className="message-label">Steward</div>
                <p>
                  Preview is ready.{" "}
                  <a href={message.previewUrl} target="_blank" rel="noreferrer">
                    Open change preview
                  </a>
                  .
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
    :
    <div className="chat-thread no-task">
      Loading...
    </div>
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
