"use client";

import { Command } from "lucide-react";

export function CommandPalette() {
  return (
    <button
      type="button"
      className="hidden items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2 text-sm text-text-2 transition hover:bg-elevated hover:text-text-1 md:inline-flex"
    >
      <Command className="h-4 w-4" />
      Search graph, asks, memory
      <span className="rounded-lg border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-text-3">
        K
      </span>
    </button>
  );
}
