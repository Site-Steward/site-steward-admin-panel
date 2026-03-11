import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Fullscreen, X } from "lucide-react";
import "./StewardWindow.css";

const DEFAULT_WINDOW_SIZE = Object.freeze({
  width: 800,
  height: 600,
});

const WINDOW_MIN_SIZE = Object.freeze({
  width: 400,
  height: 400,
});

const WINDOW_EDGE_OFFSETS = Object.freeze({
  right: 120,
  bottom: 120,
});

const DEFAULT_WINDOW_POSITION = Object.freeze({
  right: WINDOW_EDGE_OFFSETS.right,
  bottom: WINDOW_EDGE_OFFSETS.bottom,
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

function getViewportBoundedPosition(nextPosition, size) {
  if (typeof window === "undefined") {
    return {
      right: Math.max(nextPosition.right, 16),
      bottom: Math.max(nextPosition.bottom, 16),
    };
  }

  const maxRight = Math.max(16, window.innerWidth - size.width - 16);
  const maxBottom = Math.max(16, window.innerHeight - size.height - 16);

  return {
    right: clamp(nextPosition.right, 16, maxRight),
    bottom: clamp(nextPosition.bottom, 16, maxBottom),
  };
}

export default function StewardWindow({
  sidebar = null,
  displayView = null,
  windowSize = DEFAULT_WINDOW_SIZE,
  windowPosition = DEFAULT_WINDOW_POSITION,
  onMinimize,
  onResize,
  onMove,
  onClose,
  extraClasses = "",
}) {
  const [size, setSize] = useState(() => getViewportBoundedSize(windowSize));
  const [activeHandle, setActiveHandle] = useState(null);
  const [position, setPosition] = useState(() =>
    getViewportBoundedPosition(
      windowPosition,
      getViewportBoundedSize(windowSize),
    ),
  );
  const [isDragging, setIsDragging] = useState(false);

  const sizeRef = useRef(size);
  const positionRef = useRef(position);
  const resizeSessionRef = useRef(null);
  const dragSessionRef = useRef(null);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    setSize(getViewportBoundedSize(windowSize));
  }, [windowSize]);

  useEffect(() => {
    setPosition(getViewportBoundedPosition(windowPosition, sizeRef.current));
  }, [windowPosition]);

  useEffect(() => {
    const boundedPosition = getViewportBoundedPosition(
      positionRef.current,
      size,
    );
    if (
      boundedPosition.right !== positionRef.current.right ||
      boundedPosition.bottom !== positionRef.current.bottom
    ) {
      setPosition(boundedPosition);
    }
  }, [size]);

  useEffect(() => {
    if (!activeHandle) return undefined;

    const resizeSession = resizeSessionRef.current;
    if (!resizeSession) return undefined;

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = resizeSession.cursor;
    document.body.style.userSelect = "none";

    const handlePointerMove = (event) => {
      const deltaX = event.clientX - resizeSession.startX;
      const deltaY = event.clientY - resizeSession.startY;

      const dir = resizeSession.direction || "";
      const left = dir.includes("left");
      const right = dir.includes("right");
      const top = dir.includes("top");
      const bottom = dir.includes("bottom");

      let nextWidth = resizeSession.startSize.width;
      let nextHeight = resizeSession.startSize.height;

      if (left && !right) {
        nextWidth = resizeSession.startSize.width - deltaX;
      } else if (right && !left) {
        nextWidth = resizeSession.startSize.width + deltaX;
      }

      if (top && !bottom) {
        nextHeight = resizeSession.startSize.height - deltaY;
      } else if (bottom && !top) {
        nextHeight = resizeSession.startSize.height + deltaY;
      }

      const bounded = getViewportBoundedSize({
        width: nextWidth,
        height: nextHeight,
      });

      const startPos = resizeSession.startPosition || positionRef.current;
      const nextPosition = { ...startPos };

      // If resizing from right/bottom, adjust `right`/`bottom` so the opposite corner stays fixed.
      if (right && !left) {
        const widthDelta = bounded.width - resizeSession.startSize.width;
        nextPosition.right = startPos.right - widthDelta;
      }

      if (bottom && !top) {
        const heightDelta = bounded.height - resizeSession.startSize.height;
        nextPosition.bottom = startPos.bottom - heightDelta;
      }

      const boundedPos = getViewportBoundedPosition(nextPosition, bounded);

      setSize(bounded);
      setPosition(boundedPos);
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
    if (!isDragging) {
      return undefined;
    }

    const dragSession = dragSessionRef.current;
    if (!dragSession) {
      return undefined;
    }

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "move";
    document.body.style.userSelect = "none";

    const handlePointerMove = (event) => {
      const deltaX = event.clientX - dragSession.startX;
      const deltaY = event.clientY - dragSession.startY;

      setPosition(
        getViewportBoundedPosition(
          {
            right: dragSession.startPosition.right - deltaX,
            bottom: dragSession.startPosition.bottom - deltaY,
          },
          sizeRef.current,
        ),
      );
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      dragSessionRef.current = null;
      onMove?.(positionRef.current);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
    };
  }, [isDragging, onMove]);

  useEffect(() => {
    const handleViewportResize = () => {
      const boundedSize = getViewportBoundedSize(sizeRef.current);
      const boundedPosition = getViewportBoundedPosition(
        positionRef.current,
        boundedSize,
      );
      sizeRef.current = boundedSize;
      positionRef.current = boundedPosition;
      setSize(boundedSize);
      setPosition(boundedPosition);
    };

    window.addEventListener("resize", handleViewportResize);
    return () => window.removeEventListener("resize", handleViewportResize);
  }, []);

  const resizeHandleProps = useMemo(() => {
    const cursorMap = {
      top: "ns-resize",
      right: "ew-resize",
      bottom: "ns-resize",
      left: "ew-resize",
      "top-left": "nwse-resize",
      "top-right": "nesw-resize",
      "bottom-right": "nwse-resize",
      "bottom-left": "nesw-resize",
    };

    return RESIZE_HANDLES.map((direction) => ({
      direction,
      className: `resize-handle resize-handle-${direction}`,
      cursor: cursorMap[direction] || "default",
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
      startSize: { ...sizeRef.current },
      startPosition: positionRef.current,
    };
    setActiveHandle(direction);
  };

  const handleDragStart = (event) => {
    if (event.target.closest("button")) {
      return;
    }

    event.preventDefault();

    dragSessionRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startPosition: positionRef.current,
    };
    setIsDragging(true);
  };

  return (
    <div
      className={`steward-window ${extraClasses} ${activeHandle ? "is-resizing" : ""} ${isDragging ? "is-dragging" : ""}`}
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        right: `${position.right}px`,
        bottom: `${position.bottom}px`,
      }}
    >
      {resizeHandleProps.map(({ direction, className, cursor }) => (
        <div
          key={direction}
          className={className}
          onPointerDown={handleResizeStart(direction, cursor)}
        />
      ))}
      <div className="titlebar" onPointerDown={handleDragStart}>
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
