import { NextRequest } from "next/server";

import { investAgent } from "@/lib/agents/invest";
import { salesAgent } from "@/lib/agents/sales";
import { talentAgent } from "@/lib/agents/talent";

const encoder = new TextEncoder();

function sendEvent(event: string, data: unknown) {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const agentName = body.agentName as "sales" | "talent" | "invest";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const runner =
          agentName === "sales"
            ? salesAgent.run(salesAgent.inputSchema.parse(body.input))
            : agentName === "talent"
              ? talentAgent.run(talentAgent.inputSchema.parse(body.input))
              : investAgent.run(investAgent.inputSchema.parse(body.input));

        for await (const event of runner) {
          switch (event.type) {
            case "thinking":
              controller.enqueue(sendEvent("thinking", { text: event.text }));
              break;
            case "enriching":
              controller.enqueue(
                sendEvent("enriching", {
                  entity: event.entity,
                  mode: event.mode,
                  step: event.step,
                  total: event.total,
                }),
              );
              break;
            case "llm_chunk":
              controller.enqueue(sendEvent("llm_chunk", { text: event.text }));
              break;
            case "result":
              controller.enqueue(sendEvent("result", { agentName, output: event.output }));
              break;
            case "error":
              controller.enqueue(
                sendEvent("error", {
                  message: "message" in event ? event.message : "Agent execution failed.",
                }),
              );
              break;
          }
        }
      } catch (error) {
        controller.enqueue(
          sendEvent("error", {
            message: error instanceof Error ? error.message : "Agent execution failed.",
          }),
        );
      }

      controller.enqueue(sendEvent("done", {}));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
