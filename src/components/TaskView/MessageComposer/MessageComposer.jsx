import { ArrowUp, LoaderCircle, Plus, X } from "lucide-react";
import { useRef, useState } from "react";

import api from "../../../util/siteStewardApiClient.js";
import { uploadSelectedFiles } from "./attachmentUpload.js";

import "./MessageComposer.css";

export default function MessageComposer({ taskId, onTaskCreated }) {
  const [attachments, setAttachments] = useState([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const removeAttachment = (localId) => {
    setAttachments((current) =>
      current.filter((attachment) => attachment.localId !== localId),
    );
  };

  const handleFileSelection = async (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    await uploadSelectedFiles({
      files: selectedFiles,
      api,
      onAttachmentQueued: (attachment) => {
        setAttachments((current) => [...current, attachment]);
      },
      onProgress: (localId, progress) => {
        setAttachments((current) =>
          current.map((attachment) =>
            attachment.localId === localId
              ? {
                  ...attachment,
                  progress,
                }
              : attachment,
          ),
        );
      },
      onUploaded: (localId, assetId) => {
        setAttachments((current) =>
          current.map((attachment) =>
            attachment.localId === localId
              ? {
                  ...attachment,
                  status: "uploaded",
                  progress: 100,
                  assetId,
                }
              : attachment,
          ),
        );
      },
      onError: (localId) => {
        setAttachments((current) =>
          current.map((attachment) =>
            attachment.localId === localId
              ? {
                  ...attachment,
                  status: "error",
                }
              : attachment,
          ),
        );
      },
    });

    event.target.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const initialPrompt = message.trim();
    if (!initialPrompt || isSubmitting) {
      return;
    }

    if (!taskId) {
      setIsSubmitting(true);
      try {
        const createdTask = await api.createTask(initialPrompt);
        if (createdTask?.id !== undefined && createdTask?.id !== null) {
          onTaskCreated?.(String(createdTask.id));
        }
        setMessage("");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form
      className="message-composer"
      aria-label="Message composer"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="task-input">
        Send a message
      </label>
      <textarea
        id="task-input"
        name="message"
        placeholder="Send a message..."
        rows={2}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />

      {attachments.length > 0 ? (
        <ul className="attachment-list" aria-live="polite">
          {attachments.map((attachment) => {
            const isUploading = attachment.status === "uploading";
            const hasError = attachment.status === "error";

            return (
              <li key={attachment.localId} className="attachment-item">
                <div className="attachment-main">
                  {isUploading ? (
                    <LoaderCircle
                      className="attachment-spinner"
                      size={16}
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      className="attachment-status-dot"
                      aria-hidden="true"
                    />
                  )}
                  <span className="attachment-name">{attachment.filename}</span>
                </div>

                <div className="attachment-meta">
                  {isUploading ? (
                    <span className="attachment-progress">
                      {attachment.progress}%
                    </span>
                  ) : null}
                  {hasError ? (
                    <span className="attachment-error">Upload failed</span>
                  ) : null}
                  <button
                    type="button"
                    className="attachment-remove"
                    onClick={() => removeAttachment(attachment.localId)}
                    aria-label={`Remove ${attachment.filename}`}
                  >
                    <X size={14} strokeWidth={2.4} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="composer-controls">
        <input
          id="composer-attachment-input"
          ref={fileInputRef}
          type="file"
          className="attachment-input"
          onChange={handleFileSelection}
        />
        <button
          type="button"
          className="attach-button"
          aria-label="Attach file"
          data-tooltip="Attach file"
          onClick={openFilePicker}
        >
          <Plus size={20} strokeWidth={2} />
        </button>
        <button
          type="submit"
          className="send-button"
          aria-label="Send"
          disabled={!message.trim() || isSubmitting}
        >
          <ArrowUp size={18} strokeWidth={2.3} />
        </button>
      </div>
    </form>
  );
}
