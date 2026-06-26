import {
  ADVISOR_MODEL,
  advisorSystemPrompt,
  getAnthropic,
  localAdvisorReply,
} from "@/lib/ai";
import type { ChatMessage, Profile } from "@/lib/types";

export const maxDuration = 60;

const encoder = new TextEncoder();

function streamText(text: string, mode: string): Response {
  // Word-by-word stream so the local fallback has the same feel as Claude.
  const stream = new ReadableStream({
    async start(controller) {
      const chunks = text.split(/(?<=\s)/);
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 14));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Advisor-Mode": mode,
    },
  });
}

export async function POST(request: Request) {
  let body: { messages?: ChatMessage[]; profile?: Profile | null; page?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const messages = (body.messages ?? [])
    .filter(
      (m): m is ChatMessage =>
        Boolean(m) &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0
    )
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (messages.length === 0 || messages.at(-1)?.role !== "user") {
    return Response.json({ error: "messages must end with a user turn" }, { status: 400 });
  }

  const anthropic = getAnthropic();
  if (!anthropic) {
    return streamText(localAdvisorReply(messages, body.profile), "local");
  }

  try {
    const claudeStream = anthropic.messages.stream({
      model: ADVISOR_MODEL,
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      system: advisorSystemPrompt(body.profile, typeof body.page === "string" ? body.page.slice(0, 100) : undefined),
      messages,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of claudeStream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch {
          controller.enqueue(
            encoder.encode("\n\n(NEXTAdvisor lost the connection mid-thought — please send that again.)")
          );
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Advisor-Mode": "claude",
      },
    });
  } catch {
    // Any client construction / auth failure: degrade gracefully.
    return streamText(localAdvisorReply(messages, body.profile), "local-fallback");
  }
}
