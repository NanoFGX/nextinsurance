"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { askAdvisor } from "@/lib/advisor-bus";

/* ---------- in-card product visuals (DOM, no images) ---------- */

function OnboardVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr]">
      <div className="rounded-[28px] border border-[#D7E2EA]/15 p-5 sm:rounded-[36px] sm:p-7">
        <p className="font-kanit text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/45">
          What do you want covered?
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[["Health", true], ["Life", false], ["Motor", true], ["Critical illness", true]].map(([label, on]) => (
            <span
              key={label as string}
              className={`rounded-full px-4 py-2 font-kanit text-xs uppercase tracking-wider ${
                on
                  ? "bg-[#2e7cf6]/20 text-[#D7E2EA] outline outline-1 outline-[#2e7cf6]"
                  : "border border-[#D7E2EA]/20 text-[#D7E2EA]/50"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-[28px] border border-[#D7E2EA]/15 p-5 sm:rounded-[36px] sm:p-7">
        <p className="font-kanit text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/45">
          Monthly budget
        </p>
        <p className="mt-3 font-kanit text-4xl font-black text-[#D7E2EA]">RM 260</p>
        <div className="mt-4 h-1.5 rounded-full bg-[#D7E2EA]/10">
          <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-[#0050d4] to-[#00c28e]" />
        </div>
      </div>
    </div>
  );
}

function ScanVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr]">
      <div className="relative flex min-h-[150px] items-center justify-center rounded-[28px] border border-[#D7E2EA]/15 p-5 sm:rounded-[36px]">
        <div className="absolute h-24 w-24 rounded-full border border-[#D7E2EA]/15" />
        <div className="absolute h-16 w-16 rounded-full border border-[#D7E2EA]/20" />
        <motion.div
          className="absolute h-24 w-24 rounded-full motion-reduce:hidden"
          style={{
            background: "conic-gradient(from 0deg, rgba(46,124,246,0.55), transparent 80deg)",
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
        />
        <span className="relative h-2.5 w-2.5 rounded-full bg-[#2e7cf6]" />
      </div>
      <div className="rounded-[28px] border border-[#D7E2EA]/15 p-5 sm:rounded-[36px] sm:p-7">
        <p className="font-kanit text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/45">
          Scanning partnered providers
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Zurich", "AIA", "Prudential", "Allianz", "Great Eastern", "Etiqa"].map((p, i) => (
            <span
              key={p}
              className={`rounded-full border px-3.5 py-1.5 font-kanit text-xs uppercase tracking-wider ${
                i < 5 ? "border-[#00c28e]/50 text-[#00c28e]" : "border-[#D7E2EA]/20 text-[#D7E2EA]/40"
              }`}
            >
              {p}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-[#D7E2EA]/55">27 plans scored against your profile. No commissions in the math.</p>
      </div>
    </div>
  );
}

function DecideVisual() {
  const rows = [
    { name: "Zurich MedicalCare", provider: "Zurich", rm: 312, score: 94 },
    { name: "A-Life Med Regular", provider: "AIA", rm: 95, score: 90 },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-[1.5fr_1fr]">
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div
            key={r.name}
            className="flex items-center justify-between rounded-[28px] border border-[#D7E2EA]/15 px-5 py-4 sm:rounded-[36px] sm:px-7"
          >
            <div className="flex items-center gap-4">
              <span className="font-kanit text-2xl font-black text-[#2e7cf6]">{r.score}</span>
              <div>
                <p className="font-kanit text-base font-semibold uppercase text-[#D7E2EA]">{r.name}</p>
                <p className="text-xs text-[#D7E2EA]/50">{r.provider}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-kanit text-lg font-bold text-[#D7E2EA]">RM {r.rm}</p>
              {i === 0 && (
                <span className="font-kanit text-[0.55rem] uppercase tracking-[0.25em] text-[#00c28e]">top match</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-between rounded-[28px] border border-[#D7E2EA]/15 p-5 sm:rounded-[36px] sm:p-7">
        <p className="font-kanit text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/45">
          NEXTPay sandbox
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["FPX", "Card", "TnG"].map((m) => (
            <span key={m} className="rounded-full border border-[#D7E2EA]/20 px-3.5 py-1.5 font-kanit text-xs uppercase tracking-wider text-[#D7E2EA]/75">
              {m}
            </span>
          ))}
        </div>
        <p className="mt-4 font-kanit text-sm uppercase tracking-wider text-[#00c28e]">You're covered.</p>
      </div>
    </div>
  );
}

/* ---------- stacking cards ---------- */

interface CardDef {
  n: string;
  category: string;
  title: string;
  action: { label: string; href?: string; advisor?: boolean };
  visual: ReactNode;
}

const CARDS: CardDef[] = [
  {
    n: "01",
    category: "Onboard",
    title: "Tell us what you need",
    action: { label: "Start now", href: "/onboard" },
    visual: <OnboardVisual />,
  },
  {
    n: "02",
    category: "AI engine",
    title: "NEXTAdvisor scans the market",
    action: { label: "Meet the advisor", advisor: true },
    visual: <ScanVisual />,
  },
  {
    n: "03",
    category: "Decide",
    title: "Compare and buy instantly",
    action: { label: "See my matches", href: "/results" },
    visual: <DecideVisual />,
  },
];

function Card({
  def,
  index,
  total,
  progress,
}: {
  def: CardDef;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  const ghostBtn =
    "rounded-full border-2 border-[#D7E2EA] px-8 py-3 font-kanit text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-150 hover:bg-[#D7E2EA]/10 active:scale-[0.97] sm:px-10 sm:py-3.5 sm:text-base";

  return (
    <div className="sticky top-24 h-[85vh] md:top-32">
      <motion.div
        style={{ scale, top: `${index * 28}px` }}
        className="relative rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-5 px-2 py-4 sm:px-4">
          <div className="flex items-center gap-5 sm:gap-8">
            <span className="hero-heading font-kanit font-black leading-none" style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}>
              {def.n}
            </span>
            <div>
              <p className="font-kanit text-[0.65rem] font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/50">
                {def.category}
              </p>
              <h3 className="mt-1 font-kanit text-xl font-semibold uppercase text-[#D7E2EA] sm:text-2xl md:text-3xl">
                {def.title}
              </h3>
            </div>
          </div>
          {def.action.advisor ? (
            <button type="button" className={ghostBtn} onClick={() => askAdvisor()}>
              {def.action.label}
            </button>
          ) : (
            <Link href={def.action.href!} className={ghostBtn}>
              {def.action.label}
            </Link>
          )}
        </div>
        <div className="mt-2 px-2 pb-2 sm:px-4 sm:pb-4">{def.visual}</div>
      </motion.div>
    </div>
  );
}

export default function StickyCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef}>
      {CARDS.map((def, i) => (
        <Card key={def.n} def={def} index={i} total={CARDS.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}
