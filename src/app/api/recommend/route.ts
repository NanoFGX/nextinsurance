import { recommend } from "@/lib/engine";
import type { CoverageType, Priority, Profile } from "@/lib/types";

const COVERAGE_TYPES: CoverageType[] = ["health", "life", "motor", "critical"];
const SEGMENTS = ["novice", "gig", "family", "expat"] as const;
const INCOMES = ["B40", "M40", "T20"] as const;
const PRIORITIES: Priority[] = ["price", "coverage", "flexibility", "cashless", "support"];

export async function POST(request: Request) {
  let body: Partial<Profile>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const coverageTypes = Array.isArray(body.coverageTypes)
    ? body.coverageTypes.filter((t): t is CoverageType => COVERAGE_TYPES.includes(t as CoverageType))
    : [];
  if (coverageTypes.length === 0) {
    return Response.json({ error: "Pick at least one coverage type" }, { status: 400 });
  }

  const budget = Number(body.budget);
  if (!Number.isFinite(budget) || budget < 30 || budget > 5000) {
    return Response.json({ error: "Budget must be between RM 30 and RM 5,000 per month" }, { status: 400 });
  }

  const age = Number(body.age);
  if (!Number.isFinite(age) || age < 18 || age > 80) {
    return Response.json({ error: "Age must be between 18 and 80" }, { status: 400 });
  }

  const profile: Profile = {
    uid: typeof body.uid === "string" ? body.uid : "anonymous",
    age,
    segment: SEGMENTS.includes(body.segment as (typeof SEGMENTS)[number]) ? body.segment! : "novice",
    income: INCOMES.includes(body.income as (typeof INCOMES)[number]) ? body.income! : "M40",
    coverageTypes,
    budget,
    dependents: Math.max(0, Math.min(10, Number(body.dependents) || 0)),
    preexisting: Boolean(body.preexisting),
    priorities: Array.isArray(body.priorities)
      ? body.priorities.filter((p): p is Priority => PRIORITIES.includes(p as Priority)).slice(0, 3)
      : [],
  };

  return Response.json(recommend(profile));
}
