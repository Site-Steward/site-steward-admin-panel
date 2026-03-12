import ApiForm from "../ApiForm/ApiForm.jsx";

export default function LogoutForm({ onConfirmed, onCancel }) {
  return (
    <ApiForm apiMethod="logout" onSuccess={onConfirmed}>
      <div className="button-row">
        <button className="ui" type="submit">Confirm</button>
        <button className="ui secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </ApiForm>
  );
}
