import { NextRequest, NextResponse } from "next/server";

import { salesAgent } from "@/lib/agents/sales";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const input = salesAgent.inputSchema.parse(body);

  let output: unknown = null;
  for await (const event of salesAgent.run(input)) {
    if (event.type === "result") {
      output = event.output;
    }
  }

  return NextResponse.json(output);
}
