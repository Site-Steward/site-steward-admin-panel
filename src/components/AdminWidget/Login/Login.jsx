import { useState } from "react";
import VerifyCredentialsForm from "./VerifyCredentialsForm.jsx";
import RequestResetForm from "./RequestResetForm.jsx";
import SetPasswordForm from "./SetPasswordForm.jsx";

export default function Login({ onSuccess }) {
  const [mode, setMode] = useState("loggingIn");
  const [emailForReset, setEmailForReset] = useState(null);

  let body;
  switch (mode) {
    case "loggingIn":
      body = (
        <div className="space-y-4">
          <VerifyCredentialsForm onVerified={onSuccess} />
          <button
            onClick={() => setMode("requestingReset")}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Set or reset password
          </button>
        </div>
      );
      break;

    case "requestingReset":
      body = (
        <div className="space-y-4">
          <RequestResetForm onCodeSent={(email) => {
            setEmailForReset(email);
            setMode("settingPassword");
          }} />
          <button
            onClick={() => setMode("loggingIn")}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Back to login
          </button>
        </div>
      );
      break;

    case "settingPassword":
      body = (
        <div className="space-y-4">
          <SetPasswordForm email={emailForReset} onSetPassword={onSuccess} />
          <button
            onClick={() => setMode("loggingIn")}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Back to login
          </button>
        </div>
      );
      break;
  }

  return <div className="login">{body}</div>;
}
