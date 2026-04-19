import type { Edge, Node } from "reactflow";

import type { GraphEdgeRecord, GraphNodeRecord, WorkspaceRecord } from "@/lib/types";

function buildNodeData(workspace: WorkspaceRecord, record: GraphNodeRecord) {
  if (record.type === "fund") {
    return workspace.fund;
  }
  if (record.type === "company") {
    return workspace.companies.find((company) => company.id === record.entityId);
  }
  if (record.type === "founder") {
    return workspace.people.find((person) => person.id === record.entityId);
  }
  if (record.type === "ask") {
    return workspace.asks.find((ask) => ask.id === record.entityId);
  }
  return workspace.raises.find((raise) => raise.id === record.entityId);
}

export function buildOperatingGraphModel(workspace: WorkspaceRecord) {
  const nodes: Node[] = workspace.graphNodes.map((record) => ({
    id: record.id,
    type: record.type,
    position: record.position,
    data: buildNodeData(workspace, record),
  }));

  const edges: Edge[] = workspace.graphEdges.map((record: GraphEdgeRecord) => ({
    id: record.id,
    source: record.fromNodeId,
    target: record.toNodeId,
    type: record.edgeType,
    data: record.metadata,
    animated: record.edgeType === "route",
  }));

  return { nodes, edges };
}
