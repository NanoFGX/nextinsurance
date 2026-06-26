"use client";

import Link from "next/link";
import Aurora from "@/components/aurora";
import Hero3D from "@/components/hero-3d";
import AnimatedText from "@/components/landing/animated-text";
import CtaButton from "@/components/landing/cta-button";
import FadeIn from "@/components/landing/fade-in";
import Marquee from "@/components/landing/marquee";
import PartnerBadge from "@/components/landing/partner-badge";
import StickyCards from "@/components/landing/sticky-cards";
import CoverageIcon from "@/components/coverage-icon";
import { askAdvisor } from "@/lib/advisor-bus";

const INK = "#D7E2EA";

const INSURERS = [
  "Zurich", "AIA", "Prudential", "Great Eastern", "Allianz",
  "Etiqa", "Takaful Malaysia", "Manulife", "AXA", "MetLife",
];

const COVERAGE = [
  { type: "health" as const, name: "Health & medical", body: "Medical cards from Zurich, AIA, Prudential & more — hospital bills, room rates and panel hospitals, decoded." },
  { type: "life" as const, name: "Life", body: "Term, whole-life and takaful protection that pays your people if you're gone — including hibah structures." },
  { type: "motor" as const, name: "Motor", body: "Comprehensive car & e-hailing cover with agreed value, flood add-ons and NCD protection compared side by side." },
  { type: "critical" as const, name: "Critical illness", body: "Lump-sum payouts on serious diagnosis — early-stage benefits and income replacement built for gig workers." },
];

const FEATURES = [
  { n: "01", name: "AI Matching", body: "NEXTAdvisor scans every partnered insurer — Zurich, AIA, Prudential, Allianz, Great Eastern and more — and scores each plan from 0 to 100 against your life, your budget and your segment. Never against a commission table." },
  { n: "02", name: "Transparent Scores", body: "Every rank ships with its own audit: budget fit, coverage depth, segment match, provider strength, priority alignment. Open the math, argue with it, trust it." },
  { n: "03", name: "Jargon Decoder", body: "Waiting periods, betterment, room-and-board caps — the clauses that bite, translated into plain words clause by clause, on every plan page." },
  { n: "04", name: "Instant Purchase", body: "Card, FPX online banking, or e-wallet through the NEXTPay sandbox. From decision to covered in minutes, without a single phone call." },
  { n: "05", name: "One Dashboard", body: "Every policy, premium, renewal and coverage gap in a single cockpit — with a protection score that tells you exactly where you stand." },
];

const STATS = [
  { value: "RM 0", label: "paid in commissions, ever" },
  { value: "10", label: "real insurers, one ranking" },
  { value: "27", label: "plans scored per scan" },
  { value: "3 min", label: "from clueless to covered" },
];

export default function Landing() {
  return (
    <div className="bg-[#0C0C0C] font-kanit" style={{ overflowX: "clip" }}>
      {/* ===================== HERO ===================== */}
      <section className="relative flex min-h-screen flex-col overflow-hidden">
        <Aurora className="opacity-90" />

        {/* nav */}
        <FadeIn delay={0} y={-16}>
          <nav
            className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 pt-6 md:px-10 md:pt-8"
            aria-label="Main"
          >
            <Link href="/" className="flex items-baseline gap-1" data-testid="nav-logo">
              <span className="font-kanit text-lg font-black uppercase tracking-tight text-white md:text-xl">
                Next<span className="text-[#2e7cf6]">insurance</span>
              </span>
              <span className="ml-1 hidden text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#D7E2EA]/45 sm:inline">
                by NEXTGEN
              </span>
            </Link>
            <div className="hidden items-center gap-7 text-sm font-medium uppercase tracking-wide text-[#D7E2EA]/80 lg:flex">
              <a href="#coverage" className="transition-opacity duration-200 hover:opacity-60" data-testid="nav-coverage">Coverage</a>
              <a href="#features" className="transition-opacity duration-200 hover:opacity-60" data-testid="nav-features">Features</a>
              <Link href="/results" className="transition-opacity duration-200 hover:opacity-60" data-testid="nav-plans">Plans</Link>
              <button type="button" onClick={() => askAdvisor()} className="uppercase transition-opacity duration-200 hover:opacity-60" data-testid="nav-advisor">
                Advisor
              </button>
            </div>
            <div className="flex items-center gap-4">
              <PartnerBadge className="hidden md:inline-flex" />
              <Link href="/onboard" className="btn btn-primary !rounded-full !px-5 text-sm" data-testid="nav-find-cover">
                Find my cover
              </Link>
            </div>
          </nav>
        </FadeIn>

        {/* hero grid */}
        <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 py-12 md:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-0">
          <div className="order-2 lg:order-1">
            <FadeIn delay={0.1} y={24}>
              <PartnerBadge className="md:hidden" />
              <p className="mt-4 flex items-center gap-2 font-kanit text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#6fa8ff]">
                <span className="h-px w-8 bg-[#6fa8ff]/60" /> AI insurance advisor · Malaysia
              </p>
            </FadeIn>
            <FadeIn delay={0.18} y={28}>
              <h1 className="mt-5 font-kanit text-[clamp(2.6rem,6.4vw,5rem)] font-black uppercase leading-[0.95] tracking-tight text-white">
                Complex coverage,
                <br />
                <span className="text-gradient-brand">simplified by AI.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.28} y={24}>
              <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-[#D7E2EA]/70 md:text-lg">
                NEXTAdvisor scans Malaysia&apos;s biggest insurers — <span className="font-semibold text-white">Zurich, AIA, Prudential, Allianz, Great Eastern</span> and more — and ranks every plan by a transparent match score. No agents, no commission bias, no forty-tab research night.
              </p>
            </FadeIn>
            <FadeIn delay={0.4} y={20}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <CtaButton label="Find my cover" href="/onboard" testId="hero-find-cover" />
                <button
                  type="button"
                  onClick={() => askAdvisor()}
                  data-testid="hero-talk-advisor"
                  className="inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/25 px-6 py-3.5 font-kanit text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-150 hover:border-[#2e7cf6] hover:bg-[#2e7cf6]/10 active:scale-[0.97]"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4L12 2z" />
                  </svg>
                  Talk to NEXTAdvisor
                </button>
              </div>
            </FadeIn>
            <FadeIn delay={0.5} y={16}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.75rem] font-medium uppercase tracking-wider text-[#D7E2EA]/45">
                <span className="flex items-center gap-1.5"><Dot /> Zero agent bias</span>
                <span className="flex items-center gap-1.5"><Dot /> 10 partnered insurers</span>
                <span className="flex items-center gap-1.5"><Dot /> Scored, not sold</span>
              </div>
            </FadeIn>
          </div>

          <div className="order-1 lg:order-2">
            <Hero3D />
          </div>
        </div>
      </section>

      {/* ===================== INSURER TRUST STRIP ===================== */}
      <section className="relative z-10 border-y border-[#D7E2EA]/10 bg-[#0a0d14] py-10" aria-label="Partnered insurers">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <FadeIn>
            <p className="text-center font-kanit text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#D7E2EA]/40">
              One transparent ranking across Malaysia&apos;s most trusted insurers
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 md:gap-x-12">
              {INSURERS.map((name) => (
                <span
                  key={name}
                  className={`font-kanit text-lg font-bold uppercase tracking-wide transition-colors md:text-2xl ${
                    name === "Zurich" ? "text-[#6fa8ff]" : "text-[#D7E2EA]/55"
                  }`}
                >
                  {name}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===================== COVERAGE TYPES ===================== */}
      <section id="coverage" className="relative bg-[#0C0C0C] px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <p className="font-kanit text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#6fa8ff]">
              What we cover
            </p>
            <h2 className="mt-3 max-w-2xl font-kanit text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-none tracking-tight text-white">
              Four kinds of protection. One AI that gets them.
            </h2>
          </FadeIn>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COVERAGE.map((c, i) => (
              <FadeIn key={c.type} delay={i * 0.08}>
                <div
                  className="group h-full rounded-3xl border border-[#D7E2EA]/10 bg-gradient-to-b from-[#11192b] to-[#0c0f17] p-6 transition-colors duration-200 hover:border-[#2e7cf6]/50"
                  data-testid={`coverage-card-${c.type}`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2e7cf6]/12 text-[#6fa8ff] transition-colors group-hover:bg-[#2e7cf6]/20">
                    <CoverageIcon type={c.type} size={26} />
                  </span>
                  <h3 className="mt-5 font-kanit text-xl font-bold uppercase text-white">{c.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#D7E2EA]/55">{c.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PRODUCT MARQUEE ===================== */}
      <Marquee />

      {/* ===================== MISSION ===================== */}
      <section id="about" className="relative flex min-h-screen items-center justify-center px-5 py-24 md:px-10">
        <div className="flex flex-col items-center gap-10 sm:gap-14">
          <FadeIn y={40}>
            <h2 className="hero-heading text-center font-kanit font-black uppercase leading-none tracking-tight" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
              The mission
            </h2>
          </FadeIn>
          <AnimatedText
            text="Insurance in Malaysia is sold, not chosen — buried in jargon, pushed on commission, drowned in options. So NEXTGEN teamed up with Zurich to build an AI that scores every plan against your life and shows you the math. No agents, no bias, no forty-tab research night. Let's get you covered."
            className="max-w-[620px] text-center font-medium leading-relaxed text-[#D7E2EA]"
          />
          <FadeIn delay={0.1}>
            <CtaButton label="Find my cover" href="/onboard" testId="mission-find-cover" />
          </FadeIn>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section id="features" className="rounded-t-[40px] bg-white px-5 py-24 sm:rounded-t-[60px] md:px-10 md:py-32">
        <div className="mx-auto max-w-5xl">
          <FadeIn y={30}>
            <h2 className="mb-16 text-center font-kanit font-black uppercase leading-none tracking-tight text-[#0C0C0C] md:mb-24" style={{ fontSize: "clamp(3rem, 12vw, 150px)" }}>
              Features
            </h2>
          </FadeIn>
          {FEATURES.map((f, i) => (
            <FadeIn key={f.n} delay={i * 0.08}>
              <div className="flex items-start gap-6 border-b border-[#0C0C0C]/15 py-8 sm:gap-10 sm:py-10 md:gap-14 md:py-12">
                <span className="font-kanit font-black leading-none text-[#0C0C0C]" style={{ fontSize: "clamp(3rem, 10vw, 130px)" }}>
                  {f.n}
                </span>
                <div className="pt-2 md:pt-4">
                  <h3 className="font-kanit font-medium uppercase text-[#0C0C0C]" style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}>
                    {f.name}
                  </h3>
                  <p className="mt-2 max-w-2xl font-kanit font-light leading-relaxed text-[#0C0C0C]/60" style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.2rem)" }}>
                    {f.body}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ===================== THE FLOW ===================== */}
      <section id="flow" className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pb-24 pt-20 sm:-mt-12 sm:rounded-t-[60px] md:px-10 md:pt-28">
        <FadeIn y={30}>
          <h2 className="hero-heading mb-12 text-center font-kanit font-black uppercase leading-none tracking-tight md:mb-20" style={{ fontSize: "clamp(3rem, 12vw, 150px)" }}>
            The flow
          </h2>
        </FadeIn>
        <div className="mx-auto max-w-6xl">
          <StickyCards />
        </div>
      </section>

      {/* ===================== THE FILM ===================== */}
      <section id="film" className="relative bg-[#0a0d14] px-5 py-24 md:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <FadeIn>
            <p className="font-kanit text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#6fa8ff]">
              The film
            </p>
            <h2 className="mt-3 font-kanit text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-none tracking-tight text-white">
              See NEXTINSURANCE in 30 seconds
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="mt-10 overflow-hidden rounded-3xl border border-[#2e7cf6]/25 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
              <video
                data-testid="promo-video"
                className="aspect-video w-full bg-black"
                controls
                playsInline
                preload="none"
                poster="/promo-poster.jpg"
              >
                <source src="/promo.mp4" type="video/mp4" />
              </video>
            </div>
            <a
              href="/promo.mp4"
              download
              data-testid="promo-download"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/25 px-6 py-3 font-kanit text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:border-[#2e7cf6] hover:bg-[#2e7cf6]/10"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
              </svg>
              Download the film (MP4)
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ===================== ZURICH COLLABORATION ===================== */}
      <section className="relative overflow-hidden bg-[#0a0d14] px-5 py-24 md:px-10">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[36px] border border-[#2e7cf6]/25 bg-gradient-to-br from-[#0e1a36] via-[#0b1322] to-[#0a0d14] p-8 md:p-14">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#2e7cf6]/20 blur-3xl" aria-hidden />
              <div className="relative">
                <PartnerBadge />
                <h2 className="mt-6 max-w-3xl font-kanit text-[clamp(1.8rem,4.5vw,3.2rem)] font-black uppercase leading-tight tracking-tight text-white">
                  Built by NEXTGEN, powered by an AI brain, in collaboration with Zurich.
                </h2>
                <p className="mt-5 max-w-2xl text-[#D7E2EA]/65 leading-relaxed">
                  NEXTINSURANCE is a NEXTGEN Co. venture developed with <span className="font-semibold text-white">Zurich</span> and academic support from Universiti Putra Malaysia (UPM). Our promise is simple: bias-free advice that scans real insurers, decodes the fine print, and ranks plans by transparent score — so every Malaysian can choose cover with confidence.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/onboard" className="btn btn-primary !rounded-full !px-6 py-3" data-testid="collab-get-started">
                    Get protected
                  </Link>
                  <button type="button" onClick={() => askAdvisor("What makes NEXTINSURANCE different from an insurance agent?")} className="btn btn-secondary !rounded-full !px-6 py-3" data-testid="collab-ask">
                    Ask the advisor
                  </button>
                </div>
                <p className="mt-8 text-xs uppercase tracking-wider text-[#D7E2EA]/35">
                  NEXTGEN Co. × Zurich × Universiti Putra Malaysia · Supervising lecturer: Ts. Dr. Rozi Nor Haizan Nor
                </p>
              </div>
            </div>
          </FadeIn>

          {/* stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.08}>
                <div className="rounded-2xl border border-[#D7E2EA]/10 bg-[#0c0f17] p-6 text-center">
                  <p className="text-gradient-brand font-kanit text-3xl font-black md:text-4xl">{s.value}</p>
                  <p className="mt-2 text-[0.72rem] font-medium uppercase tracking-wider text-[#D7E2EA]/45">{s.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-[#D7E2EA]/10 bg-[#0C0C0C]">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="font-kanit text-xl font-black uppercase tracking-tight text-white">
                Next<span className="text-[#2e7cf6]">insurance</span>
              </p>
              <p className="mt-1 text-sm font-light uppercase tracking-wide text-[#D7E2EA]/45">
                A NEXTGEN Co. prototype · in collaboration with Zurich
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm font-medium uppercase tracking-wide text-[#D7E2EA]/55">
              <a href="#coverage" className="hover:text-white">Coverage</a>
              <a href="#features" className="hover:text-white">Features</a>
              <Link href="/results" className="hover:text-white">Plans</Link>
              <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            </div>
          </div>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-[#D7E2EA]/35">
            Disclaimer: Insurer names and product families shown are real and used for an educational student prototype. Premiums, limits and panel figures are illustrative, not live quotes, and NEXTINSURANCE is not an appointed agent of any insurer. Always confirm details with the insurer before purchasing.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Dot() {
  return <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00c28e]" aria-hidden />;
}
