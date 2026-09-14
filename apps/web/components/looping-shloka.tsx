"use client";

import { useEffect, useState } from "react";

import { TextScramble } from "@/components/core/text-scramble";

type LoopingShlokaProps = {
  children: string;
};

export function LoopingShloka({ children }: LoopingShlokaProps) {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    // 1.2 seconds to resolve the verse, then a comfortable reading pause.
    const timer = window.setInterval(() => setCycle((value) => value + 1), 4000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span>
      <TextScramble
        characterSet=". "
        className="shloka"
        duration={1.2}
        key={cycle}
        lang="sa"
      >
        {children}
      </TextScramble>
    </span>
  );
}
