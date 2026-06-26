"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/app-shell";
import CoverageIcon from "@/components/coverage-icon";
import { EASE_OUT } from "@/components/motion-primitives";
import { useProfile } from "@/lib/profile-store";
import { EWALLETS, FPX_BANKS, type PaymentMethod } from "@/lib/payments";
import { COVERAGE_LABELS, type Plan, type Policy, type Provider } from "@/lib/types";

type Stage = "form" | "processing" | "success";

const STEPS_BY_METHOD: Record<PaymentMethod, string[]> = {
  card: ["Contacting payment gateway…", "Verifying with issuing bank…", "Issuing your policy…"],
  fpx: ["Redirecting to your bank…", "Waiting for FPX authorisation…", "Returning to NEXTPay…", "Issuing your policy…"],
  ewallet: ["Opening wallet authorisation…", "Confirming balance…", "Issuing your policy…"],
};

function formatCard(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

const METHOD_TABS: { key: PaymentMethod; label: string }[] = [
  { key: "card", label: "Card" },
  { key: "fpx", label: "FPX online banking" },
  { key: "ewallet", label: "e-Wallet" },
];

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const { uid } = useProfile();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");
  const [bank, setBank] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);

  const [stage, setStage] = useState<Stage>("form");
  const [processStep, setProcessStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [channel, setChannel] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/plans/${id}`);
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      setPlan(data.plan);
      setProvider(data.provider);
    })();
  }, [id]);

  useEffect(() => {
    if (stage !== "processing") return;
    setProcessStep(0);
    const steps = STEPS_BY_METHOD[method];
    const t = setInterval(() => setProcessStep((s) => Math.min(steps.length - 1, s + 1)), 430);
    return () => clearInterval(t);
  }, [stage, method]);

  const readyToPay =
    method === "card"
      ? card.replace(/\s/g, "").length >= 12 && holder.trim().length >= 2 && expiry.length >= 5 && cvv.length >= 3
      : method === "fpx"
        ? bank !== null
        : wallet !== null;

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!plan || !readyToPay) return;
    setError(null);
    setStage("processing");
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, planId: plan.id, method, card, holder, bank, wallet }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Payment failed");
        setStage("form");
        return;
      }
      setPolicy(data.policy);
      setChannel(data.channel ?? null);
      setStage("success");
    } catch {
      setError("Couldn't reach the payment service. Try again.");
      setStage("form");
    }
  }

  if (notFound) {
    return (
      <AppShell>
        <div className="py-20 text-center">
          <p className="text-ink-2">That plan doesn't exist.</p>
          <Link href="/results" className="btn btn-secondary mt-5">
            Back to matches
          </Link>
        </div>
      </AppShell>
    );
  }

  if (!plan) {
    return (
      <AppShell>
        <div className="mx-auto mt-10 max-w-lg space-y-4">
          <div className="skeleton h-28" />
          <div className="skeleton h-64" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-lg">
        <AnimatePresence mode="wait">
          {stage === "success" && policy ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="relative py-10 text-center"
            >
              {/* subtle celebratory burst */}
              <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center motion-reduce:hidden" aria-hidden>
                {Array.from({ length: 14 }).map((_, i) => {
                  const angle = (i / 14) * Math.PI * 2;
                  return (
                    <motion.span
                      key={i}
                      className="absolute h-1.5 w-1.5 rounded-full"
                      style={{
                        background:
                          i % 3 === 0 ? "var(--signal)" : i % 3 === 1 ? "var(--accent)" : "var(--warn)",
                      }}
                      initial={{ x: 0, y: 36, opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos(angle) * (70 + (i % 4) * 16),
                        y: 36 + Math.sin(angle) * (54 + (i % 3) * 14),
                        opacity: 0,
                        scale: 0.4,
                      }}
                      transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.35 }}
                    />
                  );
                })}
              </div>
              <motion.div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-signal-soft"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.1 }}
              >
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <motion.path
                    d="M4 12.5l5 5L20 6.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.3 }}
                  />
                </svg>
              </motion.div>
              <h1 className="mt-6 font-(family-name:--font-display-var) text-3xl font-bold text-ink">
                You're covered.
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-ink-2">
                {policy.planName} is now active. {provider?.short} has your e-policy; reference{" "}
                <span className="tnum font-semibold text-ink">{policy.paymentRef}</span>.
              </p>
              <div className="card mx-auto mt-7 max-w-sm p-5 text-left text-sm">
                <div className="flex justify-between py-1.5">
                  <span className="text-ink-3">Paid via</span>
                  <span className="font-semibold text-ink">{channel ?? "NEXTPay"}</span>
                </div>
                <div className="flex justify-between border-t border-line py-1.5 pt-2.5">
                  <span className="text-ink-3">Monthly premium</span>
                  <span className="tnum font-bold text-ink">RM {policy.premium}</span>
                </div>
                <div className="flex justify-between border-t border-line py-1.5 pt-2.5">
                  <span className="text-ink-3">Active from</span>
                  <span className="font-semibold text-ink">
                    {new Date(policy.startDate).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="flex justify-between border-t border-line py-1.5 pt-2.5">
                  <span className="text-ink-3">Renews</span>
                  <span className="font-semibold text-ink">
                    {new Date(policy.renewalDate).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
              <div className="mt-8 flex justify-center gap-3">
                <Link href="/dashboard" className="btn btn-primary px-6">
                  Open my dashboard
                </Link>
                <Link href="/results" className="btn btn-ghost">
                  Keep browsing
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              <nav className="text-sm text-ink-3" aria-label="Breadcrumb">
                <Link href={`/plan/${plan.id}`} className="hover:text-ink">
                  {plan.name}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-ink-2">Checkout</span>
              </nav>

              <div className="mt-4 flex items-center justify-between">
                <h1 className="font-(family-name:--font-display-var) text-3xl font-bold text-ink">
                  Checkout
                </h1>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-3">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                  NEXTPay sandbox · TLS encrypted
                </span>
              </div>

              <div className="card mt-6 flex items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3.5">
                  <span className="text-accent">
                    <CoverageIcon type={plan.type} size={26} />
                  </span>
                  <div>
                    <p className="font-bold text-ink">{plan.name}</p>
                    <p className="text-sm text-ink-2">
                      {provider?.short} · {COVERAGE_LABELS[plan.type]}
                    </p>
                  </div>
                </div>
                <p className="tnum shrink-0">
                  <span className="font-(family-name:--font-display-var) text-xl font-extrabold text-ink">
                    RM {plan.monthlyPremium}
                  </span>
                  <span className="text-sm text-ink-3">/mo</span>
                </p>
              </div>

              <form className="card mt-4 p-6" onSubmit={pay} aria-label="Payment details">
                {/* Method tabs */}
                <div className="flex gap-1 rounded-xl border border-line bg-panel/50 p-1" role="tablist" aria-label="Payment method">
                  {METHOD_TABS.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      role="tab"
                      aria-selected={method === t.key}
                      onClick={() => {
                        setMethod(t.key);
                        setError(null);
                      }}
                      className={`relative flex-1 rounded-lg px-2 py-2 text-xs font-bold transition-colors duration-150 sm:text-sm ${
                        method === t.key ? "text-ink" : "text-ink-3 hover:text-ink-2"
                      }`}
                    >
                      {method === t.key && (
                        <motion.span
                          layoutId="pay-tab"
                          className="absolute inset-0 rounded-lg bg-elevated shadow-[0_2px_8px_oklch(0_0_0/0.3)]"
                          transition={{ duration: 0.22, ease: EASE_OUT }}
                        />
                      )}
                      <span className="relative">{t.label}</span>
                    </button>
                  ))}
                </div>

                {/* Keyed remount fades the new panel in without gating it on an
                    exit animation (which stalls in throttled/background tabs). */}
                  <motion.div
                    key={method}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, ease: EASE_OUT }}
                    className="mt-5 space-y-4"
                  >
                    {method === "card" && (
                      <>
                        <div>
                          <label htmlFor="holder" className="mb-1.5 block text-sm font-semibold text-ink-2">
                            Cardholder name
                          </label>
                          <input
                            id="holder"
                            className="input"
                            placeholder="As printed on card"
                            value={holder}
                            onChange={(e) => setHolder(e.target.value)}
                            autoComplete="cc-name"
                          />
                        </div>
                        <div>
                          <label htmlFor="card" className="mb-1.5 block text-sm font-semibold text-ink-2">
                            Card number
                          </label>
                          <input
                            id="card"
                            className="input tnum"
                            placeholder="4242 4242 4242 4242"
                            inputMode="numeric"
                            value={card}
                            onChange={(e) => setCard(formatCard(e.target.value))}
                            autoComplete="cc-number"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiry" className="mb-1.5 block text-sm font-semibold text-ink-2">
                              Expiry
                            </label>
                            <input
                              id="expiry"
                              className="input tnum"
                              placeholder="MM/YY"
                              inputMode="numeric"
                              value={expiry}
                              onChange={(e) => {
                                const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                                setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                              }}
                              autoComplete="cc-exp"
                            />
                          </div>
                          <div>
                            <label htmlFor="cvv" className="mb-1.5 block text-sm font-semibold text-ink-2">
                              CVV
                            </label>
                            <input
                              id="cvv"
                              className="input tnum"
                              placeholder="123"
                              inputMode="numeric"
                              type="password"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                              autoComplete="cc-csc"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {method === "fpx" && (
                      <div>
                        <p className="mb-2 text-sm font-semibold text-ink-2">Pay directly from your bank</p>
                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                          {FPX_BANKS.map((b) => (
                            <button
                              key={b}
                              type="button"
                              aria-pressed={bank === b}
                              onClick={() => setBank(b)}
                              className={`card !rounded-xl p-3 text-center text-xs font-bold transition-[border-color,background-color] duration-150 active:scale-[0.97] ${
                                bank === b ? "border-accent bg-accent-soft text-ink" : "text-ink-2 hover:border-line-strong"
                              }`}
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-ink-3">
                          FPX is Malaysia's bank-transfer rail: you authorise the payment inside
                          your own banking app, and no card details ever touch us.
                        </p>
                      </div>
                    )}

                    {method === "ewallet" && (
                      <div>
                        <p className="mb-2 text-sm font-semibold text-ink-2">Choose your wallet</p>
                        <div className="grid grid-cols-3 gap-2.5">
                          {EWALLETS.map((w) => (
                            <button
                              key={w}
                              type="button"
                              aria-pressed={wallet === w}
                              onClick={() => setWallet(w)}
                              className={`card !rounded-xl p-3 text-center text-xs font-bold transition-[border-color,background-color] duration-150 active:scale-[0.97] ${
                                wallet === w ? "border-accent bg-accent-soft text-ink" : "text-ink-2 hover:border-line-strong"
                              }`}
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      role="alert"
                      className="mt-4 rounded-lg border border-(--danger) bg-[oklch(0.68_0.19_25/0.1)] px-3.5 py-2.5 text-sm font-medium text-danger"
                      initial={{ opacity: 0, x: 0 }}
                      animate={{ opacity: 1, x: [0, -6, 6, -3, 3, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  className="btn btn-primary mt-5 w-full py-3 text-base"
                  disabled={stage === "processing" || !readyToPay}
                >
                  {stage === "processing" ? (
                    <span className="flex items-center gap-2.5">
                      <motion.span
                        className="inline-block h-4 w-4 rounded-full border-2 border-[oklch(0.13_0.03_255)] border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                      />
                      {STEPS_BY_METHOD[method][processStep]}
                    </span>
                  ) : (
                    <>
                      Pay RM {plan.monthlyPremium}
                      {method === "fpx" && bank ? ` via ${bank}` : method === "ewallet" && wallet ? ` with ${wallet}` : ""}{" "}
                      and activate
                    </>
                  )}
                </button>
                <p className="mt-3 text-center text-xs leading-relaxed text-ink-3">
                  Sandbox gateway: nothing is ever charged. Cards ending 0000 simulate a bank
                  decline; FPX and e-wallet flows always authorise.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
