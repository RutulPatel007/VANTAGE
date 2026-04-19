"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ReadinessGauge } from "@/components/raises/ReadinessGauge";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

export default function RaisePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const workspace = useWorkspaceStore((state) => state.workspace);
  const id = typeof params.id === "string" ? params.id : "";
  const raise = workspace.raises.find((r) => r.id === id);

  useEffect(() => {
    if (!id || raise) {
      return;
    }

    router.replace("/dashboard/raises");
  }, [id, raise, router]);

  if (!raise) {
    return null;
  }

  const company = workspace.companies.find((c) => c.id === raise.companyId);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Raise graph"
        title={company?.name ?? "Raise"}
        description={`Status: ${raise.status}`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Deal memo</CardTitle>
              <p className="mt-1 text-sm text-text-2">{raise.dealMemo?.slice(0, 100)}...</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-2">{raise.dealMemo}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Conviction note</CardTitle>
              <p className="mt-1 text-sm text-text-2">Why this deal was surfaced</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-2">{raise.convictionNote}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Readiness factors</CardTitle>
              <p className="mt-1 text-sm text-text-2">Multi-dimensional assessment</p>
            </div>
          </CardHeader>
          <CardContent>
            <ReadinessGauge score={raise.readiness.score} factors={raise.readiness.factors} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Investor fit</CardTitle>
              <p className="mt-1 text-sm text-text-2">Ranked fund matches</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {raise.investorFit?.map((fit) => (
              <div key={fit.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                <div>
                  <p className="font-medium text-text-1">{fit.firmName}</p>
                  <p className="text-xs text-text-2">{fit.warmPath}</p>
                </div>
                <p className="font-mono text-lg text-accent">{Math.round(fit.compositeScore * 100)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
