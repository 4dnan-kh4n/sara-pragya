"use client";

import { useEffect, type ReactNode } from "react";

import { Cursor } from "@/components/core/cursor";

export function SiteCursor({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.animationRuntime = "ready";
    return () => { delete document.documentElement.dataset.animationRuntime; };
  }, []);

  return (
    <div className="site-cursor-scope">
      <Cursor attachToParent className="site-cursor">
        <div className="site-cursor-pill" />
      </Cursor>
      {children}
    </div>
  );
}
