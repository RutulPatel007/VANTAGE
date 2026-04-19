import { NextRequest, NextResponse } from "next/server";

import { talentAgent } from "@/lib/agents/talent";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const input = talentAgent.inputSchema.parse(body);

  let output: unknown = null;
  for await (const event of talentAgent.run(input)) {
    if (event.type === "result") {
      output = event.output;
    }
  }

  return NextResponse.json(output);
}
