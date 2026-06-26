import { insertPolicy, planById, providerById } from "@/lib/db";
import { EWALLETS, FPX_BANKS, type PaymentMethod as Method } from "@/lib/payments";
import type { Policy } from "@/lib/types";

interface PurchaseBody {
  uid?: string;
  planId?: string;
  method?: Method;
  card?: string;
  holder?: string;
  bank?: string;
  wallet?: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  let body: PurchaseBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { uid, planId } = body;
  const method: Method = body.method ?? "card";
  if (!uid || !planId) {
    return Response.json({ error: "Missing uid or planId" }, { status: 400 });
  }

  let channel: string;
  if (method === "card") {
    const digits = (body.card ?? "").replace(/\D/g, "");
    if (digits.length < 12) {
      return Response.json({ error: "Card number looks incomplete" }, { status: 400 });
    }
    if (!body.holder || body.holder.trim().length < 2) {
      return Response.json({ error: "Cardholder name is required" }, { status: 400 });
    }
    // Deterministic demo decline path: any card ending 0000.
    if (digits.endsWith("0000")) {
      await sleep(1100);
      return Response.json(
        { error: "Payment declined by issuing bank (demo: cards ending 0000 always decline)" },
        { status: 402 }
      );
    }
    channel = `Card •••• ${digits.slice(-4)}`;
  } else if (method === "fpx") {
    if (!body.bank || !(FPX_BANKS as readonly string[]).includes(body.bank)) {
      return Response.json({ error: "Pick your bank to continue with FPX" }, { status: 400 });
    }
    channel = `FPX · ${body.bank}`;
  } else if (method === "ewallet") {
    if (!body.wallet || !(EWALLETS as readonly string[]).includes(body.wallet)) {
      return Response.json({ error: "Pick an e-wallet to continue" }, { status: 400 });
    }
    channel = body.wallet;
  } else {
    return Response.json({ error: "Unsupported payment method" }, { status: 400 });
  }

  const plan = planById(planId);
  if (!plan) {
    return Response.json({ error: "Plan not found" }, { status: 404 });
  }
  const provider = providerById(plan.providerId);

  // Simulated gateway round-trip (FPX redirects take a touch longer).
  await sleep(method === "card" ? 1100 : 1500);

  const start = new Date();
  const renewal = new Date(start);
  renewal.setFullYear(renewal.getFullYear() + 1);

  const policy: Policy = {
    id: `pol_${crypto.randomUUID().slice(0, 8)}`,
    uid,
    planId: plan.id,
    planName: plan.name,
    providerName: provider?.short ?? plan.providerId,
    type: plan.type,
    premium: plan.monthlyPremium,
    startDate: start.toISOString(),
    renewalDate: renewal.toISOString(),
    status: "active",
    paymentRef: `NXT-${Date.now().toString(36).toUpperCase()}`,
  };
  insertPolicy(policy);

  return Response.json({ policy, channel });
}
