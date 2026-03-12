import ApiForm from "../ApiForm/ApiForm.jsx";

export default function LogoutForm({ onConfirmed, onCancel }) {
  return (
    <ApiForm apiMethod="logout" onSuccess={onConfirmed}>
      <div style={styles.buttonRow}>
        <button className="ui" type="submit">Confirm</button>
        <button className="ui secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </ApiForm>
  );
}

const styles = {
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "1rem",
  }
};