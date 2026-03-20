import "./ChangeDialog.css";

import stewardDeliveryIcon from "@/assets/platter_sm.png";

export default function ChangeDialog({
  previewUrl,
  onAccept,
  onOpenPreview,
  isAccepting = false,
}) {
  // const [value, setValue] = useState("");

  return (
    <div className="change-dialog card">
      <img
        src={stewardDeliveryIcon}
        alt="Icon of steward agent delivering result"
        className="icon"
      />

      <h2 className="title">Website update ready</h2>

      <a
        href={previewUrl}
        onClick={onOpenPreview}
        className="preview ui-button secondary"
        target="_blank"
        rel="noreferrer"
      >
        Preview In New Tab
      </a>

      <button
        onClick={onAccept}
        className="accept ui primary"
        disabled={!onAccept || isAccepting}
      >
        {isAccepting ? "Going Live..." : "Go Live!"}
      </button>
    </div>
  );
}
