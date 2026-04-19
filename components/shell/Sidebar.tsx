"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BadgeCheck,
  BrainCircuit,
  GitBranchPlus,
  LayoutGrid,
  MemoryStick,
  Radar,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Home", icon: LayoutGrid },
  { href: "/dashboard/graph", label: "Graph", icon: GitBranchPlus },
  { href: "/dashboard/raises", label: "Raises", icon: Radar },
  { href: "/dashboard/memory", label: "Memory", icon: MemoryStick },
  { href: "/dashboard/approvals", label: "Approvals", icon: BadgeCheck },
];

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <motion.aside
      layout
      className="sticky top-0 flex h-screen flex-col border-r border-border bg-surface/85 px-3 py-4 backdrop-blur-xl"
      animate={{ width: collapsed ? 72 : 220 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="mb-8 flex items-center gap-3 rounded-2xl border border-border bg-base/70 px-3 py-3 text-left transition hover:bg-elevated"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-glow">
          <BrainCircuit className="h-4 w-4" />
        </div>
        {!collapsed ? (
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-text-1">CapitalOS</p>
            <p className="text-xs text-text-3">VANTAGE</p>
          </div>
        ) : null}
      </button>

      <nav className="space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm transition",
                active
                  ? "border-accent/30 bg-accent/10 text-text-1"
                  : "text-text-2 hover:bg-elevated hover:text-text-1",
              )}
            >
              <span
                className={cn(
                  "h-9 w-1 rounded-full transition",
                  active ? "bg-accent" : "bg-transparent group-hover:bg-border",
                )}
              />
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed ? <span>{label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-border bg-base/70 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Activity className="h-4 w-4 text-signal" />
          {!collapsed ? <span className="text-xs uppercase tracking-[0.2em] text-text-3">Live Mode</span> : null}
        </div>
        {!collapsed ? (
          <p className="text-sm text-text-2">
            Demo-safe seed mode with hybrid providers for Gemini and Crustdata.
          </p>
        ) : null}
      </div>
    </motion.aside>
  );
}
