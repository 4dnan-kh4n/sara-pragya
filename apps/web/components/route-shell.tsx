import Link from "next/link";

import { DisclaimerBanner } from "./disclaimer-banner";

interface RouteShellProps {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  clinical?: boolean;
  contextId?: string;
}

export function RouteShell({ eyebrow, title, description, children, clinical = false, contextId }: RouteShellProps) {
  return (
    <main className="route-shell">
      <section className="route-intro container">
        <span className="eyebrow" id={contextId}>{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {clinical && <DisclaimerBanner compact />}
      </section>
      {children}
      <section className="route-return container">
        <Link href="/">← Return to foundation</Link>
      </section>
    </main>
  );
}
