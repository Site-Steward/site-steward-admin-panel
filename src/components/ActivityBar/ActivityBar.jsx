import {
  Plus,
  History,
  Wrench,
  Settings,
} from "lucide-react";

import "./ActivityBar.css";

const VIEW_ITEMS = [
  {
    type: "task",
    label: "New task",
    icon: Plus,
  },
  {
    type: "history",
    label: "History",
    icon: History,
  },
  {
    type: "tools",
    label: "Tools",
    icon: Wrench,
  },
];

export default function ActivityBar({ activeView, onSelect }) {
  return (
    <div className="activity-bar" aria-label="Activity bar">
      <div className="activity-bar-top-items">
        {VIEW_ITEMS.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            type="button"
            className={`activity-bar-item ${activeView === type ? "is-active" : ""}`}
            onClick={() => onSelect?.({ type })}
            aria-label={label}
            title={label}
          >
            <Icon size={20} aria-hidden="true" />
          </button>
        ))}
      </div>

      <button
        type="button"
        className={`activity-bar-item ${activeView === "settings" ? "is-active" : ""}`}
        onClick={() => onSelect?.({ type: "settings" })}
        aria-label="Settings"
        title="Settings"
      >
        <Settings size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
