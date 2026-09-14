import Link from "next/link";

export default function NotFound() {
  return (
    <main className="status-page">
      <span className="eyebrow">404 · Route not found</span>
      <h1>This pathway is not available.</h1>
      <p>The requested SARA-PRAGYA page could not be found.</p>
      <Link className="button button-primary" href="/">Return home</Link>
    </main>
  );
}
