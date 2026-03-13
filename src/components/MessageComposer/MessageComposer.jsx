import { ArrowUp, LoaderCircle, Plus, X } from "lucide-react";
import { useRef, useState } from "react";

import api from "../../util/siteStewardApiClient.js";

import "./MessageComposer.css";

export default function MessageComposer() {
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const removeAttachment = (localId) => {
    setAttachments((current) => current.filter((attachment) => attachment.localId !== localId));
  };

  const handleFileSelection = async (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    for (const file of selectedFiles) {
      const localId = crypto.randomUUID();

      setAttachments((current) => [
        ...current,
        {
          localId,
          filename: file.name,
          progress: 0,
          status: "uploading",
        },
      ]);

      try {
        const { asset_id: assetId, signed_put_url: signedPutUrl } = await api.createAsset({
          filename: file.name,
          mime: file.type || "application/octet-stream",
          size: file.size,
        });

        await uploadFileWithProgress({
          file,
          signedPutUrl,
          onProgress: (progress) => {
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
        });

        await api.completeAsset(assetId);

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
      } catch {
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
      }
    }

    event.target.value = "";
  };

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
                    <span className="attachment-status-dot" aria-hidden="true" />
                  )}
                  <span className="attachment-name">{attachment.filename}</span>
                </div>

                <div className="attachment-meta">
                  {isUploading ? (
                    <span className="attachment-progress">{attachment.progress}%</span>
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
        <button type="submit" className="send-button" aria-label="Send">
          <ArrowUp size={18} strokeWidth={2.3} />
        </button>
      </div>
    </form>
  );
}

function uploadFileWithProgress({ file, signedPutUrl, onProgress }) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const percentComplete = Math.round((event.loaded / event.total) * 100);
      onProgress(percentComplete);
    });

    request.addEventListener("load", () => {
      if (request.status >= 200 && request.status < 300) {
        resolve();
        return;
      }

      reject(new Error(`Upload failed with status ${request.status}`));
    });

    request.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    request.open("PUT", signedPutUrl);

    if (file.type) {
      request.setRequestHeader("Content-Type", file.type);
    }

    request.send(file);
  });
}
