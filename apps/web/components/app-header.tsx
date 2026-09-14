"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

import { AnimatedBackground } from "@/components/core/animated-background";

import { BrandMark } from "./brand-mark";

const navigation = [
  { href: "/#about", label: "About" },
  { href: "/#workflow", label: "Workflow" },
  { href: "/research", label: "Research" },
  { href: "/#faq", label: "FAQ" },
];

function closeMobileNavigation(event: MouseEvent<HTMLAnchorElement>) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}

export function AppHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <BrandMark />
        <nav className="desktop-navigation" aria-label="Primary navigation">
          <AnimatedBackground
            className="navbar-hover-background"
            enableHover
            transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
          >
            {navigation.map((item) => (
            <Link data-id={item.label} href={item.href} key={item.href}>
              {item.label}
            </Link>
            ))}
          </AnimatedBackground>
        </nav>
        <Link className="button button-primary desktop-cta" href="/assessment">
          Start assessment <span aria-hidden="true">↗</span>
        </Link>
        <details className="mobile-navigation">
          <summary aria-label="Open navigation menu">
            <span />
            <span />
            <span />
          </summary>
          <nav aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link href={item.href} key={item.href} onClick={closeMobileNavigation}>
                {item.label}
              </Link>
            ))}
            <Link className="button button-primary" href="/assessment" onClick={closeMobileNavigation}>
              Start assessment
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
