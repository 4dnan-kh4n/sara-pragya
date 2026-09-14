"use client";

import { useState } from "react";

import { CLINICAL_DISCLAIMER } from "@sara-pragya/contracts";
import { TransitionPanel } from "@/components/core/transition-panel";

const disclaimerItems = [
  {
    title: "What the platform may do",
    content: "Organize verified observations, identify data patterns, expose missing information, and present appropriately qualified research-oriented considerations.",
  },
  {
    title: "What it must not do",
    content: "Diagnose disease from Sāratā, invent clinical values, imply causation from correlation, or replace examination and professional judgment.",
  },
  {
    title: "Required review",
    content: "AI-generated content and extracted document fields must be verified by a qualified healthcare professional before clinical use.",
  },
];

export function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <aside className={compact ? "disclaimer compact" : "disclaimer"} aria-label="Clinical decision-support disclaimer">
      <span className="disclaimer-icon" aria-hidden="true">!</span>
      <div>
        <strong>Clinical decision-support disclaimer</strong>
        <p>{compact ? "Research support only. Not a diagnosis or substitute for qualified clinical judgment." : CLINICAL_DISCLAIMER}</p>
        {!compact && (
          <div className="disclaimer-details">
            <div aria-label="Disclaimer topics" className="disclaimer-tabs" role="tablist">
              {disclaimerItems.map((item, index) => (
                <button
                  aria-controls={`disclaimer-panel-${index}`}
                  aria-selected={activeIndex === index}
                  className={activeIndex === index ? "is-active" : undefined}
                  key={item.title}
                  onClick={() => setActiveIndex(index)}
                  role="tab"
                  type="button"
                >
                  {item.title}
                </button>
              ))}
            </div>
            <div className="disclaimer-panel" id={`disclaimer-panel-${activeIndex}`} role="tabpanel">
              <TransitionPanel
                activeIndex={activeIndex}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                variants={{
                  enter: { opacity: 0, y: -50, filter: "blur(4px)" },
                  center: { opacity: 1, y: 0, filter: "blur(0px)" },
                  exit: { opacity: 0, y: 50, filter: "blur(4px)" },
                }}
              >
                {disclaimerItems.map((item) => (
                  <section key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                  </section>
                ))}
              </TransitionPanel>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
