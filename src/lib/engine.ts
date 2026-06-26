import { plansByTypes, providerById } from "./db";
import type {
  CoverageType,
  Match,
  Plan,
  Profile,
  Provider,
  ScorePart,
} from "./types";
import { COVERAGE_LABELS } from "./types";

/**
 * Deterministic, inspectable match scoring. Rank order = score order; the
 * breakdown returned with every match is the bias-free audit trail the
 * product promises.
 *
 * Weights: budget fit 30, coverage depth 25, segment match 20,
 * provider strength 15, priority alignment 10. Total 100.
 */

// Typical share of a protection budget each coverage type consumes.
const TYPE_BUDGET_WEIGHT: Record<CoverageType, number> = {
  health: 0.45,
  life: 0.2,
  motor: 0.25,
  critical: 0.1,
};

function budgetAllocations(profile: Profile): Record<CoverageType, number> {
  const selected = profile.coverageTypes;
  const totalWeight = selected.reduce((s, t) => s + TYPE_BUDGET_WEIGHT[t], 0);
  const out = {} as Record<CoverageType, number>;
  for (const t of selected) {
    out[t] = Math.round((TYPE_BUDGET_WEIGHT[t] / totalWeight) * profile.budget);
  }
  return out;
}

function scoreBudget(plan: Plan, allocation: number): ScorePart {
  const ratio = plan.monthlyPremium / Math.max(allocation, 1);
  let points: number;
  let note: string;
  if (ratio <= 0.85) {
    points = 30;
    note = `RM ${plan.monthlyPremium}/mo sits comfortably under your ~RM ${allocation} slice for ${COVERAGE_LABELS[plan.type].toLowerCase()}`;
  } else if (ratio <= 1.0) {
    points = 27;
    note = `RM ${plan.monthlyPremium}/mo fits your ~RM ${allocation} budget slice`;
  } else if (ratio <= 1.25) {
    points = 18;
    note = `RM ${plan.monthlyPremium}/mo runs ~${Math.round((ratio - 1) * 100)}% over your budget slice`;
  } else if (ratio <= 1.6) {
    points = 9;
    note = `RM ${plan.monthlyPremium}/mo stretches well past your ~RM ${allocation} slice`;
  } else {
    points = 2;
    note = `RM ${plan.monthlyPremium}/mo is far above your ~RM ${allocation} slice`;
  }
  return { label: "Budget fit", points, max: 30, note };
}

function coverageNeed(profile: Profile, type: CoverageType): number {
  // A rough "adequate cover" target in RM, scaled by life stage.
  const incomeFactor = profile.income === "B40" ? 0.8 : profile.income === "M40" ? 1 : 1.4;
  const dependentFactor = 1 + profile.dependents * 0.18;
  switch (type) {
    case "health":
      return 600_000 * incomeFactor * dependentFactor * (profile.preexisting ? 1.25 : 1);
    case "life":
      return 280_000 * incomeFactor * dependentFactor;
    case "motor":
      return 50_000 * incomeFactor;
    case "critical":
      return 110_000 * incomeFactor * (profile.preexisting ? 1.3 : 1);
  }
}

function scoreCoverage(plan: Plan, profile: Profile): ScorePart {
  const target = coverageNeed(profile, plan.type);
  const actual = plan.annualLimit ?? plan.coverAmount ?? 0;
  const ratio = actual / target;
  let points: number;
  if (ratio >= 1.5) points = 25;
  else if (ratio >= 1.0) points = 22;
  else if (ratio >= 0.75) points = 16;
  else if (ratio >= 0.5) points = 10;
  else points = 5;

  // Depth modifiers that matter regardless of headline number.
  if (plan.type === "health" && profile.preexisting && plan.fineprint.some((f) => f.term === "Pre-existing conditions" && f.plain.includes("1 year"))) {
    points = Math.min(25, points + 2);
  }
  if (plan.cashless) points = Math.min(25, points + 1);

  const label = plan.annualLimit
    ? `RM ${(plan.annualLimit / 1000).toFixed(0)}k annual limit vs your ~RM ${(Math.round(target / 10000) * 10).toFixed(0)}k needs profile`
    : plan.coverAmount
      ? `RM ${(plan.coverAmount / 1000).toFixed(0)}k cover vs your ~RM ${(Math.round(target / 10000) * 10).toFixed(0)}k needs profile`
      : "Coverage measured against your needs profile";
  return { label: "Coverage depth", points, max: 25, note: label };
}

function scoreSegment(plan: Plan, profile: Profile): ScorePart {
  let points = 0;
  const reasons: string[] = [];
  if (plan.segments.includes(profile.segment)) {
    points += 12;
    reasons.push("designed for your profile");
  }
  if (profile.segment === "gig" && plan.flexible) {
    points += 4;
    reasons.push("cover can pause with your income");
  }
  if (profile.segment === "expat" && plan.multilingual) {
    points += 4;
    reasons.push("multilingual support & expat onboarding");
  }
  if (profile.segment === "family" && plan.familyBundle) {
    points += 4;
    reasons.push("family bundling discounts");
  }
  if (profile.segment === "novice" && plan.beginnerFriendly) {
    points += 4;
    reasons.push("simplified first-timer underwriting");
  }
  points = Math.min(20, points);
  return {
    label: "Segment match",
    points,
    max: 20,
    note: reasons.length ? `This plan is ${reasons.join(", ")}` : "General-market plan, not tuned to your segment",
  };
}

function scoreProvider(plan: Plan, provider: Provider): ScorePart {
  // trust 0–100 → 0–9, rating 0–5 → 0–6
  const points = Math.round((provider.trustScore / 100) * 9 + (plan.rating / 5) * 6);
  return {
    label: "Provider strength",
    points: Math.min(15, points),
    max: 15,
    note: `${provider.short}: ${provider.trustScore}/100 claims-settlement trust, ${plan.rating.toFixed(1)}★ policyholder rating`,
  };
}

function scorePriorities(plan: Plan, profile: Profile, peers: Plan[]): ScorePart {
  if (profile.priorities.length === 0) {
    return { label: "Priority alignment", points: 5, max: 10, note: "No stated priorities; neutral weighting applied" };
  }
  const per = 10 / profile.priorities.length;
  let points = 0;
  const hits: string[] = [];
  const premiums = peers.map((p) => p.monthlyPremium).sort((a, b) => a - b);
  const cheapCut = premiums[Math.floor(premiums.length * 0.4)] ?? Infinity;
  const limits = peers.map((p) => p.annualLimit ?? p.coverAmount ?? 0).sort((a, b) => b - a);
  const deepCut = limits[Math.floor(limits.length * 0.4)] ?? 0;

  for (const priority of profile.priorities) {
    switch (priority) {
      case "price":
        if (plan.monthlyPremium <= cheapCut) { points += per; hits.push("among the cheapest in its class"); }
        break;
      case "coverage":
        if ((plan.annualLimit ?? plan.coverAmount ?? 0) >= deepCut) { points += per; hits.push("top-tier cover depth"); }
        break;
      case "flexibility":
        if (plan.flexible) { points += per; hits.push("adjustable month to month"); }
        break;
      case "cashless":
        if (plan.cashless) { points += per; hits.push("cashless admission"); }
        break;
      case "support":
        if (plan.multilingual || plan.beginnerFriendly) { points += per; hits.push("strong guided support"); }
        break;
    }
  }
  return {
    label: "Priority alignment",
    points: Math.round(points),
    max: 10,
    note: hits.length ? `Matches what you said matters: ${hits.join("; ")}` : "Doesn't stand out on your stated priorities",
  };
}

function buildWhy(plan: Plan, provider: Provider, parts: ScorePart[]): string {
  const strongest = [...parts].sort((a, b) => b.points / b.max - a.points / a.max);
  const top = strongest[0];
  const second = strongest[1];
  return `${plan.name} leads on ${top.label.toLowerCase()} (${top.points}/${top.max}) and ${second.label.toLowerCase()} (${second.points}/${second.max}) — ${provider.short} settles claims at a ${provider.trustScore}/100 trust grade.`;
}

export function scorePlan(plan: Plan, profile: Profile, peers: Plan[], allocation: number): Match | null {
  const provider = providerById(plan.providerId);
  if (!provider) return null;
  const parts = [
    scoreBudget(plan, allocation),
    scoreCoverage(plan, profile),
    scoreSegment(plan, profile),
    scoreProvider(plan, provider),
    scorePriorities(plan, profile, peers),
  ];
  const score = Math.min(100, Math.round(parts.reduce((s, part) => s + part.points, 0)));
  return { plan, provider, score, parts, why: buildWhy(plan, provider, parts) };
}

export interface Recommendation {
  byType: Partial<Record<CoverageType, Match[]>>;
  portfolio: Match[];
  totalPremium: number;
  budget: number;
  allocations: Record<CoverageType, number>;
}

export function recommend(profile: Profile): Recommendation {
  const allocations = budgetAllocations(profile);
  const plans = plansByTypes(profile.coverageTypes);
  const byType: Partial<Record<CoverageType, Match[]>> = {};

  for (const type of profile.coverageTypes) {
    const peers = plans.filter((p) => p.type === type);
    const matches = peers
      .map((plan) => scorePlan(plan, profile, peers, allocations[type]))
      .filter((m): m is Match => m !== null)
      .sort((a, b) => b.score - a.score);
    byType[type] = matches;
  }

  // Portfolio: best plan per type, then swap down the weakest budget-fit
  // until the combined premium fits the stated budget (or we run out of
  // cheaper alternatives).
  const chosen = new Map<CoverageType, number>(); // type -> index into byType list
  for (const type of profile.coverageTypes) chosen.set(type, 0);

  const total = () =>
    [...chosen.entries()].reduce((sum, [type, idx]) => {
      const match = byType[type]?.[idx];
      return sum + (match ? match.plan.monthlyPremium : 0);
    }, 0);

  let guard = 24;
  while (total() > profile.budget && guard-- > 0) {
    // Find the type whose current pick most exceeds its allocation and has a
    // cheaper next-best option.
    let worst: CoverageType | null = null;
    let worstOver = 0;
    for (const [type, idx] of chosen.entries()) {
      const list = byType[type] ?? [];
      const current = list[idx];
      if (!current) continue;
      const over = current.plan.monthlyPremium - allocations[type];
      const cheaperExists = list.slice(idx + 1).some((m) => m.plan.monthlyPremium < current.plan.monthlyPremium);
      if (cheaperExists && over > worstOver) {
        worst = type;
        worstOver = over;
      }
    }
    if (!worst) break;
    const list = byType[worst]!;
    let idx = chosen.get(worst)!;
    const currentPremium = list[idx].plan.monthlyPremium;
    while (idx + 1 < list.length && list[idx].plan.monthlyPremium >= currentPremium) idx++;
    chosen.set(worst, idx);
  }

  const portfolio = [...chosen.entries()]
    .map(([type, idx]) => byType[type]?.[idx])
    .filter((m): m is Match => Boolean(m));

  return {
    byType,
    portfolio,
    totalPremium: total(),
    budget: profile.budget,
    allocations,
  };
}
