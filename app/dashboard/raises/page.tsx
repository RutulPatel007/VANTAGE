"use client";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { formatRelativeTime } from "@/lib/utils";

export default function RaisesIndexPage() {
  const workspace = useWorkspaceStore((state) => state.workspace);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Raise engine"
        title="Active raises"
        description="Readiness, investor fit, and approval state across all raise graphs."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {workspace.raises.length ? (
          workspace.raises.map((raise) => {
            const company = workspace.companies.find((entry) => entry.id === raise.companyId);

            return (
              <Link key={raise.id} href={`/dashboard/raises/${raise.id}`} className="block">
                <Card className="h-full transition hover:bg-elevated">
                  <CardHeader>
                    <div>
                      <CardTitle>{company?.name ?? "Raise"}</CardTitle>
                      <p className="mt-1 text-sm text-text-2">Status: {raise.status}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-text-2">
                      <span>Readiness</span>
                      <span className="font-mono text-text-1">{raise.readiness.score}</span>
                    </div>
                    <p className="text-sm text-text-2">{raise.convictionNote}</p>
                    <p className="text-xs text-text-3">{formatRelativeTime(raise.createdAt)}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No raises yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-2">
                Run the Invest agent from the drawer to open the first raise graph and populate this surface.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
