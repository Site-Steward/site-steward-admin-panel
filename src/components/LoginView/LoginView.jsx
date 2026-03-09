import { useState } from "react";
import VerifyCredentialsForm from "./VerifyCredentialsForm.jsx";
import RequestResetForm from "./RequestResetForm.jsx";
import SetPasswordForm from "./SetPasswordForm.jsx";
import "./LoginView.css";

export default function LoginView({ onSuccess }) {
  const [mode, setMode] = useState("loggingIn");
  const [emailForReset, setEmailForReset] = useState(null);

  let body;
  switch (mode) {
    case "loggingIn":
      body = (
        <div className="login-view__section">
          <VerifyCredentialsForm onVerified={onSuccess} />
          <button
            className="login-view__secondary-action"
            onClick={() => setMode("requestingReset")}
            type="button"
          >
            Set or reset password
          </button>
        </div>
      );
      break;

    case "requestingReset":
      body = (
        <div className="login-view__section">
          <RequestResetForm
            onCodeSent={(email) => {
              setEmailForReset(email);
              setMode("settingPassword");
            }}
          />
          <button
            className="login-view__secondary-action"
            onClick={() => setMode("loggingIn")}
            type="button"
          >
            Back to login
          </button>
        </div>
      );
      break;

    case "settingPassword":
      body = (
        <div className="login-view__section">
          <SetPasswordForm email={emailForReset} onSetPassword={onSuccess} />
          <button
            className="login-view__secondary-action"
            onClick={() => setMode("loggingIn")}
            type="button"
          >
            Back to login
          </button>
        </div>
      );
      break;
  }

  return <div className="login-view">{body}</div>;
}
