"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "@/components/app-shell";
import AskAdvisorButton from "@/components/ask-advisor-button";
import CoverageIcon from "@/components/coverage-icon";
import PartnerBadge from "@/components/landing/partner-badge";
import { EASE_OUT } from "@/components/motion-primitives";
import ScanInterlude from "@/components/scan-interlude";
import ScoreRing from "@/components/score-ring";
import { useProfile } from "@/lib/profile-store";
import {
  COVERAGE_LABELS,
  type CoverageType,
  type Match,
  type RecommendationDTO,
} from "@/lib/types";

function MatchCard({ match, rank, compared, onCompare }: {
  match: Match;
  rank: number;
  compared: boolean;
  onCompare: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <article
      className={`card-grad hover-lift overflow-hidden ni-fade-in ${rank === 0 ? "card-feature" : ""} ${compared ? "!border-accent" : ""}`}
      style={{ animationDelay: `${Math.min(rank * 0.06, 0.3)}s`, "--ni-fy": "14px" } as React.CSSProperties}
    >
      <div className="flex flex-wrap items-center gap-5 p-5 sm:p-6">
        <ScoreRing score={match.score} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {rank === 0 && (
              <span className="rounded-full bg-signal-soft px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-signal">
                Top match
              </span>
            )}
            <h3 className="font-(family-name:--font-display-var) text-lg font-bold text-ink">
              {match.plan.name}
            </h3>
          </div>
          <p className="mt-0.5 text-sm text-ink-2">
            {match.provider.name} · {match.plan.rating.toFixed(1)}★
          </p>
          <ul className="mt-2 space-y-1">
            {match.plan.highlights.slice(0, 2).map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-ink-2">
                <svg className="mt-1 shrink-0 text-signal" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4 12l5 5L20 6" />
                </svg>
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-end gap-3">
          <p className="tnum text-right">
            <span className="font-(family-name:--font-display-var) text-2xl font-extrabold text-ink">
              RM {match.plan.monthlyPremium}
            </span>
            <span className="text-sm text-ink-3"> /mo</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="chip"
              data-on={compared}
              aria-pressed={compared}
              onClick={onCompare}
            >
              {compared ? "In compare" : "Compare"}
            </button>
            <Link href={`/plan/${match.plan.id}`} className="btn btn-primary !py-2 text-sm">
              View plan
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-between border-t border-line px-6 py-3 text-sm font-semibold text-ink-2 transition-colors hover:bg-panel hover:text-ink"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        Why this score?
        <motion.svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18, ease: EASE_OUT }}
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-line bg-panel/40 px-6 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="max-w-md text-sm leading-relaxed text-ink-2">{match.why}</p>
                <AskAdvisorButton
                  question={`Is ${match.plan.name} (${match.provider.short}, RM ${match.plan.monthlyPremium}/mo) a good fit for my profile? Anything I should watch out for?`}
                  label="Ask about this plan"
                  className="btn btn-secondary !py-1.5 shrink-0 text-xs"
                />
              </div>
              {match.parts.map((part) => (
                <div key={part.label}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-semibold text-ink">{part.label}</span>
                    <span className="tnum text-ink-2">
                      {part.points}/{part.max}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-panel">
                    <motion.div
                      className="h-full rounded-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${(part.points / part.max) * 100}%` }}
                      transition={{ duration: 0.5, ease: EASE_OUT }}
                    />
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-ink-3">{part.note}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function CompareModal({ matches, onClose }: { matches: Match[]; onClose: () => void }) {
  const featureKeys = useMemo(() => {
    const keys: string[] = [];
    for (const m of matches) {
      for (const k of Object.keys(m.plan.features)) {
        if (!keys.includes(k)) keys.push(k);
      }
    }
    return keys;
  }, [matches]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        aria-label="Close comparison"
        className="absolute inset-0 bg-[oklch(0.1_0.02_255/0.7)] backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-label="Plan comparison"
        className="relative max-h-[85dvh] w-full max-w-4xl overflow-auto rounded-2xl border border-line bg-elevated p-6 shadow-[0_32px_80px_oklch(0_0_0/0.55)]"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-(family-name:--font-display-var) text-xl font-bold text-ink">
            Side by side
          </h2>
          <button type="button" className="btn btn-ghost text-sm" onClick={onClose}>
            Close
          </button>
        </div>
        <table className="mt-5 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-40 py-2 pr-3 text-left font-semibold text-ink-3">Plan</th>
              {matches.map((m) => (
                <th key={m.plan.id} className="py-2 pr-3 text-left align-top">
                  <p className="font-bold text-ink">{m.plan.name}</p>
                  <p className="text-xs font-medium text-ink-2">{m.provider.short}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-line">
              <td className="py-3 pr-3 font-semibold text-ink-3">Match score</td>
              {matches.map((m) => (
                <td key={m.plan.id} className="py-3 pr-3">
                  <span className="tnum font-(family-name:--font-display-var) text-lg font-extrabold text-signal">
                    {m.score}
                  </span>
                  <span className="text-xs text-ink-3">/100</span>
                </td>
              ))}
            </tr>
            <tr className="border-t border-line">
              <td className="py-3 pr-3 font-semibold text-ink-3">Monthly premium</td>
              {matches.map((m) => (
                <td key={m.plan.id} className="tnum py-3 pr-3 font-bold text-ink">
                  RM {m.plan.monthlyPremium}
                </td>
              ))}
            </tr>
            {featureKeys.map((key) => (
              <tr key={key} className="border-t border-line">
                <td className="py-3 pr-3 font-semibold text-ink-3">{key}</td>
                {matches.map((m) => {
                  const v = m.plan.features[key];
                  return (
                    <td key={m.plan.id} className="py-3 pr-3 text-ink-2">
                      {v === true ? (
                        <span className="font-semibold text-signal">Yes</span>
                      ) : v === false || v === undefined ? (
                        <span className="text-ink-3">No</span>
                      ) : (
                        String(v)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="border-t border-line">
              <td className="py-4 pr-3" />
              {matches.map((m) => (
                <td key={m.plan.id} className="py-4 pr-3">
                  <Link href={`/plan/${m.plan.id}`} className="btn btn-primary !py-2 text-sm">
                    View {m.plan.name.split(" ")[0]}
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}

function ResultsInner() {
  const router = useRouter();
  const search = useSearchParams();
  const fresh = search.get("fresh") === "1";
  const { profile, ready } = useProfile();

  const [rec, setRec] = useState<RecommendationDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanDone, setScanDone] = useState(!fresh);
  const [tab, setTab] = useState<CoverageType | null>(null);
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    if (!ready || !profile) return;
    let cancelled = false;
    const minWait = fresh ? new Promise((r) => setTimeout(r, 2400)) : Promise.resolve();
    (async () => {
      try {
        const [res] = await Promise.all([
          fetch("/api/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profile),
          }),
          minWait,
        ]);
        if (!res.ok) throw new Error((await res.json()).error ?? "Recommendation failed");
        const data: RecommendationDTO = await res.json();
        if (!cancelled) {
          setRec(data);
          setTab(profile.coverageTypes[0]);
          setScanDone(true);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Something went wrong");
          setScanDone(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, profile, fresh]);

  const toggleCompare = useCallback((id: string) => {
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? c : [...c, id]));
  }, []);

  if (!ready) return null;

  if (!profile) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md py-20 text-center">
          <h1 className="font-(family-name:--font-display-var) text-2xl font-bold text-ink">
            No profile yet
          </h1>
          <p className="mt-3 text-ink-2">
            Matches are personal. Answer six quick questions and NEXTAdvisor will scan the catalog
            for you.
          </p>
          <Link href="/onboard" className="btn btn-primary mt-7">
            Find my cover
          </Link>
        </div>
      </AppShell>
    );
  }

  if (!scanDone || (!rec && !error)) {
    return (
      <AppShell>
        <ScanInterlude onSkip={() => setScanDone(true)} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md py-20 text-center">
          <h1 className="font-(family-name:--font-display-var) text-2xl font-bold text-danger">
            The scan tripped
          </h1>
          <p className="mt-3 text-ink-2">{error}</p>
          <button type="button" className="btn btn-secondary mt-7" onClick={() => router.refresh()}>
            Try again
          </button>
        </div>
      </AppShell>
    );
  }

  const recommendation = rec!;
  const activeTab = tab ?? profile.coverageTypes[0];
  const matches = recommendation.byType[activeTab] ?? [];
  const comparedMatches = matches.filter((m) => compare.includes(m.plan.id));
  const overBudget = recommendation.totalPremium > recommendation.budget;

  return (
    <AppShell>
      <header className="ni-fade-in">
        <span className="eyebrow">Your results</span>
        <h1 className="display-head mt-3 text-4xl text-ink sm:text-5xl">
          Your top <span className="text-gradient-brand">matches</span>
        </h1>
        <p className="mt-3 max-w-xl text-ink-2">
          Scored against your RM {profile.budget}/mo budget. Rank order is score order; open any
          score to audit the math.
        </p>
      </header>

      {/* Suggested portfolio */}
      {recommendation.portfolio.length > 1 && (
        <section
          aria-label="Suggested portfolio"
          className="card-grad mt-8 p-5 sm:p-6 ni-fade-in"
          style={{ animationDelay: "0.08s" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-kanit text-base font-bold uppercase tracking-wide text-ink">
              NEXTAdvisor's suggested portfolio
            </h2>
            <p className="tnum text-sm font-semibold">
              <span className={overBudget ? "text-warn" : "text-signal"}>
                RM {recommendation.totalPremium}
              </span>
              <span className="text-ink-3"> / RM {recommendation.budget} budget</span>
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recommendation.portfolio.map((m) => (
              <Link
                key={m.plan.id}
                href={`/plan/${m.plan.id}`}
                className="hover-lift group rounded-xl border border-line bg-panel/50 p-4 hover:border-accent"
              >
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-3">
                  <CoverageIcon type={m.plan.type} size={15} />
                  {COVERAGE_LABELS[m.plan.type]}
                </span>
                <p className="mt-1.5 truncate text-sm font-bold text-ink group-hover:text-accent">
                  {m.plan.name}
                </p>
                <p className="tnum mt-0.5 text-sm text-ink-2">
                  RM {m.plan.monthlyPremium}/mo · {m.score}/100
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tabs */}
      {profile.coverageTypes.length > 1 && (
        <div className="mt-9 flex gap-1 border-b border-line" role="tablist" aria-label="Coverage types">
          {profile.coverageTypes.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={t === activeTab}
              className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                t === activeTab ? "text-ink" : "text-ink-3 hover:text-ink-2"
              }`}
              onClick={() => setTab(t)}
            >
              <CoverageIcon type={t} size={16} />
              {COVERAGE_LABELS[t]}
              {t === activeTab && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent"
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Matches */}
      <div className="mt-6 space-y-4" role="tabpanel">
        <AnimatePresence mode="popLayout">
          {matches.map((m, i) => (
            <MatchCard
              key={m.plan.id}
              match={m}
              rank={i}
              compared={compare.includes(m.plan.id)}
              onCompare={() => toggleCompare(m.plan.id)}
            />
          ))}
        </AnimatePresence>
        {matches.length === 0 && (
          <p className="py-10 text-center text-ink-3">No plans of this type in the catalog yet.</p>
        )}
      </div>

      {/* Compare tray */}
      <AnimatePresence>
        {compare.length >= 2 && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-[oklch(0.145_0.025_255/0.92)] backdrop-blur-md"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
          >
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3.5">
              <p className="text-sm text-ink-2">
                <span className="tnum font-bold text-ink">{comparedMatches.length}</span> plans
                selected
              </p>
              <div className="flex gap-2">
                <button type="button" className="btn btn-ghost text-sm" onClick={() => setCompare([])}>
                  Clear
                </button>
                <button
                  type="button"
                  className="btn btn-primary text-sm"
                  onClick={() => setShowCompare(true)}
                  disabled={comparedMatches.length < 2}
                >
                  Compare side by side
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCompare && comparedMatches.length >= 2 && (
          <CompareModal matches={comparedMatches} onClose={() => setShowCompare(false)} />
        )}
      </AnimatePresence>
    </AppShell>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={null}>
      <ResultsInner />
    </Suspense>
  );
}
