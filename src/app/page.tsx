"use client";

import Link from "next/link";
import AnimatedText from "@/components/landing/animated-text";
import CtaButton from "@/components/landing/cta-button";
import FadeIn from "@/components/landing/fade-in";
import Magnet from "@/components/landing/magnet";
import Marquee from "@/components/landing/marquee";
import StickyCards from "@/components/landing/sticky-cards";
import CoverageIcon from "@/components/coverage-icon";
import { askAdvisor } from "@/lib/advisor-bus";

const INK = "#D7E2EA";

/* ---------- hero centerpiece: magnetic score orb ---------- */

function ScoreOrb() {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div
      className="relative flex aspect-square w-full items-center justify-center rounded-full"
      style={{
        background:
          "radial-gradient(closest-side, rgba(46,124,246,0.28) 0%, rgba(0,80,212,0.12) 55%, transparent 75%)",
      }}
    >
      <div className="absolute inset-[10%] rounded-full border border-[#D7E2EA]/10" />
      <div className="absolute inset-[22%] rounded-full border border-[#D7E2EA]/15" />
      <div
        className="absolute inset-[34%] rounded-full border border-[#D7E2EA]/20"
        style={{ boxShadow: "0 0 80px rgba(46,124,246,0.35), inset 0 0 40px rgba(46,124,246,0.15)" }}
      />
      <div className="relative flex flex-col items-center">
        <div className="relative h-[120px] w-[120px] sm:h-[150px] sm:w-[150px]">
          <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
            <circle cx="55" cy="55" r={r} fill="none" stroke={INK} strokeOpacity="0.12" strokeWidth="6" />
            <circle
              cx="55" cy="55" r={r} fill="none" strokeWidth="6" strokeLinecap="round"
              stroke="url(#orbGrad)" strokeDasharray={c} strokeDashoffset={c * (1 - 0.92)}
            />
            <defs>
              <linearGradient id="orbGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2e7cf6" />
                <stop offset="100%" stopColor="#00c28e" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-kanit text-4xl font-black leading-none text-[#D7E2EA] sm:text-5xl">92</span>
            <span className="font-kanit text-[0.55rem] font-medium uppercase tracking-[0.35em] text-[#D7E2EA]/50">
              match
            </span>
          </div>
        </div>
        <p className="mt-3 font-kanit text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/45">
          scored, not sold
        </p>
      </div>
    </div>
  );
}

/* ---------- corner decoration for About ---------- */

function CornerIcon({ type, tilt }: { type: "health" | "life" | "motor" | "critical"; tilt: number }) {
  return (
    <div
      className="flex aspect-square w-full items-center justify-center rounded-[28%] border border-[#D7E2EA]/10 text-[#2e7cf6]"
      style={{
        transform: `rotate(${tilt}deg)`,
        background: "radial-gradient(120% 120% at 30% 20%, #14233f 0%, #0d1016 60%, #0C0C0C 100%)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5), inset 0 0 40px rgba(46,124,246,0.12)",
      }}
    >
      <CoverageIcon type={type} size={64} className="h-[45%] w-[45%]" />
    </div>
  );
}

/* ---------- features (white section) ---------- */

const FEATURES = [
  {
    n: "01",
    name: "AI Matching",
    body: "NEXTAdvisor scans every partnered provider and scores each plan from 0 to 100 against your life, your budget, and your segment — never against a commission table.",
  },
  {
    n: "02",
    name: "Transparent Scores",
    body: "Every rank ships with its own audit: budget fit, coverage depth, segment match, provider strength, priority alignment. Open the math, argue with it, trust it.",
  },
  {
    n: "03",
    name: "Jargon Decoder",
    body: "Waiting periods, betterment, room and board caps — the clauses that bite are translated into plain words, clause by clause, on every plan page.",
  },
  {
    n: "04",
    name: "Instant Purchase",
    body: "Card, FPX online banking, or e-wallet through the NEXTPay sandbox. From decision to covered in minutes, without a single phone call.",
  },
  {
    n: "05",
    name: "One Dashboard",
    body: "Every policy, premium, renewal, and coverage gap in a single cockpit — with a protection score that tells you exactly where you stand.",
  },
];

export default function Landing() {
  return (
    <div className="bg-[#0C0C0C] font-kanit" style={{ overflowX: "clip" }}>
      {/* ===================== HERO ===================== */}
      <section className="relative flex h-screen flex-col" style={{ overflowX: "clip" }}>
        <FadeIn delay={0} y={-20}>
          <nav
            className="flex items-center justify-between px-6 pt-6 text-sm font-medium uppercase tracking-wider md:px-10 md:pt-8 md:text-lg lg:text-[1.4rem]"
            style={{ color: INK }}
            aria-label="Main"
          >
            <a href="#about" className="transition-opacity duration-200 hover:opacity-70">About</a>
            <a href="#features" className="transition-opacity duration-200 hover:opacity-70">Features</a>
            <Link href="/results" className="transition-opacity duration-200 hover:opacity-70">Plans</Link>
            <button
              type="button"
              onClick={() => askAdvisor()}
              className="uppercase tracking-wider transition-opacity duration-200 hover:opacity-70"
            >
              Advisor
            </button>
          </nav>
        </FadeIn>

        <div className="overflow-hidden">
          <FadeIn delay={0.15} y={40}>
            <h1 className="hero-heading -mt-1 w-full whitespace-nowrap text-center text-[12vw] font-black uppercase leading-none tracking-tight sm:mt-2 md:mt-0">
              Nextinsurance
            </h1>
          </FadeIn>
        </div>

        {/* magnetic centerpiece */}
        <FadeIn
          delay={0.6}
          y={30}
          className="pointer-events-none absolute left-1/2 z-10 w-[280px] -translate-x-1/2 max-sm:top-1/2 max-sm:-translate-y-1/2 sm:bottom-0 sm:w-[360px] md:w-[440px] lg:w-[520px]"
        >
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <ScoreOrb />
          </Magnet>
        </FadeIn>

        <div className="z-20 mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
          <FadeIn delay={0.35} y={20}>
            <p
              className="max-w-[160px] font-light uppercase leading-snug tracking-wide sm:max-w-[220px] md:max-w-[260px]"
              style={{ color: INK, fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
            >
              an AI recommender crafting clarity from Malaysia's most confusing market
            </p>
          </FadeIn>
          <FadeIn delay={0.5} y={20}>
            <CtaButton label="Find my cover" href="/onboard" />
          </FadeIn>
        </div>
      </section>

      {/* ===================== MARQUEE ===================== */}
      <Marquee />

      {/* ===================== ABOUT ===================== */}
      <section id="about" className="relative flex min-h-screen items-center justify-center px-5 py-20 sm:px-8 md:px-10">
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute left-[1%] top-[4%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]">
          <CornerIcon type="health" tilt={-12} />
        </FadeIn>
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] w-[100px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]">
          <CornerIcon type="motor" tilt={8} />
        </FadeIn>
        <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute right-[1%] top-[4%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]">
          <CornerIcon type="life" tilt={10} />
        </FadeIn>
        <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]">
          <CornerIcon type="critical" tilt={-8} />
        </FadeIn>

        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn delay={0} y={40}>
            <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
              The mission
            </h2>
          </FadeIn>
          <AnimatedText
            text="Insurance in Malaysia is sold, not chosen — buried in jargon, pushed on commission, drowned in options. We built an AI that scores every plan against your life and shows you the math. No agents, no bias, no forty-tab research night. Let's get you covered!"
            className="max-w-[560px] text-center font-medium leading-relaxed"
          />
          <div className="mt-6 sm:mt-10 md:mt-14">
            <CtaButton label="Find my cover" href="/onboard" />
          </div>
        </div>
      </section>

      {/* ===================== FEATURES (white) ===================== */}
      <section id="features" className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
        <FadeIn y={40}>
          <h2 className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
            Features
          </h2>
        </FadeIn>
        <div className="mx-auto max-w-5xl">
          {FEATURES.map((f, i) => (
            <FadeIn key={f.n} delay={i * 0.1}>
              <div
                className="flex items-start gap-6 py-8 sm:gap-10 sm:py-10 md:gap-14 md:py-12"
                style={{ borderBottom: "1px solid rgba(12, 12, 12, 0.15)" }}
              >
                <span className="font-black leading-none text-[#0C0C0C]" style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}>
                  {f.n}
                </span>
                <div className="pt-2 md:pt-4">
                  <h3 className="font-medium uppercase text-[#0C0C0C]" style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}>
                    {f.name}
                  </h3>
                  <p className="mt-2 max-w-2xl font-light leading-relaxed text-[#0C0C0C]" style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)", opacity: 0.6 }}>
                    {f.body}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ===================== THE FLOW (sticky cards) ===================== */}
      <section id="flow" className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pb-24 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-28">
        <FadeIn y={40}>
          <h2 className="hero-heading mb-10 text-center font-black uppercase leading-none tracking-tight sm:mb-14 md:mb-20" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
            The flow
          </h2>
        </FadeIn>
        <div className="mx-auto max-w-6xl">
          <StickyCards />
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-[#D7E2EA]/10 bg-[#0C0C0C]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 md:flex-row md:items-center md:px-10">
          <p className="font-kanit text-lg font-bold uppercase tracking-tight" style={{ color: INK }}>
            Next<span className="text-[#2e7cf6]">insurance</span>
          </p>
          <p className="text-sm font-light uppercase tracking-wide text-[#D7E2EA]/50">
            A NEXTGEN Co. prototype · upgrading the industry, through smart innovations
          </p>
        </div>
      </footer>
    </div>
  );
}
