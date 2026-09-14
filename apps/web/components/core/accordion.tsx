"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
  type Variant,
} from "motion/react";
import {
  createContext,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type Key,
  type ReactNode,
} from "react";

type AccordionVariants = { expanded: Variant; collapsed: Variant };
type AccordionContextValue = {
  expandedValue: Key | null;
  toggleItem: (value: Key) => void;
  variants?: AccordionVariants;
};
type AccordionItemContextValue = { value: Key; panelId: string };

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);
const AccordionItemContext = createContext<AccordionItemContextValue | undefined>(undefined);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("Accordion components must be nested inside Accordion.");
  return context;
}

function useAccordionItem() {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error("AccordionTrigger and AccordionContent must be nested inside AccordionItem.");
  return context;
}

export type AccordionProps = HTMLAttributes<HTMLDivElement> & {
  transition?: Transition;
  variants?: AccordionVariants;
  expandedValue?: Key | null;
  onValueChange?: (value: Key | null) => void;
};

export function Accordion({
  children,
  className,
  transition,
  variants,
  expandedValue: controlledValue,
  onValueChange,
  ...props
}: AccordionProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<Key | null>(null);
  const expandedValue = controlledValue === undefined ? uncontrolledValue : controlledValue;
  const toggleItem = (value: Key) => {
    const nextValue = expandedValue === value ? null : value;
    if (controlledValue === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <MotionConfig transition={transition}>
      <AccordionContext.Provider value={{ expandedValue, toggleItem, variants }}>
        <div aria-orientation="vertical" className={className} {...props}>{children}</div>
      </AccordionContext.Provider>
    </MotionConfig>
  );
}

export type AccordionItemProps = HTMLAttributes<HTMLDivElement> & { value: Key };

export function AccordionItem({ children, className, value, ...props }: AccordionItemProps) {
  const { expandedValue } = useAccordion();
  const itemId = useId();
  const expanded = expandedValue === value;

  return (
    <AccordionItemContext.Provider value={{ value, panelId: `accordion-panel-${itemId}` }}>
      <div className={className} data-closed={!expanded || undefined} data-expanded={expanded || undefined} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export type AccordionTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function AccordionTrigger({ children, onClick, ...props }: AccordionTriggerProps) {
  const { expandedValue, toggleItem } = useAccordion();
  const { value, panelId } = useAccordionItem();
  const expanded = expandedValue === value;

  return (
    <button
      aria-controls={panelId}
      aria-expanded={expanded}
      data-closed={!expanded || undefined}
      data-expanded={expanded || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggleItem(value);
      }}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

export type AccordionContentProps = { children: ReactNode; className?: string };

export function AccordionContent({ children, className }: AccordionContentProps) {
  const { expandedValue, variants } = useAccordion();
  const { value, panelId } = useAccordionItem();
  const expanded = expandedValue === value;
  const animationVariants: AccordionVariants = {
    expanded: { height: "auto", opacity: 1, ...variants?.expanded },
    collapsed: { height: 0, opacity: 0, ...variants?.collapsed },
  };

  return (
    <AnimatePresence initial={false}>
      {expanded ? (
        <motion.div animate="expanded" className={className} id={panelId} initial="collapsed" role="region" variants={animationVariants}>
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
