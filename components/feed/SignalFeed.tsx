import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatRelativeTime } from "@/lib/utils";
import type { SignalEventRecord } from "@/lib/types";

export function SignalFeed({ signals }: { signals: SignalEventRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signal feed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {signals.map((signal) => (
          <Link
            key={signal.id}
            href={signal.href}
            className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-base/60 px-4 py-4 transition hover:bg-elevated"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium text-text-1">{signal.entityName}</p>
              <p className="text-sm text-text-2">{signal.description}</p>
            </div>
            <div className="shrink-0 text-right">
              <div className={`ml-auto mb-2 h-2.5 w-2.5 rounded-full ${signal.severity === "high" ? "bg-rejected" : signal.severity === "medium" ? "bg-pending" : "bg-signal"}`} />
              <p className="text-xs text-text-3">{formatRelativeTime(signal.createdAt)}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
