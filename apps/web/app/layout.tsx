import type { Metadata } from "next";

import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { SiteCursor } from "@/components/site-cursor";
import { SmoothScroll } from "@/components/smooth-scroll";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SARA-PRAGYA · Clinical research intelligence",
    template: "%s · SARA-PRAGYA",
  },
  description:
    "A research-oriented platform connecting classical Dhātu Sāratā observations with objective physiological and clinical parameters.",
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll />
        <SiteCursor>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <AppHeader />
          <div id="main-content">{children}</div>
          <AppFooter />
        </SiteCursor>
      </body>
    </html>
  );
}
