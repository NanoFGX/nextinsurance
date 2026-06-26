import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, Kanit } from "next/font/google";
import "./globals.css";
import { ProfileProvider } from "@/lib/profile-store";
import AdvisorWidget from "@/components/advisor-widget";

const display = Bricolage_Grotesque({
  variable: "--font-display-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const body = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "NEXTINSURANCE — Complex coverage, simplified by AI",
  description:
    "NEXTINSURANCE, in collaboration with Zurich, is an AI insurance advisor that scans Malaysia's biggest insurers — Zurich, AIA, Prudential, Allianz, Great Eastern and more — and ranks plans by a transparent match score. Tell us what you need, compare, and buy in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${kanit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ProfileProvider>
          {children}
          <AdvisorWidget />
        </ProfileProvider>
      </body>
    </html>
  );
}
