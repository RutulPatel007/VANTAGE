import { BaseEdge, getSmoothStepPath, type EdgeProps } from "reactflow";

export function RouteEdge(props: EdgeProps) {
  const [path] = getSmoothStepPath(props);

  return (
    <BaseEdge
      {...props}
      path={path}
      style={{
        stroke: "rgb(20,184,166)",
        strokeWidth: 2,
        strokeDasharray: "8 4",
      }}
    />
  );
}
