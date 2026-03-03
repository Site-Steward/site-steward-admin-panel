import { useState } from "react";

import VerifyCredentialsForm from "./VerifyCredentialsForm.jsx";
import RequestResetForm from "./RequestResetForm.jsx";

export default function Login({ onLoggedIn }) {
  const [mode, setMode] = useState("loggingIn");

  let body;
  switch (mode) {

    case "loggingIn":
      body = (
        <>
          <VerifyCredentialsForm onVerified={onLoggedIn} />;
          <a href="#" onClick={() => setMode("requestingReset")}>
            Set or reset password
          </a>
        </>
      );
      break;
    
    case "requestingReset":
      body = <RequestResetForm
        onCodeSent={() => setMode("settingPassword")}
      />;
      break;
 
    case "settingPassword":
      body = <SetPasswordForm
        onSetPassword={onLoggedIn /* call sets a session cookie */}
      />;
      break;
  }

  return (
    <div className="login">
      {body}
    </div>
  );
}
