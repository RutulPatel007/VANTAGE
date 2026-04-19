import type { NodeProps } from "reactflow";

export function FounderTwinNode({ data }: NodeProps<any>) {
  const ring =
    data.trustLevel === "high"
      ? "border-accent"
      : data.trustLevel === "medium"
        ? "border-pending border-dashed"
        : "border-border";

  return (
    <div className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 bg-surface px-3 text-center ${ring}`}>
      <p className="text-[11px] font-semibold leading-4 text-text-1">{data.name}</p>
      <p className="mt-1 text-[10px] text-text-3">{data.roleType}</p>
    </div>
  );
}
