import Link from "next/link";

import { AboutPillars } from "@/components/about-pillars";
import { LoopingShloka } from "@/components/looping-shloka";
import { TextLoop } from "@/components/core/text-loop";
import { FaqAccordion } from "@/components/faq-accordion";
import { ScrollWorkflow } from "@/components/scroll-workflow";

const pillars = [
  {
    number: "01",
    title: "Classical Sāratā",
    description:
      "Structured observations are retained in their Ayurvedic context.",
  },
  {
    number: "02",
    title: "Verified clinical data",
    description:
      "Clinical history, examination, laboratory values, and physiology remain reviewable before analysis.",
  },
  {
    number: "03",
    title: "Research-first insight",
    description:
      "The platform distinguishes observed data, calculated correlation, and preliminary interpretation.",
  },
];

const workflowSteps = [
  { title: "Classical profile", description: "Record Dhātu Sāratā observations in their clinical and Ayurvedic context." },
  { title: "Clinical record", description: "Bring together reviewable history, examination, laboratory, and physiology data." },
  { title: "Human verification", description: "Keep missing fields and reviewer checks explicit before any analysis proceeds." },
  { title: "Cross-domain correlation", description: "Explore measured associations across the verified research dataset." },
  { title: "Research insight", description: "Present evidence-aware outputs for research interpretation." },
];

export default function HomePage() {
  return (
    <main>
      <section className="landing-hero" id="home">
        <div className="hero-noise" aria-hidden="true" />
        <div className="container hero-grid landing-hero-grid">
          <div className="hero-copy">
            <LoopingShloka>
              {"समदोषः समाग्निश्च समधातुमलक्रियः ।\nप्रसन्नात्मेन्द्रियमनः स्वस्थ इत्यभिधीयते ॥"}
            </LoopingShloka>
            <p className="shloka-translation">
              “Health is described as balance in doṣa, agni, dhātu and mala, with clarity of self, senses, and mind.”
            </p>
            <div className="hero-title-stage">
              <HeroOrbit mobile />
              <h1>
                Classical <TextLoop
                  className="hero-sarata-loop"
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  variants={{
                    initial: { y: 20, rotateX: 90, opacity: 0, filter: "blur(4px)" },
                    animate: { y: 0, rotateX: 0, opacity: 1, filter: "blur(0px)" },
                    exit: { y: -20, rotateX: -90, opacity: 0, filter: "blur(4px)" },
                  }}
                >
                  <span>Sāratā.</span>
                  <span lang="sa">सारता।</span>
                </TextLoop><br />
                <em>Evidence-informed research.</em>
                <span>Careful insight.</span>
              </h1>
            </div>
            <p className="hero-description">
              SARA-PRAGYA brings classical Dhātu Sāratā observations together with verified physiological and clinical information for responsible prognostic research.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary button-glow" href="/assessment">
                Start assessment <span aria-hidden="true">→</span>
              </Link>
              <a className="button button-secondary" href="#workflow">
                Explore the method
              </a>
            </div>
          </div>

          <HeroOrbit />
        </div>
      </section>

      <section className="landing-section landing-about" id="about">
        <div className="container section-intro">
          <span className="eyebrow">Why SARA-PRAGYA</span>
          <h2>Meaningful clinical insight needs context, evidence, and review.</h2>
          <p>
            Dhātu Sāratā is clinically interesting as one component of a wider assessment. SARA-PRAGYA is designed to study—not presume—how those observations may relate to objective parameters.
          </p>
        </div>
        <AboutPillars pillars={pillars} />
      </section>

      <section className="landing-section landing-workflow" id="workflow">
        <div className="container workflow-heading">
          <div>
            <span className="eyebrow">How the research path works</span>
            <h2>From observation to a reviewable research signal.</h2>
          </div>
          <p>Every stage remains visible. No extracted value or AI interpretation moves forward without human verification.</p>
        </div>
        <ScrollWorkflow steps={workflowSteps} />
      </section>

      <section className="landing-section landing-faq" id="faq">
        <div className="container faq-layout">
          <div className="faq-intro">
            <span className="eyebrow">Common questions</span>
            <h2>Quick answers about SARA-PRAGYA.</h2>
            <p>
              A short guide to classical observation, clinical review, and research insight.
            </p>
          </div>
          <FaqAccordion />
        </div>
      </section>

    </main>
  );
}

function HeroOrbit({ mobile = false }: { mobile?: boolean }) {
  return (
    <div
      aria-hidden={mobile || undefined}
      aria-label={mobile ? undefined : "Animated SARA-PRAGYA correlation illustration"}
      className={`clinical-orbit ${mobile ? "mobile-hero-orbit" : "desktop-hero-orbit"}`}
    >
      <div className="orbit-grid" aria-hidden="true" />
      <div className="orbit-ring ring-one" aria-hidden="true" />
      <div className="orbit-ring ring-two" aria-hidden="true" />
      <div className="orbit-ring ring-three" aria-hidden="true" />
      <span className="orbit-marker marker-one" aria-hidden="true" />
      <span className="orbit-marker marker-two" aria-hidden="true" />
      <span className="orbit-marker marker-three" aria-hidden="true" />
      <div className="orbit-core">
        <span>Dhātu Sāratā</span>
        <strong>×</strong>
        <span>Clinical data</span>
      </div>
      <p className="orbit-caption">A living research pathway</p>
    </div>
  );
}
