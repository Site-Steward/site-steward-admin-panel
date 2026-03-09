import "./ToggleButton.css";

export default function ToggleButton({ onClick }) {
  return (
    <div className="toggle-button-container">
      <button
        className="toggle-button"
        onClick={onClick}
        aria-label="Toggle"
        type="button"
      />
    </div>
  );
}
