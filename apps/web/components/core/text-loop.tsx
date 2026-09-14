"use client";

import { AnimatePresence, motion, type Transition, type Variants } from "motion/react";
import { Children, useEffect, useState, type ReactNode } from "react";

type TextLoopProps = {
  children: ReactNode;
  className?: string;
  transition?: Transition;
  variants?: Variants;
};

export function TextLoop({ children, className, transition, variants }: TextLoopProps) {
  const items = Children.toArray(children);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % items.length), 3000);
    return () => window.clearInterval(timer);
  }, [items.length]);

  return (
    <span className={className}>
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          animate="animate"
          exit="exit"
          initial="initial"
          key={activeIndex}
          transition={transition}
          variants={variants}
        >
          {items[activeIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
