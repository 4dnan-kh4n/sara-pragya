"use client";

import { AnimatePresence, motion, type Transition } from "motion/react";
import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

type AnimatedBackgroundChildProps = {
  "data-id": string;
  className?: string;
  children?: ReactNode;
  "data-checked"?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

type AnimatedBackgroundChild = ReactElement<AnimatedBackgroundChildProps>;

export type AnimatedBackgroundProps = {
  children: AnimatedBackgroundChild | AnimatedBackgroundChild[];
  defaultValue?: string;
  onValueChange?: (value: string | null) => void;
  className?: string;
  transition?: Transition;
  enableHover?: boolean;
};

export function AnimatedBackground({
  children,
  defaultValue,
  onValueChange,
  className,
  transition,
  enableHover = false,
}: AnimatedBackgroundProps) {
  const [activeId, setActiveId] = useState<string | null>(defaultValue ?? null);
  const uniqueId = useId();

  const setActive = (value: string | null) => {
    setActiveId(value);
    onValueChange?.(value);
  };

  return Children.map(children as ReactNode, (child, index) => {
    if (!isValidElement(child)) return null;

    const item = child as AnimatedBackgroundChild;
    const id = item.props["data-id"];
    const interactionProps = enableHover
      ? { onMouseEnter: () => setActive(id), onMouseLeave: () => setActive(null) }
      : { onClick: () => setActive(id) };

    return cloneElement(
      item,
      {
        key: index,
        className: ["animated-background-item", item.props.className].filter(Boolean).join(" "),
        "data-checked": activeId === id ? "true" : "false",
        ...interactionProps,
      },
      <>
        <AnimatePresence initial={false}>
          {activeId === id ? (
            <motion.span
              animate={{ opacity: 1 }}
              className={["animated-background-surface", className].filter(Boolean).join(" ")}
              exit={{ opacity: 0 }}
              initial={{ opacity: defaultValue ? 1 : 0 }}
              layoutId={`background-${uniqueId}`}
              transition={transition}
            />
          ) : null}
        </AnimatePresence>
        <span className="animated-background-content">{item.props.children}</span>
      </>,
    );
  });
}
