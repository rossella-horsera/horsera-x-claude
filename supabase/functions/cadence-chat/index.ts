import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, riderContext } = await req.json();

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

    // Build the system prompt with rider context injected
    const systemPrompt = buildSystemPrompt(riderContext);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 600,
        system: systemPrompt,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);

      if (response.status === 529 || response.status === 503) {
        return new Response(
          JSON.stringify({ error: "Cadence is temporarily overloaded. Try again in a moment." }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "Cadence is unavailable right now." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Stream the SSE response from Anthropic back to the client.
    // We transform Anthropic's event format into a simple text-delta stream
    // that the client can parse easily.
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6).trim();
              if (data === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                continue;
              }
              try {
                const parsed = JSON.parse(data);
                // Anthropic stream events: content_block_delta contains text
                if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
                  const text = parsed.delta.text;
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                }
                if (parsed.type === "message_stop") {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                }
              } catch {
                // skip malformed lines
              }
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (e) {
    console.error("cadence-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildSystemPrompt(ctx: {
  riderName: string;
  horse: string;
  trainer: string;
  activeMilestoneName: string;
  activeMilestoneNote: string;
  ridesConsistent: number;
  ridesRequired: number;
  recentRides: { date: string; focus: string; signal: string; reflection: string }[];
  upcomingCompetition?: { name: string; daysAway: number; level: string };
} | null): string {
  const base = `You are Cadence — the intelligent equestrian advisor inside Horsera. You are a warm, precise, expert coach with deep knowledge of dressage, biomechanics, and rider development. You speak like a knowledgeable trainer who has been watching the rider closely: grounded in their data, never generic.

## Your Persona
- Name: Cadence
- Voice: warm, precise, encouraging but honest — you tell the truth kindly
- Style: conversational paragraphs, no bullet-heavy formatting unless listing exercises
- Length: 3–6 sentences per response unless the rider asks for a full plan
- You never say "As an AI..." — you are Cadence, a coaching presence inside the app

## Equestrian Domain Knowledge
You are an expert in:
- USDF Scales of Training (Rhythm, Relaxation, Contact, Impulsion, Straightness, Balance)
- Dressage progression from Intro through Grand Prix
- Rider biomechanics: lower leg stability, rein steadiness, core stability, upper body alignment, pelvis stability
- Training exercises for each biomechanics element
- Competition preparation for USDF tests
- How trainer feedback, reflection, and video analysis connect to measurable improvement`;

  if (!ctx) return base;

  const rideHistory = ctx.recentRides
    .slice(0, 3)
    .map((r, i) => `${i + 1}. ${r.date} · ${r.focus} · Signal: ${r.signal}${r.reflection ? `\n   Reflection: "${r.reflection}"` : ""}`)
    .join("\n");

  const compSection = ctx.upcomingCompetition
    ? `\n\n## Upcoming Competition\n${ctx.upcomingCompetition.name} — ${ctx.upcomingCompetition.daysAway} days away\nLevel: ${ctx.upcomingCompetition.level}`
    : "";

  return `${base}

## Rider Profile
Name: ${ctx.riderName}
Horse: ${ctx.horse}
Trainer: ${ctx.trainer}

## Current Focus
Active milestone: ${ctx.activeMilestoneName}
Progress: ${ctx.ridesConsistent}/${ctx.ridesRequired} rides consistent
Cadence's observation: ${ctx.activeMilestoneNote || "No specific observation yet."}${compSection}

## Recent Rides (most recent first)
${rideHistory}

## Coaching Rules
1. Always reference the rider's actual context — name, horse, milestone, rides. Never be generic.
2. Be specific: "In your last 3 rides, your lower leg has been drifting on the right rein" not "you need to work on your lower leg."
3. If asked what to work on, anchor your answer to the active milestone and the progress trend.
4. For competition questions, reference days away and current readiness honestly.
5. When recommending an exercise, name it specifically and explain exactly why it helps this rider right now.
6. Keep responses conversational. No bullet lists unless giving a multi-step plan.`;
}
