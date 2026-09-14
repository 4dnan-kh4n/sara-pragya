"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="status-page">
      <span className="eyebrow">Something went wrong</span>
      <h1>The page is temporarily unavailable.</h1>
      <p>Your submitted information has not been intentionally discarded. Please try again.</p>
      <button className="button button-primary" onClick={reset} type="button">Try again</button>
    </main>
  );
}
