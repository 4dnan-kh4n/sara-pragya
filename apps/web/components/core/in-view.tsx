"use client";

import { motion, useInView, type Transition, type UseInViewOptions, type Variant } from "motion/react";
import { useRef, useState, type ReactNode } from "react";

export type InViewProps = {
  children: ReactNode;
  variants?: { hidden: Variant; visible: Variant };
  transition?: Transition;
  viewOptions?: UseInViewOptions;
  once?: boolean;
};

export function InView({
  children,
  variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  transition,
  viewOptions,
  once,
}: InViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, viewOptions);
  const [viewed, setViewed] = useState(false);

  return (
    <motion.div
      animate={inView || viewed ? "visible" : "hidden"}
      initial="hidden"
      onAnimationComplete={() => { if (once && inView) setViewed(true); }}
      ref={ref}
      transition={transition}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
