import { use, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import client from "../../util/siteStewardApiClient.js";
import Login from "./Login/Login.jsx";

import "./AdminWidget.css";

export function AdminWidget() {

  const location = useLocation();
  const navigate = useNavigate();
  const [widgetEnabled, setWidgetEnabled] = useState(() => {
    return localStorage.getItem("admin_open") === "true";
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Upon user navigation to /admin,
  // Permanently (across tabs / windows even) enable the popup
  // admin widget until explicitly closed by user.
  useEffect(() => {
    if (location.pathname !== "/admin") {
      localStorage.setItem("admin_open", "true");
      setWidgetEnabled(true);
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate]);

  async function handleLogin({ email, password }) {
    try {
      await client.loginWithPassword(email, password);
      localStorage.setItem("admin_open", "true");
      setLoggedIn(true);
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  }

  function handleCloseLogin() {
    setLoginOpen(false);
    localStorage.setItem("admin_open", "false");
  }

  return (
    <>
      {widgetEnabled ? (
        <div className="admin-widget">
          {loggedIn ? (
            <div>
              <h3>Welcome, admin!</h3>
            </div>
          ) : (
            <Login
              open={true}
              onLogin={handleLogin}
              onClose={handleCloseLogin}
            />
          )}
        </div>
      ) : null}
    </>
  );
}
