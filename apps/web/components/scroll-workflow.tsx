"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

type WorkflowStep = {
  title: string;
  description: string;
};

export function ScrollWorkflow({ steps }: { steps: WorkflowStep[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [focusedStep, setFocusedStep] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start 80%", "end 25%"] });
  const dropTop = useTransform(scrollYProgress, [0, 1], ["8%", "86%"]);

  useEffect(() => {
    let frame = 0;
    const findFocusedStep = () => {
      const center = window.innerHeight / 2;
      let nearest = { index: -1, distance: Number.POSITIVE_INFINITY };

      nodeRefs.current.forEach((node, index) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - center);
        if (distance < nearest.distance) nearest = { index, distance };
      });

      const nextFocusedStep = nearest.distance < window.innerHeight * 0.32 ? nearest.index : null;
      setFocusedStep((current) => (current === nextFocusedStep ? current : nextFocusedStep));
    };
    const scheduleFocusCheck = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(findFocusedStep);
    };

    scheduleFocusCheck();
    window.addEventListener("scroll", scheduleFocusCheck, { passive: true });
    window.addEventListener("resize", scheduleFocusCheck);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleFocusCheck);
      window.removeEventListener("resize", scheduleFocusCheck);
    };
  }, []);

  return (
    <div className="container workflow-stage" aria-label="Scroll-linked clinical research workflow" ref={stageRef}>
      <div className="workflow-field" aria-hidden="true">
        <span className="vertical-flow-line" />
        <motion.span className="vertical-flow-drop" style={{ top: dropTop }} />
      </div>
      <ol className="vertical-workflow">
        {steps.map((step, index) => {
          const isFocused = focusedStep === index;
          return (
            <li key={step.title}>
              <motion.div
                animate={{ scale: isFocused ? 1.1 : 1 }}
                className={`workflow-node${isFocused ? " is-focused" : ""}`}
                ref={(node) => { nodeRefs.current[index] = node; }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
              >
                <span>Stage</span>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
              </motion.div>
              <article className={`workflow-timeline-card${isFocused ? " is-focused" : ""}`}>
                <span>{`Step ${String(index + 1).padStart(2, "0")}`}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            </li>
          );
        })}
      </ol>
      <div className="workflow-result">
        <span>Output</span>
        <strong>Evidence-aware clinical research</strong>
      </div>
    </div>
  );
}
