import { BaseEdge, getSmoothStepPath, type EdgeProps } from "reactflow";

export function NetworkEdge(props: EdgeProps) {
  const [path] = getSmoothStepPath(props);

  return (
    <BaseEdge
      {...props}
      path={path}
      style={{
        stroke: "rgba(161,161,170,0.8)",
        strokeWidth: 1.2,
        strokeDasharray: "5 5",
      }}
    />
  );
}
