import Anthropic from "@anthropic-ai/sdk";
import { allPlans, planById, providerById } from "./db";
import type { ChatMessage, FinePrintClause, Plan, Profile } from "./types";
import { COVERAGE_LABELS, SEGMENT_LABELS } from "./types";

export const ADVISOR_MODEL = process.env.NEXTADVISOR_MODEL || "claude-opus-4-8";

let client: Anthropic | null | undefined;

export function getAnthropic(): Anthropic | null {
  if (client !== undefined) return client;
  client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;
  return client;
}

export function aiMode(): "claude" | "local" {
  return getAnthropic() ? "claude" : "local";
}

function catalogDigest(): string {
  return allPlans()
    .map((plan) => {
      const provider = providerById(plan.providerId);
      const cover = plan.annualLimit
        ? `annual limit RM${plan.annualLimit.toLocaleString()}`
        : plan.coverAmount
          ? `cover RM${plan.coverAmount.toLocaleString()}`
          : "";
      return `- [${plan.id}] ${plan.name} (${provider?.short}, ${plan.type}): RM${plan.monthlyPremium}/mo, ${cover}, rating ${plan.rating}. ${plan.highlights[0] ?? ""}`;
    })
    .join("\n");
}

function profileDigest(profile?: Profile | null): string {
  if (!profile) return "The user has not completed onboarding yet.";
  return [
    `Segment: ${SEGMENT_LABELS[profile.segment]}`,
    `Age: ${profile.age}`,
    `Income bracket: ${profile.income}`,
    `Monthly budget: RM ${profile.budget}`,
    `Wants: ${profile.coverageTypes.map((t) => COVERAGE_LABELS[t]).join(", ")}`,
    `Dependents: ${profile.dependents}`,
    `Pre-existing conditions: ${profile.preexisting ? "yes" : "no"}`,
    `Priorities: ${profile.priorities.join(", ") || "not stated"}`,
  ].join("\n");
}

export function advisorSystemPrompt(profile?: Profile | null, page?: string): string {
  return `You are NEXTAdvisor, the AI insurance guide inside NEXTINSURANCE, a Malaysian AI-powered insurance recommender built by NEXTGEN Co. Your mission is the product's mission: kill complexity, agent bias, and analysis paralysis.
${page ? `\nThe user is currently on the ${page} page of the app.\n` : ""}

Rules:
- Be concise, warm, and concrete. Use RM amounts. Plain language; if you must use an insurance term, define it in one clause.
- You are commission-free. Never push a plan; compare honestly, including reasons NOT to pick something.
- Recommend only from the catalog below, referencing plans by name. If asked about something outside the catalog, say the prototype catalog is limited and answer generally.
- If the user hasn't onboarded, gently suggest the "Tell us what you need" flow for personalised match scores.
- Malaysian context: B40/M40/T20 brackets, takaful, NCD, e-hailing riders, BNM financial literacy goals.
- Keep answers under 150 words unless the user asks for depth.

User profile:
${profileDigest(profile)}

Plan catalog:
${catalogDigest()}`;
}

/**
 * Local fallback advisor — deterministic, data-backed answers so the
 * prototype is fully functional without an API key. Returns plain text.
 */
export function localAdvisorReply(messages: ChatMessage[], profile?: Profile | null): string {
  const last = messages.filter((m) => m.role === "user").at(-1)?.content.toLowerCase() ?? "";
  const plans = allPlans();
  const name = (id: string) => {
    const plan = planById(id);
    const provider = plan ? providerById(plan.providerId) : null;
    return plan ? `${plan.name} (${provider?.short}, RM ${plan.monthlyPremium}/mo)` : id;
  };

  // Jargon lookup
  const clauseHit = plans
    .flatMap((p) => p.fineprint.map((c) => ({ plan: p, clause: c })))
    .find(({ clause }) => last.includes(clause.term.toLowerCase()));
  if (clauseHit) {
    return `**${clauseHit.clause.term}**, in plain words: ${clauseHit.clause.plain}\n\nYou'll find this clause in plans like ${clauseHit.plan.name}. Open any plan's "Decode the fine print" panel to see its exact wording translated.`;
  }

  if (/cheap|murah|lowest|budget|afford/.test(last)) {
    const sorted = [...plans].sort((a, b) => a.monthlyPremium - b.monthlyPremium).slice(0, 3);
    return `The lowest-premium plans in our catalog right now:\n\n${sorted
      .map((p, i) => `${i + 1}. ${name(p.id)} — ${p.highlights[0]}`)
      .join("\n")}\n\nCheapest isn't always right, though — that's the analysis-paralysis trap. Run the 2-minute match flow and I'll weigh price against the cover you actually need.`;
  }

  if (/gig|grab|delivery|rider|freelan/.test(last)) {
    const gigPlans = plans.filter((p) => p.segments.includes("gig")).slice(0, 3);
    return `For gig work, the key is cover that flexes with your income and protects your earning ability:\n\n${gigPlans
      .map((p) => `• ${name(p.id)} — ${p.highlights[0]}`)
      .join("\n")}\n\nTigerSure plans also cover e-hailing/p-hailing use explicitly — many standard motor policies void claims that happen on a delivery job.`;
  }

  if (/family|anak|spouse|wife|husband|child/.test(last)) {
    const fam = plans.filter((p) => p.familyBundle).slice(0, 3);
    return `For households, bundled plans usually beat separate policies:\n\n${fam
      .map((p) => `• ${name(p.id)} — ${p.highlights[0]}`)
      .join("\n")}\n\nHornbill Health Prime adds dependants at 40% off, and MediCore Family 360 covers third+ children free.`;
  }

  if (/expat|nomad|foreign|oversea|abroad/.test(last)) {
    const ex = plans.filter((p) => p.multilingual && p.segments.includes("expat")).slice(0, 3);
    return `For expats and nomads, look for worldwide validity and multilingual claims support:\n\n${ex
      .map((p) => `• ${name(p.id)} — ${p.highlights[0]}`)
      .join("\n")}\n\nZenith plans accept overseas diagnoses from internationally-accredited hospitals — the clause that matters most when you live abroad.`;
  }

  if (/b40|m40|t20/.test(last)) {
    return `Malaysia groups households by income: **B40** is the bottom 40% (up to ~RM 5,250/month household income), **M40** the middle 40% (~RM 5,251 to RM 11,819), and **T20** the top 20% (above that).\n\nWe use your bracket only to size how much cover you realistically need and afford — a B40 gig rider and a T20 family need very different plans, and ranking them the same way would be lazy. It never changes the price of any plan.`;
  }

  if (/(difference|vs|versus|compare).*(critical|health)|(critical|health).*(difference|vs|versus)/.test(last)) {
    return `Quick way to think about it:\n\n• **Health/medical** pays your hospital bills directly (the medical card). The hospital gets the money.\n• **Critical illness** pays YOU a lump sum in cash when you're diagnosed with something serious — to replace income, pay the mortgage, or fund treatment your medical plan doesn't cover.\n\nThey stack, not compete: the medical card keeps the bills away, the CI payout keeps your life running while you recover. If budget forces a choice, most advisers in Malaysia start with the medical card.`;
  }

  if (/realistic.*budget|how much.*(budget|spend|pay)|budget.*realistic/.test(last)) {
    const income = profile?.income ?? "M40";
    const range = income === "B40" ? "RM 80 to RM 200" : income === "M40" ? "RM 200 to RM 450" : "RM 450 to RM 900";
    return `A common Malaysian rule of thumb is to put **5 to 10% of monthly income** towards protection.\n\nFor your ${income} bracket that's roughly **${range}/month** across everything (medical card first, then critical illness or life, then motor). Our cheapest credible medical card is RM 64/mo (NusaCare Value) and a solid starter combo lands around RM 150/mo — so even the low end buys real cover. Set what's honest for you in the budget step; the ranking respects it.`;
  }

  if (/lower.*(premium|cost)|save money|reduce.*(premium|cost)|cheaper.*portfolio/.test(last)) {
    return `Five honest ways to cut premium without gutting your cover:\n\n1. Accept a **co-payment or deductible** — sharing 5-10% of bills cuts premiums a lot\n2. Stay within your plan's **room & board limit** when admitted (protects the whole claim)\n3. **Bundle family** members — Hornbill and MediCore plans discount 40%+ for dependants\n4. Gig workers: **pause cover** in slow months with TigerSure-style flexible plans instead of cancelling\n5. Re-run your match yearly — loyalty is not rewarded in this market\n\nWhat I won't suggest: dropping your medical card to keep a gadget-insurance addon. Priorities matter.`;
  }

  if (/catch|hidden|gotcha|fine print|watch out/.test(last)) {
    return `The three clauses that bite people most, in any plan:\n\n1. **Waiting period** — illnesses aren't covered in the first 30-120 days, only accidents\n2. **Room & board cap** — pick a pricier hospital room and EVERY part of your claim gets cut proportionally, not just the room\n3. **Betterment** (motor) — older car + brand-new parts = you pay a share of repairs\n\nEvery plan page here has a "Decode the fine print" panel that translates its exact wording — read those three clauses before anything else.`;
  }

  if (/takaful|shariah|islam|halal/.test(last)) {
    return `Takaful is Shariah-compliant protection: contributors pool funds to help each other, surpluses are shared back, and payouts use a hibah structure that bypasses probate.\n\nIn our catalog, AmanahShield runs full takaful products — Amanah Medic Essential (health), Amanah Legacy Takaful (life), Amanah Motor Takaful, and Amanah CI Shield. Their motor plan includes flood cover by default, which most conventional insurers charge extra for.`;
  }

  if (/score|match|how.*(work|calculate)|why.*recommend/.test(last)) {
    return `Every Match Score is a transparent 100-point audit, not a black box:\n\n• Budget fit (30) — premium vs your stated RM budget\n• Coverage depth (25) — limits vs your needs profile\n• Segment match (20) — built for people like you?\n• Provider strength (15) — claims-settlement trust + ratings\n• Priority alignment (10) — what you said matters most\n\nRank order is score order. No commissions, no paid placement — that's the whole point of NEXTINSURANCE.`;
  }

  if (profile) {
    return `Based on your profile (${SEGMENT_LABELS[profile.segment]}, RM ${profile.budget}/mo budget), your Top Matches page is the best place to start — every plan there carries a transparent score breakdown.\n\nAsk me things like "what is a co-payment?", "cheapest health plan?", or "compare takaful vs conventional" and I'll answer from the catalog. (I'm running in offline mode right now — add an ANTHROPIC_API_KEY to .env.local and I get a full brain.)`;
  }

  return `Hi! I'm NEXTAdvisor. I can explain any insurance jargon in plain words, compare the ${plans.length} plans in our partnered catalog, or help you decide what cover you actually need.\n\nFastest path: hit "Find my cover" and answer 6 quick questions — you'll get ranked matches with transparent scores in about 2 minutes. Or just ask me something like "what is a waiting period?" (I'm in offline mode — set ANTHROPIC_API_KEY for the full Claude-powered me.)`;
}

/** Local fallback for the fine-print simplifier: use the curated decode. */
export function localSimplify(clause: FinePrintClause): string {
  return clause.plain;
}

export function simplifySystemPrompt(plan: Plan): string {
  return `You are the "Decode the fine print" feature of NEXTINSURANCE. The user is reading the policy wording of ${plan.name}. Rewrite the given clause in plain, friendly Malaysian English a first-time insurance buyer fully understands. Keep RM amounts and timeframes exact. Maximum 3 sentences, then one short practical tip starting with "Tip:". Do not add disclaimers.`;
}
