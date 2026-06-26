import { allPlans, allProviders, plansByTypes } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const types = url.searchParams.get("types");
  const plans = types ? plansByTypes(types.split(",")) : allPlans();
  return Response.json({ plans, providers: allProviders() });
}
