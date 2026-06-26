import { policiesByUid } from "@/lib/db";
import type { CoverageType } from "@/lib/types";

const ALL_TYPES: CoverageType[] = ["health", "life", "motor", "critical"];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const uid = url.searchParams.get("uid");
  if (!uid) {
    return Response.json({ error: "Missing uid" }, { status: 400 });
  }
  const policies = policiesByUid(uid);
  const covered = new Set(policies.filter((p) => p.status === "active").map((p) => p.type));
  const gaps = ALL_TYPES.filter((t) => !covered.has(t));
  const totalPremium = policies
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + p.premium, 0);
  return Response.json({ policies, gaps, totalPremium });
}
