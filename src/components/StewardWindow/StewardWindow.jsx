import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Fullscreen, X } from "lucide-react";
import "./StewardWindow.css";

const DEFAULT_WINDOW_SIZE = Object.freeze({
  width: 800,
  height: 600,
});

const WINDOW_MIN_SIZE = Object.freeze({
  width: 560,
  height: 360,
});

const WINDOW_EDGE_OFFSETS = Object.freeze({
  right: 120,
  bottom: 120,
});

const RESIZE_HANDLES = [
  "top",
  "right",
  "bottom",
  "left",
  "top-left",
  "top-right",
  "bottom-right",
  "bottom-left",
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getViewportBoundedSize(nextSize) {
  if (typeof window === "undefined") {
    return {
      width: Math.max(nextSize.width, WINDOW_MIN_SIZE.width),
      height: Math.max(nextSize.height, WINDOW_MIN_SIZE.height),
    };
  }

  const maxWidth = Math.max(
    WINDOW_MIN_SIZE.width,
    window.innerWidth - WINDOW_EDGE_OFFSETS.right - 16,
  );
  const maxHeight = Math.max(
    WINDOW_MIN_SIZE.height,
    window.innerHeight - WINDOW_EDGE_OFFSETS.bottom - 16,
  );

  return {
    width: clamp(nextSize.width, WINDOW_MIN_SIZE.width, maxWidth),
    height: clamp(nextSize.height, WINDOW_MIN_SIZE.height, maxHeight),
  };
}

export default function StewardWindow({
  sidebar = null,
  displayView = null,
  windowSize = DEFAULT_WINDOW_SIZE,
  onMinimize,
  onResize,
  onClose,
  extraClasses = "",
}) {
  const [size, setSize] = useState(() => getViewportBoundedSize(windowSize));
  const [activeHandle, setActiveHandle] = useState(null);

  const sizeRef = useRef(size);
  const resizeSessionRef = useRef(null);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    setSize(getViewportBoundedSize(windowSize));
  }, [windowSize]);

  useEffect(() => {
    if (!activeHandle) {
      return undefined;
    }

    const resizeSession = resizeSessionRef.current;
    if (!resizeSession) {
      return undefined;
    }

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = resizeSession.cursor;
    document.body.style.userSelect = "none";

    const handlePointerMove = (event) => {
      const deltaX = event.clientX - resizeSession.startX;
      const deltaY = event.clientY - resizeSession.startY;

      let nextWidth = resizeSession.startSize.width;
      let nextHeight = resizeSession.startSize.height;

      if (resizeSession.direction.includes("left")) {
        nextWidth = resizeSession.startSize.width - deltaX;
      }

      if (resizeSession.direction.includes("right")) {
        nextWidth = resizeSession.startSize.width + deltaX;
      }

      if (resizeSession.direction.includes("top")) {
        nextHeight = resizeSession.startSize.height - deltaY;
      }

      if (resizeSession.direction.includes("bottom")) {
        nextHeight = resizeSession.startSize.height + deltaY;
      }

      setSize(getViewportBoundedSize({ width: nextWidth, height: nextHeight }));
    };

    const handlePointerUp = () => {
      setActiveHandle(null);
      resizeSessionRef.current = null;
      onResize?.(sizeRef.current);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
    };
  }, [activeHandle, onResize]);

  useEffect(() => {
    const handleViewportResize = () => {
      const boundedSize = getViewportBoundedSize(sizeRef.current);
      sizeRef.current = boundedSize;
      setSize(boundedSize);
    };

    window.addEventListener("resize", handleViewportResize);
    return () => window.removeEventListener("resize", handleViewportResize);
  }, []);

  const resizeHandleProps = useMemo(() => {
    return RESIZE_HANDLES.map((direction) => ({
      direction,
      className: `resize-handle resize-handle-${direction}`,
      cursor:
        direction.includes("top") || direction.includes("bottom")
          ? direction.includes("left")
            ? "nwse-resize"
            : direction.includes("right")
              ? "nesw-resize"
              : "ns-resize"
          : direction.includes("left") || direction.includes("right")
            ? "ew-resize"
            : "default",
    }));
  }, []);

  const handleResizeStart = (direction, cursor) => (event) => {
    event.preventDefault();
    event.stopPropagation();

    resizeSessionRef.current = {
      direction,
      cursor,
      startX: event.clientX,
      startY: event.clientY,
      startSize: sizeRef.current,
    };
    sizeRef.current = sizeRef.current;
    setActiveHandle(direction);
  };

  return (
    <div
      className={`steward-window ${extraClasses} ${activeHandle ? "is-resizing" : ""}`}
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    >
      {resizeHandleProps.map(({ direction, className, cursor }) => (
        <div
          key={direction}
          className={className}
          onPointerDown={handleResizeStart(direction, cursor)}
        />
      ))}
      <div className="titlebar">
        <h1>Admin Panel</h1>
        <div className="controls">
          <button className="minimize" onClick={onMinimize}>
            <Minus />
          </button>
          <button className="maximize">
            <Fullscreen />
          </button>
          <button className="close" onClick={onClose}>
            <X />
          </button>
        </div>
      </div>
      {sidebar}
      {displayView}
    </div>
  );
}
