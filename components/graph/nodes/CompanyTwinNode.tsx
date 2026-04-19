import type { NodeProps } from "reactflow";

import { Badge } from "@/components/ui/Badge";

export function CompanyTwinNode({ data }: NodeProps<any>) {
  return (
    <div className="min-w-[220px] rounded-3xl border border-border bg-surface px-4 py-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <Badge tone="signal">{data.sector}</Badge>
        <span className={`h-2.5 w-2.5 rounded-full ${data.signalState === "hydrated" ? "bg-signal" : "bg-pending"}`} />
      </div>
      <p className="text-sm font-semibold text-text-1">{data.name}</p>
      <p className="mt-1 text-xs text-text-2">{data.stage} · {data.geography}</p>
    </div>
  );
}
