import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatRelativeTime } from "@/lib/utils";
import type { ExecutionLogRecord } from "@/lib/types";

export function ExecutionTimeline({ items }: { items: ExecutionLogRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Execution timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-base/60 px-4 py-4">
            <div className="mb-2 flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-text-1">{item.event}</p>
              <span className="text-xs text-text-3">{formatRelativeTime(item.occurredAt)}</span>
            </div>
            <p className="text-sm text-text-2">{item.description}</p>
            {item.entityHref ? (
              <Link href={item.entityHref} className="mt-3 inline-flex text-sm text-accent transition hover:text-white">
                View →
              </Link>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
