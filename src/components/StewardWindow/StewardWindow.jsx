import { Minus, Fullscreen, X,  } from "lucide-react";
import "./StewardWindow.css";

export default function StewardWindow({
  sidebar = null,
  displayView = null,
  onMinimize,
  onClose,
  extraClasses = "",
}) {
  // const [value, setValue] = useState("");

  return (
    <div className={`steward-window ${extraClasses}`}>
      <div className="titlebar">
        <h1>Admin Panel</h1>
        <div className="controls">
          <button className="minimize" onClick={onMinimize}><Minus /></button>
          <button className="maximize"><Fullscreen /></button>
          <button className="close" onClick={onClose}><X/></button>
        </div>
      </div>
      {sidebar}
      {displayView}
    </div>
  );
}
