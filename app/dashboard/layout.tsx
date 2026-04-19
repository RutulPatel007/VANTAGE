import { DashboardShell } from "@/components/shell/DashboardShell";
import { WorkspaceGate } from "@/components/workspace/WorkspaceGate";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceGate>
      <DashboardShell>{children}</DashboardShell>
    </WorkspaceGate>
  );
}
