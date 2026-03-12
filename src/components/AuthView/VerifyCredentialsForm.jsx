import ApiForm from "../ApiForm/ApiForm.jsx";
import Alert from "../Alert/Alert.jsx";
import { useState } from "react";

export default function VerifyCredentialsForm({ onVerified, onResetPassword }) {

  const [alertMessage, setAlertMessage] = useState(null);

  return (
    <ApiForm
      apiMethod="loginWithPassword"
      onSuccess={onVerified}
      onError={() => setAlertMessage({
        severity: "error",
        details: "Login failed"
      })}
    >
      <div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="username"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </div>
        <Alert details={alertMessage?.details} severity={alertMessage?.severity} />
        <div className="button-row">
          <button className="ui" type="submit">
            Login
          </button>
          <button
            className="ui secondary"
            onClick={onResetPassword}
            type="button"
          >
            Set or reset password
          </button>
        </div>
      </div>
    </ApiForm>
  );
}
