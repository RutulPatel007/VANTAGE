import { NextRequest, NextResponse } from "next/server";

import { saveTalentAsk } from "@/lib/demo/runtime";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  return NextResponse.json(
    saveTalentAsk({
      companyId: body.companyId,
      text: body.text,
      topRouteCandidate: body.topRouteCandidate,
    }),
  );
}
