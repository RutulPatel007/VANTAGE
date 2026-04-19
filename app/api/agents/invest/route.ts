import { NextRequest, NextResponse } from "next/server";

import { investAgent } from "@/lib/agents/invest";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const input = investAgent.inputSchema.parse(body);

  let output: unknown = null;
  for await (const event of investAgent.run(input)) {
    if (event.type === "result") {
      output = event.output;
    }
  }

  return NextResponse.json(output);
}
