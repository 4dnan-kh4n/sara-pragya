"use client";

import { useEffect, useRef, useState } from "react";

type Pillar = { number: string; title: string; description: string };

function ScrollPillar({ pillar, index, progress }: { pillar: Pillar; index: number; progress: number }) {
  // Each card gets a broad, overlapping slice of scroll progress. There is no
  // independent entrance timer: reversing or slowing the scroll does the same
  // to the card motion.
  const start = index * 0.29;
  const end = Math.min(1, start + 0.32);
  const localProgress = Math.max(0, Math.min(1, (progress - start) / (end - start)));
  const y = 42 * (1 - localProgress);
  const scale = 0.94 + 0.06 * localProgress;

  return (
    <article
      className={`pillar pillar-${index + 1}`}
      style={{
        opacity: localProgress,
        filter: `blur(${7 * (1 - localProgress)}px)`,
        transform: `translateY(${y}px) scale(${scale})`,
      }}
    >
      <span>{pillar.number}</span>
      <h3>{pillar.title}</h3>
      <p>{pillar.description}</p>
    </article>
  );
}

export function AboutPillars({ pillars }: { pillars: Pillar[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      // Begin as the row enters view, then let the sequence continue through
      // the card stage so the reveal remains visible while the user scrolls.
      const travelled = viewport * 0.75 - bounds.top;
      // The longer range prevents the complete sequence from firing at once.
      // The value still comes only from native scroll position—no timed delay.
      const distance = Math.max(1, bounds.height * 1.2);
      setProgress(Math.max(0, Math.min(1, travelled / distance)));
    };
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateProgress);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <div className="about-pillar-interaction" ref={sectionRef}>
      <div className="container pillar-grid">
        {pillars.map((pillar, index) => (
          <ScrollPillar
            index={index}
            key={pillar.number}
            pillar={pillar}
            progress={progress}
          />
        ))}
      </div>
    </div>
  );
}
