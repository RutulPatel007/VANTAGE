"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import type { ApprovalRecord } from "@/lib/types";

export function ApprovalQueue({ approvals }: { approvals: ApprovalRecord[] }) {
  const approveRaise = useWorkspaceStore((state) => state.approveRaise);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function approve(approvalId: string) {
    setPendingId(approvalId);
    approveRaise({
      approvalId,
      note: "Warm relationship with a16z, proceed.",
    });
    setPendingId(null);
  }

  return (
    <div className="space-y-4">
      {approvals.map((approval) => (
        <Card key={approval.id}>
          <CardHeader>
            <div>
              <CardTitle>{approval.title}</CardTitle>
              <p className="mt-1 text-sm text-text-2">{approval.summary}</p>
            </div>
            <Badge tone={approval.status === "APPROVED" ? "approved" : "pending"}>{approval.status}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {approval.decisionNote ? (
              <div className="rounded-2xl border border-border bg-base/70 px-4 py-3 text-sm text-text-2">
                {approval.decisionNote}
              </div>
            ) : null}
            {approval.status === "PENDING" ? (
              <Button className="w-full" onClick={() => approve(approval.id)} disabled={pendingId === approval.id}>
                {pendingId === approval.id ? "Approving..." : "Approve with note"}
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
