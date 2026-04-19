"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

export function WorkspaceGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useWorkspaceStore((state) => state.hydrated);
  const launchedAt = useWorkspaceStore((state) => state.workspace.launchedAt);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!launchedAt && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [hydrated, launchedAt, pathname, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Loading workspace</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-2">
              Rehydrating your VANTAGE graph, approvals, and execution memory.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!launchedAt) {
    return null;
  }

  return <>{children}</>;
}
