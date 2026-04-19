"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ExecutionTimeline } from "@/components/memory/ExecutionTimeline";
import { FundIntelligenceScore } from "@/components/memory/FundIntelligenceScore";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

export default function MemoryPage() {
  const workspace = useWorkspaceStore((state) => state.workspace);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Historical record"
        title="Execution memory"
        description="A complete timeline of signals, asks, and actions across the fund's operating history."
      />

      <FundIntelligenceScore intelligence={workspace.intelligence} />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Execution log</CardTitle>
            <p className="mt-1 text-sm text-text-2">
              {workspace.executionLog.length} events recorded
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <ExecutionTimeline items={workspace.executionLog} />
        </CardContent>
      </Card>
    </div>
  );
}
