"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { askAdvisor } from "@/lib/advisor-bus";
import CoverageIcon from "@/components/coverage-icon";

/* score donut for the floating match card (static — always visible) */
function MiniRing({ score }: { score: number }) {
  const size = 66;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const c = 2 * Math.PI * radius;
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }} aria-hidden>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(215,226,234,0.14)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#hero3dGrad)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)}
        />
        <defs>
          <linearGradient id="hero3dGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2e7cf6" />
            <stop offset="100%" stopColor="#00c28e" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tnum font-kanit text-xl font-black leading-none text-white">{score}</span>
        <span className="text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-[#D7E2EA]/55">match</span>
      </span>
    </span>
  );
}

const SCAN = ["Zurich", "AIA", "Prudential", "Allianz", "Great Eastern", "Etiqa", "AXA"];

/**
 * Hero centerpiece — a pointer-driven 3D cockpit. Panels are visible by
 * default (no opacity gating); framer-motion only adds the live tilt toward
 * the cursor and a slow float, so the scene renders reliably in any tab while
 * feeling alive for real visitors. Each panel sits at its own depth via a
 * static translateZ wrapper, separate from the motion shortcuts.
 */
export default function Hero3D() {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 110, damping: 16 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [11, -11]), { stiffness: 110, damping: 16 });

  return (
    <div
      data-testid="hero-3d-scene"
      className="ni-fade-in relative mx-auto aspect-square w-full max-w-[34rem] select-none"
      style={{ perspective: 1200, animationDelay: "0.2s" }}
      onMouseMove={(e) => {
        if (reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {/* glow disc */}
      <div
        className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(46,124,246,0.35), rgba(0,80,212,0.10) 55%, transparent 72%)" }}
      />

      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={reduced ? undefined : { y: [0, -10, 0] }}
        transition={reduced ? undefined : { repeat: Infinity, duration: 7, ease: "easeInOut" }}
      >
        {/* DEPTH -80: orbit ring of coverage icons */}
        <div
          className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D7E2EA]/10"
          style={reduced ? undefined : { transform: "translateZ(-80px)" }}
        >
          {(["health", "life", "motor", "critical"] as const).map((t, i) => {
            const angle = (i / 4) * Math.PI * 2 - Math.PI / 4;
            return (
              <span
                key={t}
                className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-[#D7E2EA]/12 bg-[#0f1729]/80 text-[#6fa8ff] backdrop-blur-sm"
                style={{ left: `${50 + Math.cos(angle) * 50}%`, top: `${50 + Math.sin(angle) * 50}%` }}
              >
                <CoverageIcon type={t} size={22} />
              </span>
            );
          })}
        </div>

        {/* DEPTH -45: provider scan column */}
        <div className="absolute left-0 top-[13%] w-[58%]" style={reduced ? undefined : { transform: "translateZ(-45px)" }}>
          <div className="rounded-2xl border border-[#D7E2EA]/12 bg-[#0d1422]/85 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <p className="font-kanit text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-[#D7E2EA]/45">
              Scanning insurers
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {SCAN.map((name, i) => (
                <span
                  key={name}
                  className={`rounded-full border px-2.5 py-1 font-kanit text-[0.62rem] uppercase tracking-wide ${
                    i < 5 ? "border-[#00c28e]/45 text-[#00c28e]" : "border-[#D7E2EA]/15 text-[#D7E2EA]/40"
                  }`}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* DEPTH 0: the top-match card */}
        <div className="absolute right-0 top-[34%] w-[66%]">
          <div className="rounded-3xl border border-[#2e7cf6]/30 bg-[#101a30]/90 p-5 shadow-[0_36px_90px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <MiniRing score={94} />
              <div className="min-w-0">
                <span className="rounded-full bg-[#00c28e]/15 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-[#00c28e]">
                  Top match
                </span>
                <p className="mt-1 truncate font-kanit text-base font-bold text-white">Zurich MedicalCare</p>
                <p className="text-xs text-[#D7E2EA]/55">Zurich · health</p>
              </div>
              <p className="tnum ml-auto shrink-0 text-right">
                <span className="font-kanit text-xl font-black text-white">RM 312</span>
                <span className="block text-[0.65rem] text-[#D7E2EA]/45">/month</span>
              </p>
            </div>
            <div className="mt-4 space-y-2 border-t border-[#D7E2EA]/10 pt-3.5">
              {([["Budget fit", 28, 30], ["Coverage depth", 25, 25]] as const).map(([label, pts, max]) => (
                <div key={label}>
                  <div className="flex justify-between text-[0.68rem] font-semibold text-[#D7E2EA]/55">
                    <span>{label}</span>
                    <span className="tnum">{pts}/{max}</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#D7E2EA]/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#2e7cf6] to-[#00c28e]" style={{ width: `${(pts / max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DEPTH +70: shield seal */}
        <div className="absolute right-[3%] top-[6%]" style={reduced ? undefined : { transform: "translateZ(70px)" }}>
          <motion.button
            type="button"
            data-testid="hero-shield-seal"
            onClick={() => askAdvisor("How do NEXTAdvisor match scores work?")}
            className="flex h-24 w-24 flex-col items-center justify-center rounded-3xl border border-[#2e7cf6]/40 bg-[#0a1326]/90 text-center shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-md"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            aria-label="How match scores work"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2e7cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span className="mt-1 font-kanit text-[0.5rem] font-semibold uppercase leading-tight tracking-[0.16em] text-[#D7E2EA]/70">
              Scored,<br />not sold
            </span>
          </motion.button>
        </div>

        {/* DEPTH +50: advisor bubble */}
        <div className="absolute bottom-[5%] left-[5%]" style={reduced ? undefined : { transform: "translateZ(50px)" }}>
          <motion.button
            type="button"
            data-testid="hero-advisor-bubble"
            onClick={() => askAdvisor()}
            className="flex items-center gap-2.5 rounded-2xl rounded-bl-md border border-[#D7E2EA]/12 bg-[#0d1422]/90 px-3.5 py-2.5 text-left shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-md"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2e7cf6]/20 text-[#6fa8ff]" aria-hidden>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4L12 2z" />
              </svg>
            </span>
            <span className="font-kanit text-xs font-semibold text-[#D7E2EA]/85">
              Ask NEXTAdvisor anything
            </span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
