import { NextRequest, NextResponse } from "next/server";

import { approveRaise } from "@/lib/demo/runtime";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const approval = approveRaise({
    approvalId: body.approvalId,
    note: body.note ?? "Warm relationship with a16z, proceed.",
  });

  return NextResponse.json(approval);
}
