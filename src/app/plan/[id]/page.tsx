import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/app-shell";
import AskAdvisorButton from "@/components/ask-advisor-button";
import CoverageIcon from "@/components/coverage-icon";
import FinePrintDecoder from "@/components/fineprint-decoder";
import { FadeRise } from "@/components/motion-primitives";
import { planById, providerById } from "@/lib/db";
import { COVERAGE_LABELS } from "@/lib/types";

export default async function PlanPage(props: PageProps<"/plan/[id]">) {
  const { id } = await props.params;
  const plan = planById(id);
  if (!plan) notFound();
  const provider = providerById(plan.providerId);

  const headline = plan.annualLimit
    ? { value: `RM ${(plan.annualLimit / 1000).toLocaleString()}k`, label: "annual limit" }
    : plan.coverAmount
      ? { value: `RM ${(plan.coverAmount / 1000).toLocaleString()}k`, label: plan.type === "motor" ? "insured value" : "sum assured" }
      : null;

  return (
    <AppShell>
      <nav className="text-sm text-ink-3" aria-label="Breadcrumb">
        <Link href="/results" className="hover:text-ink">
          Top matches
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-2">{plan.name}</span>
      </nav>

      <FadeRise>
        <header className="card mt-5 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-3">
                <CoverageIcon type={plan.type} size={15} />
                {COVERAGE_LABELS[plan.type]}
              </span>
              <h1 className="mt-2 font-(family-name:--font-display-var) text-3xl font-bold text-ink">
                {plan.name}
              </h1>
              <p className="mt-1.5 text-ink-2">
                {provider?.name} · {provider?.tagline} · {plan.rating.toFixed(1)}★ policyholder
                rating
              </p>
              <ul className="mt-5 space-y-2">
                {plan.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-[0.95rem] text-ink-2">
                    <svg className="mt-1 shrink-0 text-signal" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M4 12l5 5L20 6" />
                    </svg>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:items-end">
              <p className="tnum text-right">
                <span className="font-(family-name:--font-display-var) text-4xl font-extrabold text-ink">
                  RM {plan.monthlyPremium}
                </span>
                <span className="text-ink-3"> /mo</span>
              </p>
              {headline && (
                <p className="text-right text-sm text-ink-2">
                  <span className="tnum font-bold text-signal">{headline.value}</span>{" "}
                  {headline.label}
                </p>
              )}
              <Link href={`/checkout/${plan.id}`} className="btn btn-primary px-7 py-3">
                Buy this plan
              </Link>
              <AskAdvisorButton
                question={`Walk me through ${plan.name} by ${provider?.short}. Who is it best for, and what are its weak points?`}
                label="Ask NEXTAdvisor first"
                className="btn btn-secondary !py-2 text-sm"
              />
              <p className="text-right text-xs text-ink-3">Cancel anytime · no lock-in (demo)</p>
            </div>
          </div>
        </header>
      </FadeRise>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <FadeRise delay={0.05}>
          <section aria-label="What you get">
            <h2 className="font-(family-name:--font-display-var) text-xl font-bold text-ink">
              What you get
            </h2>
            <dl className="card mt-4 divide-y divide-(--line)">
              {Object.entries(plan.features).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <dt className="text-sm font-medium text-ink-2">{key}</dt>
                  <dd className="text-right text-sm font-semibold text-ink">
                    {value === true ? (
                      <span className="text-signal">Included</span>
                    ) : value === false ? (
                      <span className="text-ink-3">Not included</span>
                    ) : (
                      String(value)
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </FadeRise>

        <FadeRise delay={0.1}>
          <section aria-label="Decode the fine print">
            <h2 className="font-(family-name:--font-display-var) text-xl font-bold text-ink">
              Decode the fine print
            </h2>
            <p className="mt-1.5 text-sm text-ink-2">
              The exact policy wording, translated into plain words. This is the clause-level
              transparency agents never give you.
            </p>
            <div className="mt-4">
              <FinePrintDecoder planId={plan.id} clauses={plan.fineprint} />
            </div>
          </section>
        </FadeRise>
      </div>
    </AppShell>
  );
}
