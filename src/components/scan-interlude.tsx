"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE_OUT } from "./motion-primitives";

const PROVIDERS = [
  "Zurich Malaysia",
  "AIA Malaysia",
  "Prudential",
  "Great Eastern",
  "Allianz",
  "Etiqa Takaful",
];

const STATUS = [
  "Connecting to partnered providers…",
  "Pulling live plan catalogs…",
  "Scoring plans against your profile…",
  "Checking your budget allocation…",
  "Ranking by transparent match score…",
];

export default function ScanInterlude({ onSkip }: { onSkip: () => void }) {
  const [lit, setLit] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const a = setInterval(() => setLit((n) => Math.min(PROVIDERS.length, n + 1)), 330);
    const b = setInterval(() => setStatusIdx((n) => (n + 1) % STATUS.length), 520);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  return (
    <div
      className="flex min-h-[70dvh] flex-col items-center justify-center px-5 text-center"
      role="status"
      aria-live="polite"
    >
      {/* radar */}
      <div className="relative h-44 w-44">
        <div className="absolute inset-0 rounded-full border border-line" />
        <div className="absolute inset-6 rounded-full border border-line" />
        <div className="absolute inset-12 rounded-full border border-line" />
        <motion.div
          className="absolute inset-0 rounded-full motion-reduce:hidden"
          style={{
            background:
              "conic-gradient(from 0deg, oklch(0.72 0.17 252 / 0.5), transparent 70deg)",
            maskImage: "radial-gradient(circle, transparent 18%, black 19%)",
            WebkitMaskImage: "radial-gradient(circle, transparent 18%, black 19%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="h-3 w-3 rounded-full bg-accent"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          />
        </div>
      </div>

      <motion.p
        key={statusIdx}
        className="mt-8 text-sm font-semibold text-ink-2"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: EASE_OUT }}
      >
        {STATUS[statusIdx]}
      </motion.p>

      <div className="mt-6 flex max-w-md flex-wrap items-center justify-center gap-2">
        {PROVIDERS.map((name, i) => (
          <span
            key={name}
            className={`chip cursor-default transition-all duration-300 ${
              i < lit ? "" : "opacity-35"
            }`}
            data-on={i < lit}
          >
            {i < lit && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 12l5 5L20 6" />
              </svg>
            )}
            {name}
          </span>
        ))}
      </div>

      <button type="button" onClick={onSkip} className="btn btn-ghost mt-10 text-sm">
        Skip the theatrics
      </button>
    </div>
  );
}
