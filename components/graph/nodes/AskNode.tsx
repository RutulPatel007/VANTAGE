import type { NodeProps } from "reactflow";

export function AskNode({ data }: NodeProps<any>) {
  return (
    <div className="rounded-full border border-border bg-surface px-5 py-3 shadow-xl">
      <p className="text-xs uppercase tracking-[0.18em] text-text-3">{data.lane}</p>
      <p className="mt-1 max-w-[220px] text-sm text-text-1">{data.text}</p>
    </div>
  );
}
