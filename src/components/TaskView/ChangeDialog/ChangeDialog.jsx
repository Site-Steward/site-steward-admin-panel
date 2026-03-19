import { useState } from "react";

import "./ChangeDialog.css";

export default function ChangeDialog({ task, onAccept, onOpenPreview }) {
  // const [value, setValue] = useState("");

  return (
    <div className="change-dialog card">
      <h2>Website update ready</h2>
      <button onClick={onOpenPreview} className="ui">
        Preview In New Tab
      </button>

      <button onClick={onAccept} className="ui secondary">
        Go Live!
      </button>
    </div>
  );
}
