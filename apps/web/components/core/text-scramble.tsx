"use client";

import { useEffect, useState, type ComponentPropsWithoutRef } from "react";

export type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  className?: string;
  trigger?: boolean;
  repeat?: boolean;
  repeatDelay?: number;
} & ComponentPropsWithoutRef<"p">;

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  className,
  trigger = true,
  repeat = false,
  repeatDelay = 4000,
  ...props
}: TextScrambleProps) {
  const [scrambledText, setScrambledText] = useState<string | null>(null);

  useEffect(() => {
    if (!trigger) return;
    let timer: number | undefined;
    let cancelled = false;

    const startScramble = () => {
      const steps = Math.max(1, Math.ceil(duration / speed));
      let step = 0;

      const tick = () => {
        if (cancelled) return;
        const progress = step / steps;
        let next = "";

        for (let index = 0; index < children.length; index += 1) {
          const character = children[index];
          if (/\s/.test(character) || progress * children.length > index) next += character;
          else next += characterSet[Math.floor(Math.random() * characterSet.length)];
        }

        setScrambledText(next);
        if (step >= steps) {
          timer = window.setTimeout(() => {
            if (cancelled) return;
            setScrambledText(null);
            if (repeat) startScramble();
          }, repeatDelay);
          return;
        }

        step += 1;
        timer = window.setTimeout(tick, speed * 1000);
      };

      timer = window.setTimeout(tick, 0);
    };

    startScramble();
    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [characterSet, children, duration, repeat, repeatDelay, speed, trigger]);

  return <p className={className} {...props}>{scrambledText ?? children}</p>;
}
