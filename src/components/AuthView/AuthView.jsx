import { useState } from "react";
import VerifyCredentialsForm from "./VerifyCredentialsForm.jsx";
import RequestResetForm from "./RequestResetForm.jsx";
import SetPasswordForm from "./SetPasswordForm.jsx";
import "./AuthView.css";
import stewardCounterLogo from "../../assets/counter_326x167.png";
import LogoutForm from "./LogoutForm.jsx";

export default function AuthView({
  onSuccess,
  onCancel,
  isLogout = false,
}) {
  const [mode, setMode] = useState("loggingIn");
  const [emailForReset, setEmailForReset] = useState(null);

  if (isLogout && mode !== "loggingOut") {
    setMode("loggingOut");
  }

  let body, header;
  switch (mode) {
    case "loggingIn":
      header = "Welcome back...";
      body = (
          <VerifyCredentialsForm
            onVerified={onSuccess} 
            onResetPassword={() => setMode("requestingReset")}
          />
      );
      break;

    case "requestingReset":
      header = "Email verification";
      body = (
          <RequestResetForm
            onCodeSent={(email) => {
              setEmailForReset(email);
              setMode("settingPassword");
            }}
            onCancel={() => setMode("loggingIn")}
          />
      );
      break;

    case "settingPassword":
      header = "Set your new password";
      body = (
        <>
          <SetPasswordForm email={emailForReset} onSetPassword={onSuccess} />
          <button
            className="ui secondary"
            onClick={() => setMode("loggingIn")}
            type="button"
          >
            Back to login
          </button>
        </>
      );
      break;

    case "loggingOut":
      header = "Goodbye...";
      body = <LogoutForm onConfirmed={onSuccess} onCancel={onCancel} />;
      break;
  }

  return (
    <>
      <img src={stewardCounterLogo} alt="Steward Logo" className="logo" />
      <h2>{header}</h2>
      {body}
    </>
  );
}
