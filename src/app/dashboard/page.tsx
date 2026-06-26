"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/app-shell";
import AskAdvisorButton from "@/components/ask-advisor-button";
import CoverageIcon from "@/components/coverage-icon";
import { StaggerItem, StaggerList } from "@/components/motion-primitives";
import ScoreRing from "@/components/score-ring";
import { useProfile } from "@/lib/profile-store";
import { COVERAGE_LABELS, type CoverageType, type Policy } from "@/lib/types";

interface PoliciesResponse {
  policies: Policy[];
  gaps: CoverageType[];
  totalPremium: number;
}

function daysUntil(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));
}

export default function DashboardPage() {
  const { uid, ready, profile } = useProfile();
  const [data, setData] = useState<PoliciesResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!ready || !uid) return;
    (async () => {
      try {
        const res = await fetch(`/api/policies?uid=${encodeURIComponent(uid)}`);
        if (!res.ok) throw new Error();
        setData(await res.json());
      } catch {
        setError(true);
      }
    })();
  }, [ready, uid]);

  return (
    <AppShell>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-(family-name:--font-display-var) text-3xl font-bold text-ink">
            My policies
          </h1>
          <p className="mt-2 text-ink-2">Every active cover, one cockpit.</p>
        </div>
        {data && data.policies.length > 0 && (
          <p className="tnum text-right text-sm text-ink-2">
            Total monthly premium{" "}
            <span className="block font-(family-name:--font-display-var) text-2xl font-extrabold text-ink">
              RM {data.totalPremium}
            </span>
          </p>
        )}
      </header>

      {error && (
        <p className="mt-10 text-ink-2">Couldn't load your policies. Refresh to retry.</p>
      )}

      {!data && !error && (
        <div className="mt-8 space-y-4">
          <div className="skeleton h-28" />
          <div className="skeleton h-28" />
        </div>
      )}

      {data && data.policies.length === 0 && (
        <div
          className="card mx-auto mt-12 max-w-md p-10 text-center ni-fade-in"
        >
          <p className="font-(family-name:--font-display-var) text-xl font-bold text-ink">
            Nothing protected yet
          </p>
          <p className="mt-3 leading-relaxed text-ink-2">
            When you buy a plan it lands here, with renewals, premiums and coverage gaps tracked
            for you.
          </p>
          <Link href={profile ? "/results" : "/onboard"} className="btn btn-primary mt-7">
            {profile ? "See my matches" : "Find my cover"}
          </Link>
        </div>
      )}

      {data && data.policies.length > 0 && (
        <>
          {/* Protection overview */}
          <section
            aria-label="Protection overview"
            className="card mt-8 flex flex-wrap items-center gap-7 p-5 sm:p-6 ni-fade-in"
          >
            <ScoreRing
              score={(4 - data.gaps.length) * 25}
              size={84}
              label="protected"
            />
            <div className="min-w-0 flex-1">
              <p className="font-(family-name:--font-display-var) text-base font-bold text-ink">
                {data.gaps.length === 0
                  ? "Fully covered across all four types."
                  : `Covered in ${4 - data.gaps.length} of 4 coverage types.`}
              </p>
              <div className="mt-3 space-y-1.5">
                {(["health", "life", "motor", "critical"] as const).map((t) => {
                  const spend = data.policies
                    .filter((p) => p.status === "active" && p.type === t)
                    .reduce((s, p) => s + p.premium, 0);
                  const pct = data.totalPremium > 0 ? (spend / data.totalPremium) * 100 : 0;
                  return (
                    <div key={t} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 text-xs font-semibold text-ink-3">
                        {COVERAGE_LABELS[t]}
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-panel">
                        <div
                          className={`h-full rounded-full ${spend > 0 ? "bg-accent" : "bg-transparent"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="tnum w-20 shrink-0 text-right text-xs font-semibold text-ink-2">
                        {spend > 0 ? `RM ${spend}/mo` : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <AskAdvisorButton
              question="Looking at my current policies, how solid is my protection and what would you improve first?"
              label="Review my cover"
              className="btn btn-secondary !py-2 shrink-0 text-sm"
            />
          </section>

          <StaggerList className="mt-6 grid gap-4 md:grid-cols-2" gap={0.07}>
            {data.policies.map((policy) => {
              const days = daysUntil(policy.renewalDate);
              const soon = days <= 45;
              return (
                <StaggerItem key={policy.id}>
                  <article className="card h-full p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                          <CoverageIcon type={policy.type} size={20} />
                        </span>
                        <div>
                          <h2 className="font-bold text-ink">{policy.planName}</h2>
                          <p className="text-sm text-ink-2">
                            {policy.providerName} · {COVERAGE_LABELS[policy.type]}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-signal-soft px-2.5 py-1 text-xs font-bold text-signal">
                        Active
                      </span>
                    </div>
                    <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4 text-sm">
                      <div>
                        <dt className="text-xs text-ink-3">Premium</dt>
                        <dd className="tnum mt-0.5 font-bold text-ink">RM {policy.premium}/mo</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-ink-3">Renews in</dt>
                        <dd className={`tnum mt-0.5 font-bold ${soon ? "text-warn" : "text-ink"}`}>
                          {days} days
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-ink-3">Reference</dt>
                        <dd className="tnum mt-0.5 truncate font-semibold text-ink-2">
                          {policy.paymentRef}
                        </dd>
                      </div>
                    </dl>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerList>

          {data.gaps.length > 0 && (
            <section
              aria-label="Coverage gaps"
              className="mt-10 ni-fade-in"
              style={{ animationDelay: "0.15s" }}
            >
              <h2 className="font-(family-name:--font-display-var) text-xl font-bold text-ink">
                Coverage gaps NEXTAdvisor noticed
              </h2>
              <p className="mt-1.5 text-sm text-ink-2">
                Households like yours usually carry these. No pressure, just visibility.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {data.gaps.map((gap) => (
                  <Link
                    key={gap}
                    href="/onboard"
                    className="card flex items-center gap-3 px-5 py-3.5 transition-colors hover:border-warn"
                  >
                    <span className="text-warn">
                      <CoverageIcon type={gap} size={20} />
                    </span>
                    <span className="text-sm">
                      <span className="block font-bold text-ink">
                        No {COVERAGE_LABELS[gap].toLowerCase()} cover
                      </span>
                      <span className="text-ink-3">Find a match</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </AppShell>
  );
}
