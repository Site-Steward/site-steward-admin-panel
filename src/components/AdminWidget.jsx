import { use, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import client from "../util/siteStewardApiClient.js";

import StewardWindow from "./StewardWindow/StewardWindow.jsx";
import LoginView from "./LoginView/LoginView.jsx";
import TaskView from "./TaskView/TaskView.jsx";
import ToggleButton from "./ToggleButton/ToggleButton.jsx";
import LogoutView from "./LogoutView/LogoutView.jsx";
import AsideMenu from "./AsideMenu/AsideMenu.jsx";

import "./AdminWidget.css";

export function AdminWidget() {
  const location = useLocation();
  const navigate = useNavigate();
  const [widgetState, setWidgetState] = useState(getStoredState());
  const [currentView, setCurrentView] = useState({type: "login"});

  // Activate on when /admin route detected; the consumer must make this
  // route navigable, typically as an alternate path to home "/"
  useEffect(() => {
    if (location.pathname !== "/admin") {
      activateWidget({ setWidgetState, navigate });
    }
  }, [location.pathname, navigate]);

  if (!widgetState.activated) {
    return null;
  }

  if (widgetState.minimized) {
    return (
      <ToggleButton
        onClick={() => updateWidgetState({ minimized: false }, setWidgetState)}
      />
    );
  }

  let displayView, showSidebar;
  switch (currentView.type) {
    case "task":
      displayView = <TaskView taskId={currentView.taskId} />;
      showSidebar = true;
      break;

    case "logout":
      displayView = (
        <LogoutView
          onConfirmed={() => deactivateWidget({ setWidgetState })}
          onCancel={() => setCurrentView({ type: "task" })}
        />
      );
      showSidebar = false;
      break;

    case "login":
    default:
      displayView = (
        <LoginView onSuccess={() => setCurrentView({ type: "task" })} />
      );
      showSidebar = false;
      break;
  }

  return (
    <StewardWindow
      extraClasses={`${currentView.type}-view`}
      sidebar={
        showSidebar ? (
          <aside>
            <AsideMenu onSelect={(view) => setCurrentView(view)} />
          </aside>
        ) : null
      }
      displayView={<main>{displayView}</main>}
      onMinimize={() => updateWidgetState(
        { minimized: true }, setWidgetState)
      }
      onClose={() => {
        if (currentView.type === "logout") {
          // If we're on the logout confirmation view, interpret closing
          // the widget as confirming logout.
          deactivateWidget({ setWidgetState });
        } else {
          setCurrentView({ type: "logout" });
        }
      }}
    />
  );
}


function updateWidgetState(patchObject, setWidgetState) {
  setWidgetState((prev) => {
    const newState = { ...prev, ...patchObject };
    localStorage.setItem("steward_widget_state", JSON.stringify(newState));
    return newState;
  });
}

function getStoredState() {
  const jsonSerialized = localStorage.getItem("steward_widget_state");
  if (jsonSerialized) {
    return JSON.parse(jsonSerialized);
  }
  return { activated: false, minimized: false };
}


/**
 * Enables widget overlay on all pages, persisting across browser
 * sessions until explicitly deactivated by user.
 */
async function activateWidget({ setWidgetState, navigate }) {
  localStorage.setItem("admin_open", "true");
  updateWidgetState({ activated: true }, setWidgetState);
  navigate("/", { replace: true });
}

/**
 * Fire and forget a logout call to clear session cookie and hide
 * overlay.
 */
async function deactivateWidget({ setWidgetState }) {
  /* don't await returned Promise */
  void client.logout().catch((err) => {
    console.error("Logout failed", err);
  });

  updateWidgetState({ activated: false }, setWidgetState);
  localStorage.setItem("admin_open", "false");
}

async function handleLogin({ email, password }) {
  try {
    await client.loginWithPassword(email, password);
    updateWidgetState({ loggedIn: true }, setWidgetState);
  } catch (err) {
    console.error("Login failed", err);
    throw err;
  }
}
