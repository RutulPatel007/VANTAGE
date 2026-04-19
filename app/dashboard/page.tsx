"use client";

import { SignalFeed } from "@/components/feed/SignalFeed";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendPill } from "@/components/ui/TrendPill";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { formatRelativeTime } from "@/lib/utils";

export default function DashboardHomePage() {
  const workspace = useWorkspaceStore((state) => state.workspace);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Operating system"
        title="Portfolio pulse"
        description="A live view of signals, asks, and execution state across the seeded Sequoia Demo Fund graph."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Portfolio companies</CardTitle>
              <p className="mt-1 text-sm text-text-2">Hydrated nodes currently active in the graph.</p>
            </div>
            <TrendPill value={3} />
          </CardHeader>
          <CardContent>
            <p className="font-mono text-5xl text-text-1">{workspace.companies.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Pending approvals</CardTitle>
              <p className="mt-1 text-sm text-text-2">Human checkpoints before outbound action.</p>
            </div>
            <Badge tone="pending">Control plane</Badge>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-5xl text-text-1">
              {workspace.approvals.filter((approval) => approval.status === "PENDING").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Active asks</CardTitle>
              <p className="mt-1 text-sm text-text-2">Opportunities currently being routed through the graph.</p>
            </div>
            <Badge tone="signal">Warm paths</Badge>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-5xl text-text-1">{workspace.asks.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <SignalFeed signals={workspace.signals} />

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Active asks</CardTitle>
              <p className="mt-1 text-sm text-text-2">The board is intentionally light in this first demo cycle.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {workspace.asks.map((ask) => (
              <div key={ask.id} className="rounded-2xl border border-border bg-base/70 px-4 py-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <Badge tone="accent">{ask.lane}</Badge>
                  <span className="text-xs text-text-3">{formatRelativeTime(ask.createdAt)}</span>
                </div>
                <p className="text-sm text-text-1">{ask.text}</p>
                <p className="mt-2 text-sm text-text-2">Top route candidate: {ask.topRouteCandidate ?? "TBD"}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
