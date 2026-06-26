"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Logo from "@/components/logo";
import CoverageIcon from "@/components/coverage-icon";
import { EASE_OUT } from "@/components/motion-primitives";
import { useProfile } from "@/lib/profile-store";
import type { CoverageType, IncomeBracket, Priority, Profile, Segment } from "@/lib/types";

const COVERAGE_OPTIONS: { key: CoverageType; label: string; hint: string }[] = [
  { key: "health", label: "Health & medical", hint: "Hospital bills, medical card" },
  { key: "life", label: "Life", hint: "Income for your people if you're gone" },
  { key: "motor", label: "Motor", hint: "Car or motorbike, incl. e-hailing" },
  { key: "critical", label: "Critical illness", hint: "Lump sum on serious diagnosis" },
];

const SEGMENT_OPTIONS: { key: Segment; label: string; hint: string }[] = [
  { key: "novice", label: "First-time buyer", hint: "New to insurance, allergic to jargon" },
  { key: "gig", label: "Gig worker / freelancer", hint: "Variable income, no employer benefits" },
  { key: "family", label: "Family & assets", hint: "Household, vehicles, dependants to protect" },
  { key: "expat", label: "Expat / nomad", hint: "New to the Malaysian system" },
];

const INCOME_OPTIONS: { key: IncomeBracket; label: string; hint: string }[] = [
  { key: "B40", label: "B40", hint: "Up to ~RM 5,250 household / month" },
  { key: "M40", label: "M40", hint: "~RM 5,251 to RM 11,819" },
  { key: "T20", label: "T20", hint: "Above ~RM 11,819" },
];

const PRIORITY_OPTIONS: { key: Priority; label: string }[] = [
  { key: "price", label: "Lowest price" },
  { key: "coverage", label: "Deepest coverage" },
  { key: "flexibility", label: "Flexibility to pause/adjust" },
  { key: "cashless", label: "Cashless admission" },
  { key: "support", label: "Hand-holding & support" },
];

const TOTAL_STEPS = 6;

export default function Onboard() {
  const router = useRouter();
  const { uid, profile, setProfile } = useProfile();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  const [coverage, setCoverage] = useState<CoverageType[]>(profile?.coverageTypes ?? []);
  const [segment, setSegment] = useState<Segment | null>(profile?.segment ?? null);
  const [age, setAge] = useState(profile?.age ?? 27);
  const [income, setIncome] = useState<IncomeBracket | null>(profile?.income ?? null);
  const [budget, setBudget] = useState(profile?.budget ?? 250);
  const [dependents, setDependents] = useState(profile?.dependents ?? 0);
  const [preexisting, setPreexisting] = useState(profile?.preexisting ?? false);
  const [priorities, setPriorities] = useState<Priority[]>(profile?.priorities ?? []);

  const canNext = useMemo(() => {
    switch (step) {
      case 0: return coverage.length > 0;
      case 1: return segment !== null;
      case 2: return income !== null && age >= 18 && age <= 80;
      case 3: return budget >= 30;
      default: return true;
    }
  }, [step, coverage, segment, income, age, budget]);

  function go(delta: number) {
    setDir(delta);
    setStep((s) => Math.max(0, Math.min(TOTAL_STEPS - 1, s + delta)));
  }

  function finish() {
    const next: Profile = {
      uid,
      age,
      segment: segment ?? "novice",
      income: income ?? "M40",
      coverageTypes: coverage,
      budget,
      dependents,
      preexisting,
      priorities,
    };
    setProfile(next);
    router.push("/results?fresh=1");
  }

  const slide = {
    initial: (d: number) => ({ opacity: 0, x: d * 36 }),
    animate: { opacity: 1, x: 0, transition: { duration: 0.24, ease: EASE_OUT } },
    exit: (d: number) => ({ opacity: 0, x: d * -36, transition: { duration: 0.16, ease: EASE_OUT } }),
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-5">
        <Logo />
        <span className="tnum text-sm text-ink-3">
          {step + 1} / {TOTAL_STEPS}
        </span>
      </header>

      {/* progress */}
      <div className="mx-auto w-full max-w-2xl px-5" aria-hidden>
        <div className="h-1 overflow-hidden rounded-full bg-panel">
          <motion.div
            className="h-full rounded-full bg-accent"
            animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          />
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pb-16 pt-10">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slide}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1"
          >
            {step === 0 && (
              <fieldset>
                <legend className="font-(family-name:--font-display-var) text-3xl font-bold text-ink">
                  What do you want covered?
                </legend>
                <p className="mt-2 text-ink-2">Pick everything that applies. You can mix types.</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {COVERAGE_OPTIONS.map((opt) => {
                    const on = coverage.includes(opt.key);
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          setCoverage((c) =>
                            on ? c.filter((t) => t !== opt.key) : [...c, opt.key]
                          )
                        }
                        className={`card flex items-start gap-4 p-5 text-left transition-[border-color,background-color] duration-150 active:scale-[0.98] ${
                          on ? "border-accent bg-accent-soft" : "hover:border-line-strong"
                        }`}
                      >
                        <span className={`mt-0.5 ${on ? "text-accent" : "text-ink-3"}`}>
                          <CoverageIcon type={opt.key} size={26} />
                        </span>
                        <span>
                          <span className="block font-bold text-ink">{opt.label}</span>
                          <span className="mt-0.5 block text-sm text-ink-2">{opt.hint}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <fieldset>
                <legend className="font-(family-name:--font-display-var) text-3xl font-bold text-ink">
                  Which sounds most like you?
                </legend>
                <p className="mt-2 text-ink-2">
                  This tunes the ranking, it never filters plans out.
                </p>
                <div className="mt-8 grid gap-3">
                  {SEGMENT_OPTIONS.map((opt) => {
                    const on = segment === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setSegment(opt.key)}
                        className={`card flex items-center justify-between gap-4 p-5 text-left transition-[border-color,background-color] duration-150 active:scale-[0.99] ${
                          on ? "border-accent bg-accent-soft" : "hover:border-line-strong"
                        }`}
                      >
                        <span>
                          <span className="block font-bold text-ink">{opt.label}</span>
                          <span className="mt-0.5 block text-sm text-ink-2">{opt.hint}</span>
                        </span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            on ? "border-accent bg-accent" : "border-line-strong"
                          }`}
                          aria-hidden
                        >
                          {on && (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="oklch(0.13 0.03 255)" strokeWidth="4" strokeLinecap="round">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset>
                <legend className="font-(family-name:--font-display-var) text-3xl font-bold text-ink">
                  A little about you.
                </legend>
                <p className="mt-2 text-ink-2">Age and income bracket set your needs profile.</p>
                <div className="mt-8">
                  <label htmlFor="age" className="text-sm font-semibold text-ink-2">
                    Your age: <span className="tnum text-lg font-bold text-ink">{age}</span>
                  </label>
                  <input
                    id="age"
                    type="range"
                    min={18}
                    max={70}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    style={{ "--fill": `${((age - 18) / 52) * 100}%` } as React.CSSProperties}
                    className="mt-3"
                  />
                </div>
                <div className="mt-9">
                  <p className="text-sm font-semibold text-ink-2">Household income bracket</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {INCOME_OPTIONS.map((opt) => {
                      const on = income === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setIncome(opt.key)}
                          className={`card p-4 text-left transition-[border-color,background-color] duration-150 active:scale-[0.98] ${
                            on ? "border-accent bg-accent-soft" : "hover:border-line-strong"
                          }`}
                        >
                          <span className="block font-(family-name:--font-display-var) text-xl font-bold text-ink">
                            {opt.label}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-ink-2">{opt.hint}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </fieldset>
            )}

            {step === 3 && (
              <fieldset>
                <legend className="font-(family-name:--font-display-var) text-3xl font-bold text-ink">
                  Your monthly protection budget.
                </legend>
                <p className="mt-2 text-ink-2">
                  Across everything you selected. Be honest, the ranking respects it.
                </p>
                <div className="card mt-8 p-7">
                  <p className="tnum text-center font-(family-name:--font-display-var) text-5xl font-extrabold text-ink">
                    RM {budget}
                    <span className="text-lg font-semibold text-ink-3"> /mo</span>
                  </p>
                  <input
                    aria-label="Monthly budget in ringgit"
                    type="range"
                    min={50}
                    max={1200}
                    step={10}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    style={{ "--fill": `${((budget - 50) / 1150) * 100}%` } as React.CSSProperties}
                    className="mt-7"
                  />
                  <div className="mt-2 flex justify-between text-xs text-ink-3">
                    <span>RM 50</span>
                    <span>RM 1,200</span>
                  </div>
                  <p className="mt-5 text-center text-sm text-ink-2">
                    {budget < 150
                      ? "Tight but workable: expect value plans with co-payments."
                      : budget < 400
                        ? "A healthy budget: strong mid-tier matches across types."
                        : "Generous: premium plans and family bundles are in reach."}
                  </p>
                </div>
              </fieldset>
            )}

            {step === 4 && (
              <fieldset>
                <legend className="font-(family-name:--font-display-var) text-3xl font-bold text-ink">
                  Who depends on you?
                </legend>
                <p className="mt-2 text-ink-2">Dependants raise how much cover you actually need.</p>
                <div className="card mt-8 flex items-center justify-between p-6">
                  <span className="font-semibold text-ink">Dependants</span>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="btn btn-secondary !px-4"
                      onClick={() => setDependents((d) => Math.max(0, d - 1))}
                      aria-label="Fewer dependants"
                    >
                      –
                    </button>
                    <span className="tnum w-8 text-center font-(family-name:--font-display-var) text-2xl font-bold text-ink">
                      {dependents}
                    </span>
                    <button
                      type="button"
                      className="btn btn-secondary !px-4"
                      onClick={() => setDependents((d) => Math.min(10, d + 1))}
                      aria-label="More dependants"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  aria-pressed={preexisting}
                  onClick={() => setPreexisting((v) => !v)}
                  className={`card mt-3 flex w-full items-center justify-between p-6 text-left transition-[border-color,background-color] duration-150 ${
                    preexisting ? "border-accent bg-accent-soft" : "hover:border-line-strong"
                  }`}
                >
                  <span>
                    <span className="block font-semibold text-ink">
                      I have a pre-existing or chronic condition
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-2">
                      We'll weight plans with shorter exclusion periods and higher limits.
                    </span>
                  </span>
                  <span
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 ${
                      preexisting ? "bg-accent" : "bg-panel"
                    }`}
                    aria-hidden
                  >
                    <motion.span
                      className="absolute top-0.5 h-5 w-5 rounded-full bg-ink"
                      animate={{ left: preexisting ? "1.45rem" : "0.125rem" }}
                      transition={{ duration: 0.18, ease: EASE_OUT }}
                    />
                  </span>
                </button>
              </fieldset>
            )}

            {step === 5 && (
              <fieldset>
                <legend className="font-(family-name:--font-display-var) text-3xl font-bold text-ink">
                  What matters most to you?
                </legend>
                <p className="mt-2 text-ink-2">Pick up to three. These earn bonus points in scoring.</p>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {PRIORITY_OPTIONS.map((opt) => {
                    const on = priorities.includes(opt.key);
                    const full = priorities.length >= 3 && !on;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        className="chip !px-4 !py-2.5 !text-sm disabled:opacity-40"
                        data-on={on}
                        disabled={full}
                        aria-pressed={on}
                        onClick={() =>
                          setPriorities((p) =>
                            on ? p.filter((x) => x !== opt.key) : [...p, opt.key]
                          )
                        }
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                <div className="card mt-10 p-6">
                  <p className="text-sm font-semibold text-ink-3">Ready to scan</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">
                    NEXTAdvisor will score{" "}
                    <span className="font-semibold text-ink">
                      every {coverage.map((c) => c).join(", ")} plan
                    </span>{" "}
                    from 6 partnered providers against your profile and RM {budget}/mo budget. The
                    full score math ships with every result.
                  </p>
                </div>
              </fieldset>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => (step === 0 ? router.push("/") : go(-1))}
          >
            Back
          </button>
          {step < TOTAL_STEPS - 1 ? (
            <button type="button" className="btn btn-primary px-7" disabled={!canNext} onClick={() => go(1)}>
              Continue
            </button>
          ) : (
            <button type="button" className="btn btn-primary px-7" onClick={finish}>
              Find my matches
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
