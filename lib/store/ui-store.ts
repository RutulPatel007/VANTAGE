"use client";

import { create } from "zustand";

type AgentTab = "sales" | "talent" | "invest";

interface UiState {
  sidebarCollapsed: boolean;
  agentDrawerOpen: boolean;
  activeAgentTab: AgentTab;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setAgentDrawerOpen: (open: boolean) => void;
  setActiveAgentTab: (tab: AgentTab) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  agentDrawerOpen: false,
  activeAgentTab: "invest",
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setAgentDrawerOpen: (agentDrawerOpen) => set({ agentDrawerOpen }),
  setActiveAgentTab: (activeAgentTab) => set({ activeAgentTab }),
}));
