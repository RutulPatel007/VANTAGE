import { NextRequest, NextResponse } from "next/server";

import { launchDemoWorkspace } from "@/lib/demo/runtime";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  return NextResponse.json(
    launchDemoWorkspace({
      fundName: body.fundName,
      thesis: body.thesis,
      portfolio: Array.isArray(body.portfolio) ? body.portfolio : undefined,
      network: Array.isArray(body.network) ? body.network : undefined,
      friendlyVcs: Array.isArray(body.friendlyVcs) ? body.friendlyVcs : undefined,
    }),
  );
}
