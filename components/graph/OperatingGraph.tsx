"use client";

import "reactflow/dist/style.css";

import { useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";

import { Sheet } from "@/components/ui/Sheet";
import { CompanyTwinNode } from "@/components/graph/nodes/CompanyTwinNode";
import { FounderTwinNode } from "@/components/graph/nodes/FounderTwinNode";
import { FundTwinNode } from "@/components/graph/nodes/FundTwinNode";
import { RaiseNode } from "@/components/graph/nodes/RaiseNode";
import { AskNode } from "@/components/graph/nodes/AskNode";
import { ApprovalEdge } from "@/components/graph/edges/ApprovalEdge";
import { NetworkEdge } from "@/components/graph/edges/NetworkEdge";
import { PortfolioEdge } from "@/components/graph/edges/PortfolioEdge";
import { RouteEdge } from "@/components/graph/edges/RouteEdge";
import { buildOperatingGraphModel } from "@/lib/graph/builder";
import type { WorkspaceRecord } from "@/lib/types";

const nodeTypes = {
  fund: FundTwinNode,
  company: CompanyTwinNode,
  founder: FounderTwinNode,
  ask: AskNode,
  raise: RaiseNode,
};

const edgeTypes = {
  portfolio: PortfolioEdge,
  network: NetworkEdge,
  route: RouteEdge,
  approval: ApprovalEdge,
};

export function OperatingGraph({ workspace }: { workspace: WorkspaceRecord }) {
  const [selected, setSelected] = useState<any | null>(null);
  const { nodes, edges } = useMemo(() => buildOperatingGraphModel(workspace), [workspace]);

  return (
    <div className="surface-card h-[calc(100vh-10rem)] overflow-hidden">
      <div className="grid-noise h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          onNodeClick={(_, node) => setSelected(node.data)}
        >
          <MiniMap
            pannable
            zoomable
            style={{ background: "rgba(17,17,19,0.95)", width: 120, height: 80 }}
            nodeColor={() => "rgba(99,102,241,0.65)"}
          />
          <Controls />
          <Background color="rgba(255,255,255,0.08)" gap={24} />
        </ReactFlow>
      </div>

      <Sheet
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.name ?? selected?.ownerName ?? "Details"}
        description="Operating graph node details"
      >
        <div className="space-y-4 text-sm text-text-2">
          {selected ? (
            Object.entries(selected).map(([key, value]) => (
              <div key={key} className="rounded-2xl border border-border bg-base/70 px-4 py-3">
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-text-3">{key}</p>
                <p className="text-text-1">{typeof value === "object" ? JSON.stringify(value) : String(value)}</p>
              </div>
            ))
          ) : null}
        </div>
      </Sheet>
    </div>
  );
}
