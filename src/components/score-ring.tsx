"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { EASE_OUT } from "./motion-primitives";

export default function ScoreRing({
  score,
  size = 76,
  stroke = 6,
  label = "match",
}: {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const mv = useMotionValue(0);
  const springy = useSpring(mv, { stiffness: 90, damping: 22 });
  const display = useTransform(springy, (v) => Math.round(v));

  useEffect(() => {
    if (inView) mv.set(score);
  }, [inView, score, mv]);

  // score 0–100 → mix accent → signal
  const mix = Math.max(0, Math.min(100, score));
  const ringColor = `color-mix(in oklch, var(--accent), var(--signal) ${Math.round((mix / 100) * 70)}%)`;

  return (
    <div
      ref={ref}
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${score} out of 100 ${label} score`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--line)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={
            inView
              ? { strokeDashoffset: circumference * (1 - score / 100) }
              : undefined
          }
          transition={{ duration: 0.7, ease: EASE_OUT }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="tnum font-(family-name:--font-display-var) font-bold leading-none text-ink"
          style={{ fontSize: size * 0.3 }}
        >
          {display}
        </motion.span>
        <span className="text-[0.55rem] font-semibold uppercase tracking-wider text-ink-3">
          {label}
        </span>
      </div>
    </div>
  );
}
