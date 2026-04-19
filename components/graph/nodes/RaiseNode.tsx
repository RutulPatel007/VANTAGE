import type { NodeProps } from "reactflow";

export function RaiseNode({ data }: NodeProps<any>) {
  return (
    <div className="min-w-[240px] rounded-[28px] border border-border bg-surface px-4 py-4 shadow-xl">
      <p className="text-xs uppercase tracking-[0.2em] text-text-3">Raise Graph</p>
      <p className="mt-1 text-sm font-semibold text-text-1">{data.ownerName}</p>
      <div className="mt-4 h-2 rounded-full bg-base">
        <div className="h-full rounded-full bg-approved" style={{ width: `${data.readiness.score}%` }} />
      </div>
    </div>
  );
}
