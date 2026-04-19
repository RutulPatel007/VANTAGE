import { BaseEdge, getSmoothStepPath, type EdgeProps } from "reactflow";

export function ApprovalEdge(props: EdgeProps) {
  const [path] = getSmoothStepPath(props);
  const approved = props.data?.status === "APPROVED";

  return (
    <BaseEdge
      {...props}
      path={path}
      style={{
        stroke: approved ? "rgb(16,185,129)" : "rgb(245,158,11)",
        strokeWidth: approved ? 2.2 : 1.8,
        strokeDasharray: approved ? "0" : "6 6",
      }}
    />
  );
}
