import Link from "next/link";

interface RouteShellProps {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  contextId?: string;
}

export function RouteShell({ eyebrow, title, description, children, contextId }: RouteShellProps) {
  return (
    <main className="route-shell">
      <section className="route-intro container">
        <span className="eyebrow" id={contextId}>{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </section>
      {children}
      <section className="route-return container">
        <Link href="/">← Return to foundation</Link>
      </section>
    </main>
  );
}
