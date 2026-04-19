"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { TrendPill } from "@/components/ui/TrendPill";
import type { IntelligenceRecord } from "@/lib/types";

export function FundIntelligenceScore({ intelligence }: { intelligence: IntelligenceRecord }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Fund intelligence score</CardTitle>
          <p className="mt-1 text-sm text-text-2">How much smarter the fund is getting as the graph accumulates memory.</p>
        </div>
        <TrendPill value={intelligence.delta} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <p className="font-mono text-6xl text-text-1">{intelligence.score}</p>
          <div className="text-right text-sm text-text-2">
            <p>30-day trajectory</p>
            <p>Updated by graph actions and approvals</p>
          </div>
        </div>
        <div className="h-40 rounded-3xl border border-border bg-base/70 p-3">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={intelligence.history}>
                <defs>
                  <linearGradient id="intelligenceArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(99,102,241,0.7)" />
                    <stop offset="100%" stopColor="rgba(99,102,241,0)" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="rgba(161,161,170,0.7)" axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="rgb(99,102,241)" fill="url(#intelligenceArea)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full rounded-2xl shimmer" />
          )}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {intelligence.components.map((component) => (
            <div key={component.label} className="rounded-2xl border border-border bg-base/70 px-4 py-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm text-text-2">{component.label}</p>
                <TrendPill value={component.delta} />
              </div>
              <p className="font-mono text-2xl text-text-1">{component.score}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
