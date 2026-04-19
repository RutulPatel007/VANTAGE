"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { OperatingGraph } from "@/components/graph/OperatingGraph";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

export default function GraphPage() {
  const workspace = useWorkspaceStore((state) => state.workspace);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Operating graph"
        title="Network map"
        description={`${workspace.graphNodes.length} nodes and ${workspace.graphEdges.length} edges mapping the fund's portfolio, founders, and network.`}
      />

      <div className="h-[calc(100vh-12rem)] rounded-3xl border border-border overflow-hidden">
        <OperatingGraph workspace={workspace} />
      </div>
    </div>
  );
}
