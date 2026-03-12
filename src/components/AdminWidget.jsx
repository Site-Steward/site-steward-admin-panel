import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import client from "../util/siteStewardApiClient.js";

import StewardWindow from "./StewardWindow/StewardWindow.jsx";
import AuthView from "./AuthView/AuthView.jsx";
import TaskView from "./TaskView/TaskView.jsx";
import HistoryView from "./HistoryView/HistoryView.jsx";
import ToolsView from "./ToolsView/ToolsView.jsx";
import SettingsView from "./SettingsView/SettingsView.jsx";
import ToggleButton from "./ToggleButton/ToggleButton.jsx";
import ActivityBar from "./ActivityBar/ActivityBar.jsx";

import "../global.css";
import "./AdminWidget.css";

const DEFAULT_WINDOW_SIZE = Object.freeze({
  width: 800,
  height: 600,
});

const DEFAULT_WINDOW_POSITION = Object.freeze({
  right: 120,
  bottom: 120,
});

export function AdminWidget() {
  const location = useLocation();
  const navigate = useNavigate();
  const [widgetState, setWidgetState] = useState(() => getStoredState());
  const [currentView, setCurrentView] = useState({ type: "login" });

  // Activate on when /admin route detected; the consumer must make this
  // route navigable, typically as an alternate path to home "/"
  useEffect(() => {
    if (location.pathname === "/admin" && !widgetState.activated) {
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

  let focalView, showActivityBar, windowAppearance = {};
  switch (currentView.type) {
    case "task":
      focalView = <TaskView taskId={currentView.taskId} />;
      showActivityBar = true;
      break;

    case "history":
      focalView = <HistoryView />;
      showActivityBar = true;
      break;

    case "tools":
      focalView = <ToolsView />;
      showActivityBar = true;
      break;

    case "settings":
      focalView = <SettingsView />;
      showActivityBar = true;
      break;

    case "logout":
      focalView = (
        <AuthView
          isLogout={true}
          onSuccess={() => deactivateWidget({ setWidgetState })}
          onCancel={() => setCurrentView({ type: "task" })}
        />
      );
      showActivityBar = false;
      windowAppearance = {
        toolbar: {
          showMinimize: false,
          showMaximize: false,
          showClose: false,
        },
      };
      break;

    case "login":
    default:
      focalView = (
        <AuthView
          onSuccess={() => setCurrentView({ type: "task" })}
          onCancel={() => deactivateWidget({ setWidgetState })}
        />
      );
      showActivityBar = false;
      windowAppearance = {
        toolbar: {
          showMinimize: false,
          showMaximize: false,
          showClose: true,
        },
      };
      break;
  }

  return (
    <StewardWindow
      appearance={windowAppearance}
      extraClasses={`${currentView.type}-view`}
      activityBar={
        showActivityBar ? (
          <aside>
            <ActivityBar
              activeView={currentView.type}
              onSelect={(view) => setCurrentView(view)}
            />
          </aside>
        ) : null
      }
      focalView={<main>{focalView}</main>}
      windowSize={widgetState.windowSize}
      windowPosition={widgetState.windowPosition}
      onMinimize={() => updateWidgetState({ minimized: true }, setWidgetState)}
      onResize={(windowSize) =>
        updateWidgetState({ windowSize }, setWidgetState)
      }
      onMove={(windowPosition) =>
        updateWidgetState({ windowPosition }, setWidgetState)
      }
      onClose={() => {
        if (
          currentView.type === "logout" ||
          currentView.type === "login") {
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
    const parsed = JSON.parse(jsonSerialized);
    return {
      activated: false,
      minimized: false,
      windowSize: { ...DEFAULT_WINDOW_SIZE },
      windowPosition: { ...DEFAULT_WINDOW_POSITION },
      ...parsed,
      windowSize: {
        ...DEFAULT_WINDOW_SIZE,
        ...(parsed.windowSize ?? {}),
      },
      windowPosition: {
        ...DEFAULT_WINDOW_POSITION,
        ...(parsed.windowPosition ?? {}),
      },
    };
  }
  return {
    activated: false,
    minimized: false,
    windowSize: { ...DEFAULT_WINDOW_SIZE },
    windowPosition: { ...DEFAULT_WINDOW_POSITION },
  };
}

/**
 * Enables widget overlay on all pages, persisting across browser
 * sessions until explicitly deactivated by user.
 */
async function activateWidget({ setWidgetState, navigate }) {
  updateWidgetState({ activated: true }, setWidgetState);
  navigate("/", { replace: true });
}

/**
 * Fire and forget a logout call to clear session cookie and hide
 * overlay.
 */
async function deactivateWidget({ setWidgetState }) {
  updateWidgetState({ activated: false }, setWidgetState);
  await client.logout();
}
