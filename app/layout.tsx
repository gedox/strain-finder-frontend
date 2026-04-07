import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amsterdam Strain Finder",
  description: "Find which coffeeshop currently stocks your strain. Live data from Amsterdam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Grain overlay */}
        <div className="grain" />

        {/* Ambient orbs */}
        <div
          className="glow-orb"
          style={{
            width: 500, height: 500,
            background: "rgba(200, 240, 96, 0.06)",
            top: -200, right: -100,
          }}
        />
        <div
          className="glow-orb"
          style={{
            width: 400, height: 400,
            background: "rgba(123, 108, 246, 0.07)",
            bottom: -150, left: -100,
            animationDelay: "-7s",
          }}
        />

        <div style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 860,
          margin: "0 auto",
          padding: "clamp(32px, 8vw, 80px) clamp(20px, 5vw, 40px)",
        }}>
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
