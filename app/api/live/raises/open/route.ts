import { NextRequest, NextResponse } from "next/server";

import { createRaiseFromInvest } from "@/lib/demo/runtime";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const raise = createRaiseFromInvest({
    companyId: body.companyId,
    convictionNote: body.convictionNote,
    dealMemo: body.dealMemo,
  });

  return NextResponse.json(raise);
}
