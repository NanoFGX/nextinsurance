import { getAnthropic, ADVISOR_MODEL, simplifySystemPrompt } from "@/lib/ai";
import { planById } from "@/lib/db";

export const maxDuration = 30;

export async function POST(request: Request) {
  let body: { planId?: string; term?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const plan = body.planId ? planById(body.planId) : null;
  if (!plan) {
    return Response.json({ error: "Plan not found" }, { status: 404 });
  }
  const clause = plan.fineprint.find((c) => c.term === body.term);
  if (!clause) {
    return Response.json({ error: "Clause not found" }, { status: 404 });
  }

  const anthropic = getAnthropic();
  if (anthropic) {
    try {
      const response = await anthropic.messages.create({
        model: ADVISOR_MODEL,
        max_tokens: 512,
        system: simplifySystemPrompt(plan),
        messages: [
          {
            role: "user",
            content: `Clause title: ${clause.term}\n\nPolicy wording:\n${clause.original}`,
          },
        ],
      });
      const text = response.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("");
      if (text.trim()) {
        return Response.json({ plain: text.trim(), mode: "claude" });
      }
    } catch {
      // fall through to curated decode
    }
  }

  return Response.json({ plain: clause.plain, mode: "library" });
}
