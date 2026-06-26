import { planById, providerById } from "@/lib/db";

export async function GET(_request: Request, ctx: RouteContext<"/api/plans/[id]">) {
  const { id } = await ctx.params;
  const plan = planById(id);
  if (!plan) {
    return Response.json({ error: "Plan not found" }, { status: 404 });
  }
  return Response.json({ plan, provider: providerById(plan.providerId) });
}
