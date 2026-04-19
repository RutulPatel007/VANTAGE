"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ApprovalQueue } from "@/components/approvals/ApprovalQueue";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

export default function ApprovalsPage() {
  const workspace = useWorkspaceStore((state) => state.workspace);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Control plane"
        title="Approvals"
        description="Human-in-the-loop checkpoints for outbound actions."
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Pending approvals</CardTitle>
            <p className="mt-1 text-sm text-text-2">
              {workspace.approvals.filter((a) => a.status === "PENDING").length} items awaiting decision
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <ApprovalQueue approvals={workspace.approvals} />
        </CardContent>
      </Card>
    </div>
  );
}
