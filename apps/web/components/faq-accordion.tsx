"use client";

import { ChevronRight } from "lucide-react";
import { useState, type Key } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/core/accordion";

const questions = [
  {
    value: "purpose",
    question: "What is SARA-PRAGYA designed to do?",
    answer:
      "SARA-PRAGYA is a research and clinical decision-support foundation for studying possible relationships between Dhātu Sāratā observations and verified physiological or clinical information.",
  },
  {
    value: "data",
    question: "What information can be considered in the research pathway?",
    answer:
      "The pathway is designed to preserve classical Sāratā observations alongside reviewable clinical history, examination findings, laboratory values, and physiological measurements when they are available and verified.",
  },
  {
    value: "review",
    question: "How is human review kept in the workflow?",
    answer:
      "Each stage is explicit: information is recorded, checked by an authorised reviewer, and only then made available for correlation or research interpretation. Unverified and missing information remains visible.",
  },
];

export function FaqAccordion() {
  const [expandedValue, setExpandedValue] = useState<Key | null>(null);

  return (
    <Accordion
      className="faq-accordion"
      expandedValue={expandedValue}
      onValueChange={setExpandedValue}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      variants={{
        expanded: { opacity: 1, scale: 1 },
        collapsed: { opacity: 0, scale: 0.7 },
      }}
    >
      {questions.map((item) => (
        <AccordionItem className="faq-item" key={item.value} value={item.value}>
          <h3>
            <AccordionTrigger className="faq-trigger">
              <ChevronRight aria-hidden="true" className="faq-chevron" />
              <span>{item.question}</span>
            </AccordionTrigger>
          </h3>
          <AccordionContent className="faq-content">
            <p>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
