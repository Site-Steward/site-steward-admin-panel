import { useState } from "react";
import VerifyCredentialsForm from "./VerifyCredentialsForm.jsx";
import RequestResetForm from "./RequestResetForm.jsx";
import SetPasswordForm from "./SetPasswordForm.jsx";
import "./LoginView.css";
import stewardCounterLogo from "../../assets/counter_326x167.png";

export default function LoginView({ onSuccess }) {
  const [mode, setMode] = useState("loggingIn");
  const [emailForReset, setEmailForReset] = useState(null);

  let body;
  switch (mode) {
    case "loggingIn":
      body = (
        <>
          <VerifyCredentialsForm onVerified={onSuccess} />
          <button
            className="secondary"
            onClick={() => setMode("requestingReset")}
            type="button"
          >
            Set or reset password
          </button>
        </>
      );
      break;

    case "requestingReset":
      body = (
        <>
          <RequestResetForm
            onCodeSent={(email) => {
              setEmailForReset(email);
              setMode("settingPassword");
            }}
          />
          <button
            className="secondary"
            onClick={() => setMode("loggingIn")}
            type="button"
          >
            Back to login
          </button>
        </>
      );
      break;

    case "settingPassword":
      body = (
        <>
          <SetPasswordForm email={emailForReset} onSetPassword={onSuccess} />
          <button
            className="secondary"
            onClick={() => setMode("loggingIn")}
            type="button"
          >
            Back to login
          </button>
        </>
      );
      break;
  }

  return (
    <>
      <img
        src={stewardCounterLogo}
        alt="Steward Logo"
        className="logo"
      />
      <h2>Welcome back...</h2>
      {body}
    </>
  );
}
