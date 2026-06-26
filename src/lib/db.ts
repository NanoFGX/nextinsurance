import { PLANS, PROVIDERS } from "./seed-data";
import type { Plan, Policy, Provider } from "./types";

/**
 * In-memory data layer. The plan/provider catalog is read-only seed data;
 * policies are demo-only and live for the lifetime of the server process.
 *
 * (We deliberately avoid node:sqlite / native modules so the app runs on any
 * Node 20+ runtime and deploys cleanly to serverless hosts like Vercel.)
 */

const g = globalThis as unknown as {
  __niPolicies?: Policy[];
};

g.__niPolicies ??= [];

const providerIndex = new Map<string, Provider>(PROVIDERS.map((p) => [p.id, p]));
const planIndex = new Map<string, Plan>(PLANS.map((p) => [p.id, p]));

export function allProviders(): Provider[] {
  return PROVIDERS;
}

export function allPlans(): Plan[] {
  return PLANS;
}

export function plansByTypes(types: string[]): Plan[] {
  if (types.length === 0) return [];
  const set = new Set(types);
  return PLANS.filter((p) => set.has(p.type));
}

export function planById(id: string): Plan | null {
  return planIndex.get(id) ?? null;
}

export function providerById(id: string): Provider | null {
  return providerIndex.get(id) ?? null;
}

export function insertPolicy(policy: Policy): void {
  g.__niPolicies!.unshift(policy);
}

export function policiesByUid(uid: string): Policy[] {
  return g.__niPolicies!.filter((p) => p.uid === uid);
}
