"use client";

import { AnimatePresence, motion, type Transition, type Variants } from "motion/react";
import { Children, type ReactNode } from "react";

type TransitionPanelProps = {
  activeIndex: number;
  children: ReactNode;
  transition?: Transition;
  variants?: Variants;
};

const defaultVariants: Variants = {
  enter: { opacity: 0, y: -16, filter: "blur(3px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: 16, filter: "blur(3px)" },
};

export function TransitionPanel({ activeIndex, children, transition, variants = defaultVariants }: TransitionPanelProps) {
  const panels = Children.toArray(children);
  const activePanel = panels[activeIndex];

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        animate="center"
        exit="exit"
        initial="enter"
        key={activeIndex}
        transition={transition}
        variants={variants}
      >
        {activePanel}
      </motion.div>
    </AnimatePresence>
  );
}
