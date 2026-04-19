import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from "reactflow";

export function PortfolioEdge(props: EdgeProps) {
  const [path] = getSmoothStepPath(props);

  return (
    <>
      <BaseEdge {...props} path={path} style={{ stroke: "rgb(99,102,241)", strokeWidth: 1.5 }} />
      <EdgeLabelRenderer>
        <div />
      </EdgeLabelRenderer>
    </>
  );
}
