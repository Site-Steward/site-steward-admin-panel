import ApiForm from "../ApiForm/ApiForm.jsx";
import Alert from "../Alert/Alert.jsx";
import { useState } from "react";

export default function LogoutForm({ onConfirmed, onCancel }) {
  const [alertMessage, setAlertMessage] = useState(null);

  return (
    <ApiForm
      apiMethod="logout"
      onSuccess={onConfirmed}
      onError={(e) =>
        setAlertMessage({
          severity: "error",
          details: e.userMessage || "Logout failed",
        })
      }
    >
      <div>
        <Alert
          details={alertMessage?.details}
          severity={alertMessage?.severity}
        />
        <div className="button-row">
          <button className="ui" type="submit">
            Confirm
          </button>
          <button className="ui secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </ApiForm>
  );
}
