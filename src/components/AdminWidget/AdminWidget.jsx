import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.jsx";
import { Button } from "../ui/button.jsx";
import Login from "./Login/Login.jsx";

import "./AdminWidget.css";

export function AdminWidget() {
  const location = useLocation();
  const navigate = useNavigate();
  const [widgetEnabled, setWidgetEnabled] = useState(() => {
    return localStorage.getItem("admin_open") === "true";
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  // Upon user navigation to /admin,
  // Permanently (across tabs / windows even) enable the popup
  // admin widget until explicitly closed by user.
  useEffect(() => {
    if (location.pathname === "/admin") {
      localStorage.setItem("admin_open", "true");
      setWidgetEnabled(true);
      setLoginDialogOpen(true);
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate]);

  function handleLoginSuccess() {
    localStorage.setItem("admin_open", "true");
    setLoggedIn(true);
    setLoginDialogOpen(false);
  }

  function handleCloseDialog() {
    setLoginDialogOpen(false);
    if (!loggedIn) {
      localStorage.setItem("admin_open", "false");
      setWidgetEnabled(false);
    }
  }

  function handleLogout() {
    setLoggedIn(false);
    setLoginDialogOpen(true);
  }

  return (
    <>
      {widgetEnabled && !loggedIn && (
        <div className="admin-widget">
          <Button
            onClick={() => setLoginDialogOpen(true)}
            variant="default"
            size="sm"
          >
            Admin Panel
          </Button>
        </div>
      )}

      {loggedIn && (
        <div className="admin-widget">
          <div className="admin-welcome">
            <h3>Welcome, admin!</h3>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      )}

      <Dialog open={loginDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Login</DialogTitle>
            <DialogDescription>
              Enter your credentials to access the admin panel.
            </DialogDescription>
          </DialogHeader>
          <Login onSuccess={handleLoginSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}
