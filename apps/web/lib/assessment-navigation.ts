export function returnToAssessmentTop() {
  if (typeof window === "undefined") return;

  const context = document.getElementById("assessment-context");
  const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0;
  const top = context
    ? Math.max(0, window.scrollY + context.getBoundingClientRect().top - headerHeight - 16)
    : 0;

  window.dispatchEvent(new CustomEvent("sara-pragya:assessment-transition", { detail: top }));
  window.scrollTo({ top, behavior: "auto" });
  document.documentElement.scrollTop = top;
  document.body.scrollTop = top;
}
