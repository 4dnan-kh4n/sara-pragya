"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    if (reducedMotion.matches || coarsePointer.matches) return;

    const root = document.documentElement;
    const originalScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    let targetScroll = window.scrollY;
    let animationFrame = 0;
    let isAnimating = false;

    const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const clamp = (value: number) => Math.min(Math.max(value, 0), maxScroll());

    const animate = () => {
      const currentScroll = window.scrollY;
      const difference = targetScroll - currentScroll;

      if (Math.abs(difference) < 0.5) {
        window.scrollTo(0, targetScroll);
        isAnimating = false;
        return;
      }

      window.scrollTo(0, currentScroll + difference * 0.1);
      animationFrame = window.requestAnimationFrame(animate);
    };

    const beginAnimation = () => {
      if (isAnimating) return;
      isAnimating = true;
      animationFrame = window.requestAnimationFrame(animate);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;

      event.preventDefault();
      const lineHeight = parseFloat(getComputedStyle(document.body).lineHeight) || 16;
      const delta = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * lineHeight : event.deltaY;
      targetScroll = clamp(targetScroll + delta);
      beginAnimation();
    };

    const onScroll = () => {
      if (!isAnimating) targetScroll = window.scrollY;
    };

    const onAssessmentTransition = (event: Event) => {
      const top = event instanceof CustomEvent && typeof event.detail === "number" ? event.detail : 0;
      window.cancelAnimationFrame(animationFrame);
      isAnimating = false;
      targetScroll = top;
      window.scrollTo(0, top);
    };

    const onAnchorClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
      if (!link || (link.getAttribute("href")?.startsWith("/#") && window.location.pathname !== "/")) return;

      const href = link.getAttribute("href");
      const hash = href?.startsWith("/#") ? href.slice(1) : href;
      if (!hash || hash === "#") return;

      const destination = document.querySelector(hash);
      if (!destination) return;

      event.preventDefault();
      const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0;
      targetScroll = clamp(window.scrollY + destination.getBoundingClientRect().top - headerHeight - 16);
      window.history.pushState(null, "", hash);
      beginAnimation();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("sara-pragya:assessment-transition", onAssessmentTransition);
    document.addEventListener("click", onAnchorClick);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("sara-pragya:assessment-transition", onAssessmentTransition);
      document.removeEventListener("click", onAnchorClick);
      root.style.scrollBehavior = originalScrollBehavior;
    };
  }, []);

  return null;
}
