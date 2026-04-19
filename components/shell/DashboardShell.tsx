"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { AgentDrawer } from "@/components/shell/AgentDrawer";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { NotificationBell } from "@/components/shell/NotificationBell";
import { Sidebar } from "@/components/shell/Sidebar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useUiStore } from "@/lib/store/ui-store";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    setAgentDrawerOpen,
  } = useUiStore();
  const fundName = useWorkspaceStore((state) => state.workspace.fund.name);
  const signalCount = useWorkspaceStore((state) => state.workspace.signals.length);

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-border bg-base/70 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
            <div className="flex items-center gap-3">
              <Badge tone="accent">{fundName}</Badge>
              <AnimatePresence>
                {!sidebarCollapsed ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="hidden text-sm text-text-2 lg:block"
                  >
                    Demo spine active with seeded graph and hybrid providers.
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2">
              <CommandPalette />
              <NotificationBell count={signalCount} />
              <Button variant="secondary" onClick={() => setAgentDrawerOpen(true)}>
                <Sparkles className="h-4 w-4" />
                Agents
              </Button>
            </div>
          </div>
        </header>
        <main className="px-5 py-6 lg:px-8">{children}</main>
      </div>
      <AgentDrawer />
    </div>
  );
}
