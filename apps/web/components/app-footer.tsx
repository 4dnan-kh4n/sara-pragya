import Link from "next/link";

import { BrandMark } from "./brand-mark";

export function AppFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <BrandMark />
          <p>Classical observation. Objective parameters. Responsible research.</p>
        </div>
        <div>
          <h2>Platform</h2>
          <Link href="/assessment">Assessment</Link>
          <Link href="/research">Research</Link>
          <Link href="/#workflow">Workflow</Link>
        </div>
        <div>
          <h2>Governance</h2>
          <Link href="/#disclaimer">Clinical disclaimer</Link>
          <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/admin">Administration</Link>
        </div>
        <div className="footer-contact">
          <h2>Contact us</h2>
          <address>Government Forest Hostel, Near 74 Bungalows, Bhopal, M.P. 462003</address>
          <a href="mailto:support@sarapragya.com">support@sarapragya.com</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 SARA-PRAGYA</span>
        <span>Bhopal, M.P. · Research foundation · Phase 1</span>
      </div>
    </footer>
  );
}
