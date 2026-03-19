import ApiForm from "../ApiForm/ApiForm.jsx";
import Alert from "../Alert/Alert.jsx";
import { useState } from "react";

export default function RequestResetForm({ onCodeSent, onCancel }) {
  const [alertMessage, setAlertMessage] = useState(null);

  return (
    <ApiForm
      apiMethod="requestPasswordReset"
      onSuccess={(callData) => onCodeSent(callData.args.email)}
      onError={(e) =>
        setAlertMessage({
          severity: "error",
          details: e.userMessage || "Request reset failed",
        })
      }
    >
      <div>
        <div>
          <label htmlFor="reset-email">Email</label>
          <input
            id="reset-email"
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <Alert
          details={alertMessage?.details}
          severity={alertMessage?.severity}
        />
        <div className="button-row">
          <button className="ui" type="submit">
            Request reset code
          </button>
          <button className="ui secondary" onClick={onCancel} type="button">
            Back to login
          </button>
        </div>
      </div>
    </ApiForm>
  );
}
