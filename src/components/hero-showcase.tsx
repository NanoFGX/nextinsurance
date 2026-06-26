"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { askAdvisor } from "@/lib/advisor-bus";
import { EASE_OUT } from "./motion-primitives";

/** Static mini score ring for the mock card (no animation dependencies). */
function MiniRing({ score }: { score: number }) {
  const size = 64;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }} aria-hidden>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="color-mix(in oklch, var(--accent), var(--signal) 60%)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.9 }}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tnum font-(family-name:--font-display-var) text-lg font-bold leading-none text-ink">{score}</span>
        <span className="text-[0.5rem] font-semibold uppercase tracking-wider text-ink-3">match</span>
      </span>
    </span>
  );
}

/**
 * Floating product preview in the hero: a real match card + a real
 * NEXTAdvisor exchange, tilting gently toward the pointer.
 */
export default function HeroShowcase() {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 18 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 18 });

  return (
    <motion.div
      className="relative hidden select-none lg:block"
      style={{ perspective: 1100 }}
      onMouseMove={(e) => {
        if (reduced) return;
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.55 }}
    >
      <motion.div
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={reduced ? undefined : { y: [0, -9, 0] }}
        transition={reduced ? undefined : { repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="relative"
      >
        {/* Match card */}
        <div className="card relative z-10 w-[21rem] p-5 shadow-[0_28px_70px_oklch(0_0_0/0.45)]">
          <div className="flex items-center gap-4">
            <MiniRing score={86} />
            <div className="min-w-0">
              <span className="rounded-full bg-signal-soft px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-signal">
                Top match
              </span>
              <p className="mt-1 font-(family-name:--font-display-var) text-base font-bold text-ink">
                FlexiMed Gig
              </p>
              <p className="text-xs text-ink-2">TigerSure · health</p>
            </div>
            <p className="tnum ml-auto shrink-0 text-right">
              <span className="font-(family-name:--font-display-var) text-xl font-extrabold text-ink">RM 76</span>
              <span className="block text-xs text-ink-3">/month</span>
            </p>
          </div>
          <div className="mt-4 space-y-1.5 border-t border-line pt-3.5">
            {[
              ["Budget fit", 27, 30],
              ["Segment match", 20, 20],
            ].map(([label, pts, max]) => (
              <div key={label as string}>
                <div className="flex justify-between text-[0.7rem] font-semibold text-ink-3">
                  <span>{label}</span>
                  <span className="tnum">
                    {pts}/{max}
                  </span>
                </div>
                <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-panel">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${(Number(pts) / Number(max)) * 100}%` }}
                    transition={{ duration: 0.7, ease: EASE_OUT, delay: 1.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisor exchange */}
        <motion.div
          className="card relative z-20 -mt-3 ml-12 w-[19.5rem] p-4 shadow-[0_24px_60px_oklch(0_0_0/0.5)]"
          style={reduced ? undefined : { transform: "translateZ(40px)" }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 1.0 }}
        >
          <p className="ml-auto w-fit rounded-2xl rounded-br-md bg-accent-soft px-3 py-1.5 text-xs text-ink">
            What's a co-payment?
          </p>
          <div className="mt-2 flex items-start gap-2">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent" aria-hidden>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4L12 2z" />
              </svg>
            </span>
            <p className="rounded-2xl rounded-bl-md bg-panel px-3 py-1.5 text-xs leading-relaxed text-ink-2">
              You pay a small share of each hospital bill, capped at RM 800 per stay. The insurer
              covers the rest…
            </p>
          </div>
          <button
            type="button"
            onClick={() => askAdvisor()}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-line py-2 text-xs font-bold text-accent transition-colors duration-150 hover:border-accent hover:bg-accent-soft active:scale-[0.98]"
          >
            Chat with NEXTAdvisor
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
