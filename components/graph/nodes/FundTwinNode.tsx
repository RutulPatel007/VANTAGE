import type { NodeProps } from "reactflow";

export function FundTwinNode({ data }: NodeProps<any>) {
  return (
    <div className="rounded-[28px] border border-accent/30 bg-accent/10 px-6 py-4 shadow-glow">
      <p className="text-xs uppercase tracking-[0.24em] text-accent">Fund Twin</p>
      <p className="mt-1 text-sm font-semibold text-white">{data.name}</p>
    </div>
  );
}
