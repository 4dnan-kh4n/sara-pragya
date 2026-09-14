"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type CursorProps = {
  children: ReactNode;
  className?: string;
  attachToParent?: boolean;
  onPositionChange?: (x: number, y: number) => void;
};

export function Cursor({
  children,
  className,
  attachToParent,
  onPositionChange,
}: CursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      const parent = cursorRef.current?.parentElement;
      if (attachToParent && parent?.contains(event.target as Node)) {
        parent.style.cursor = "none";
        setVisible(true);
      }
      onPositionChange?.(event.clientX, event.clientY);
    };
    document.addEventListener("mousemove", updatePosition);
    return () => document.removeEventListener("mousemove", updatePosition);
  }, [attachToParent, onPositionChange]);

  useEffect(() => {
    if (!attachToParent || !cursorRef.current?.parentElement) return;
    const parent = cursorRef.current.parentElement;
    const show = () => { parent.style.cursor = "none"; setVisible(true); };
    const hide = () => { parent.style.cursor = "auto"; setVisible(false); };
    parent.addEventListener("mouseenter", show);
    parent.addEventListener("mouseleave", hide);
    return () => {
      parent.removeEventListener("mouseenter", show);
      parent.removeEventListener("mouseleave", hide);
      parent.style.cursor = "auto";
    };
  }, [attachToParent]);

  return (
    <div
      className={["motion-cursor", className].filter(Boolean).join(" ")}
      ref={cursorRef}
      style={{ transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)` }}
    >
      {visible ? children : null}
    </div>
  );
}
