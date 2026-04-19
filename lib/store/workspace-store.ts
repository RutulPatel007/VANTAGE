"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { demoWorkspaceSeed } from "@/lib/demo/seed";
import type { LaunchWorkspaceInput, WorkspaceRecord } from "@/lib/types";
import {
  approveRaise as applyRaiseApproval,
  createRaiseFromInvest as applyRaiseCreation,
  getLaunchLogs,
  launchWorkspace,
  saveTalentAsk as applyTalentAsk,
} from "@/lib/workspace/mutations";

interface WorkspaceStore {
  hydrated: boolean;
  workspace: WorkspaceRecord;
  setHydrated: (hydrated: boolean) => void;
  resetWorkspace: () => void;
  launchWorkspace: (input?: LaunchWorkspaceInput) => { launchedAt?: string; logs: string[] };
  saveTalentAsk: (input?: { companyId?: string; text?: string; topRouteCandidate?: string }) => string | undefined;
  createRaiseFromInvest: (input: {
    companyId: string;
    convictionNote: string;
    dealMemo: string;
  }) => string | undefined;
  approveRaise: (input: { approvalId: string; note: string }) => string | undefined;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      hydrated: false,
      workspace: demoWorkspaceSeed,
      setHydrated: (hydrated) => set({ hydrated }),
      resetWorkspace: () => set({ workspace: demoWorkspaceSeed }),
      launchWorkspace: (input) => {
        const workspace = launchWorkspace(demoWorkspaceSeed, input);
        set({ workspace });
        return {
          launchedAt: workspace.launchedAt,
          logs: getLaunchLogs(workspace),
        };
      },
      saveTalentAsk: (input) => {
        const workspace = applyTalentAsk(get().workspace, input);
        const askId = workspace.asks[0]?.id;
        set({ workspace });
        return askId;
      },
      createRaiseFromInvest: (input) => {
        const workspace = applyRaiseCreation(get().workspace, input);
        const raiseId = workspace.raises[0]?.id;
        set({ workspace });
        return raiseId;
      },
      approveRaise: (input) => {
        const workspace = applyRaiseApproval(get().workspace, input);
        const resolvedRaiseId =
          workspace.approvals.find((approval) => approval.id === input.approvalId)?.raiseId;
        set({ workspace });
        return resolvedRaiseId;
      },
    }),
    {
      name: "vantage-workspace",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ workspace: state.workspace }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
