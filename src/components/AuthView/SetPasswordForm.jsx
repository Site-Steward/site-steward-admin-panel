import ApiForm from "../ApiForm/ApiForm.jsx";
import Alert from "../Alert/Alert.jsx";
import { useState } from "react";

export default function SetPasswordForm({ email, onSetPassword }) {
  const [alertMessage, setAlertMessage] = useState(null);

  return (
    <ApiForm
      apiMethod="setPassword"
      onSuccess={onSetPassword}
      extraArgs={{ email }}
      onError={(e) =>
        setAlertMessage({
          severity: "error",
          details: e.userMessage || "Set password failed",
        })
      }
    >
      <div>
        <div>
          <label htmlFor="code">Verification Code</label>
          <input
            id="code"
            type="text"
            name="code"
            placeholder="Enter the verification code"
            required
          />
        </div>
        <div>
          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Enter your new password"
            required
          />
        </div>
        <Alert
          details={alertMessage?.details}
          severity={alertMessage?.severity}
        />
        <button className="ui" type="submit">
          Set Password
        </button>
      </div>
    </ApiForm>
  );
}
