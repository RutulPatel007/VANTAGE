import type {
  ApprovalRecord,
  ExecutionLogRecord,
  InvestorFitRecord,
  LaunchWorkspaceInput,
  RaiseRecord,
  RouteCandidateRecord,
  WorkspaceRecord,
} from "@/lib/types";

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function replaceReferences(text: string, replacements: Array<[string, string]>) {
  return replacements.reduce((current, [source, target]) => {
    if (!source || source === target) {
      return current;
    }

    return current.replaceAll(source, target);
  }, text);
}

function pushSignal(workspace: WorkspaceRecord, event: WorkspaceRecord["signals"][number]) {
  workspace.signals = [event, ...workspace.signals];
}

function pushLog(workspace: WorkspaceRecord, event: ExecutionLogRecord) {
  workspace.executionLog = [event, ...workspace.executionLog];
}

function bumpIntelligence(workspace: WorkspaceRecord, delta: number) {
  workspace.intelligence.score += delta;
  workspace.intelligence.delta = delta;
  workspace.intelligence.history.push({
    day: "Now",
    score: workspace.intelligence.score,
  });
}

function buildLaunchLogs(workspace: WorkspaceRecord) {
  return [
    `Identifying ${workspace.companies[0]?.name ?? "portfolio company"}... ✓`,
    `Enriching ${workspace.companies[0]?.name ?? "portfolio company"}... ✓`,
    `Finding ${workspace.companies[1]?.name ?? "operator"} operators... ✓`,
    `Hydrating ${workspace.companies[2]?.name ?? "portfolio"} signal state... ✓`,
    "Building graph edges... ✓",
  ];
}

export function launchWorkspace(seed: WorkspaceRecord, input: LaunchWorkspaceInput = {}) {
  const workspace = clone(seed);
  const replacements: Array<[string, string]> = [];

  if (input.fundName?.trim()) {
    workspace.fund.name = input.fundName.trim();
  }
  if (input.thesis?.trim()) {
    workspace.fund.thesis = input.thesis.trim();
  }
  if (input.friendlyVcs?.length) {
    workspace.fund.friendlyVcCount = input.friendlyVcs.filter(Boolean).length;
  }

  workspace.companies = workspace.companies.map((company, index) => {
    const nextName = input.portfolio?.[index]?.trim();
    if (!nextName) {
      return company;
    }

    replacements.push([company.name, nextName]);

    return {
      ...company,
      name: nextName,
      domain: `${slugify(nextName) || company.id.replace("company_", "")}.com`,
      description: `${nextName} is a tracked portfolio company in the ${workspace.fund.name} operating graph.`,
    };
  });

  workspace.people = workspace.people.map((person, index) => {
    const nextName = input.network?.[index]?.trim();
    if (!nextName) {
      return person;
    }

    replacements.push([person.name, nextName]);
    return {
      ...person,
      name: nextName,
    };
  });

  workspace.signals = workspace.signals.map((signal) => ({
    ...signal,
    entityName: replaceReferences(signal.entityName, replacements),
    description: replaceReferences(signal.description, replacements),
  }));

  workspace.asks = workspace.asks.map((ask) => ({
    ...ask,
    text: replaceReferences(ask.text, replacements),
    topRouteCandidate: ask.topRouteCandidate
      ? replaceReferences(ask.topRouteCandidate, replacements)
      : ask.topRouteCandidate,
  }));

  workspace.executionLog = workspace.executionLog.map((item) => ({
    ...item,
    description: replaceReferences(item.description, replacements),
  }));

  const launchedAt = new Date().toISOString();
  workspace.launchedAt = launchedAt;
  pushLog(workspace, {
    id: createId("log"),
    event: "Fund launched",
    description: `${workspace.fund.name} workspace was activated with synced portfolio, network, and approval context.`,
    source: "onboarding",
    entityHref: "/dashboard/graph",
    occurredAt: launchedAt,
  });

  return workspace;
}

export function getLaunchLogs(workspace: WorkspaceRecord) {
  return buildLaunchLogs(workspace);
}

export function createRaiseFromInvest(
  currentWorkspace: WorkspaceRecord,
  {
    companyId,
    convictionNote,
    dealMemo,
  }: {
    companyId: string;
    convictionNote: string;
    dealMemo: string;
  },
) {
  const workspace = clone(currentWorkspace);
  const company = workspace.companies.find((entry) => entry.id === companyId);

  if (!company) {
    throw new Error("Company not found");
  }

  const existing = workspace.raises.find((entry) => entry.companyId === companyId);
  if (existing) {
    return workspace;
  }

  const investorFit: InvestorFitRecord[] = [
    { id: createId("fit"), firmName: "a16z", stageFit: 0.91, geoFit: 0.82, sectorFit: 0.88, partnerMatch: 0.94, compositeScore: 0.91, warmPath: "Warm relationship via Rita Singh" },
    { id: createId("fit"), firmName: "Benchmark", stageFit: 0.86, geoFit: 0.77, sectorFit: 0.85, partnerMatch: 0.72, compositeScore: 0.83, warmPath: "Shared operator network" },
    { id: createId("fit"), firmName: "Index Ventures", stageFit: 0.8, geoFit: 0.88, sectorFit: 0.81, partnerMatch: 0.74, compositeScore: 0.81, warmPath: "Friendly VC overlap" },
    { id: createId("fit"), firmName: "ICONIQ", stageFit: 0.78, geoFit: 0.69, sectorFit: 0.83, partnerMatch: 0.76, compositeScore: 0.78, warmPath: "Partner intro path" },
    { id: createId("fit"), firmName: "Founders Fund", stageFit: 0.72, geoFit: 0.64, sectorFit: 0.8, partnerMatch: 0.61, compositeScore: 0.73, warmPath: "Cold but relevant" },
  ];

  const approvalId = createId("approval");
  const raiseId = createId("raise");
  const raise: RaiseRecord = {
    id: raiseId,
    companyId,
    status: "APPROVAL_PENDING",
    convictionNote,
    ownerName: "CapitalOS Invest Agent",
    dealMemo,
    readiness: {
      score: 78,
      factors: [
        { label: "Team", score: 81 },
        { label: "Market", score: 84 },
        { label: "Traction", score: 74 },
        { label: "Cap Table", score: 68 },
        { label: "Narrative", score: 82 },
      ],
    },
    investorFit,
    createdAt: new Date().toISOString(),
    approvalId,
  };

  const approval: ApprovalRecord = {
    id: approvalId,
    raiseId,
    title: `Investor outreach approval for ${company.name}`,
    summary: "Top investor paths are ready to route through the network graph.",
    status: "PENDING",
    requestedBy: "Invest Agent",
    requestedAt: new Date().toISOString(),
  };

  workspace.raises = [raise, ...workspace.raises];
  workspace.approvals = [approval, ...workspace.approvals];
  workspace.graphNodes = [
    ...workspace.graphNodes,
    {
      id: `node_${raiseId}`,
      type: "raise",
      entityId: raiseId,
      position: { x: 480, y: 420 },
    },
  ];
  workspace.graphEdges = [
    ...workspace.graphEdges,
    {
      id: `edge_raise_${companyId}`,
      fromNodeId: "node_fund",
      toNodeId: `node_${raiseId}`,
      edgeType: "approval",
      weight: 0.92,
      metadata: { status: "PENDING" },
    },
    {
      id: `edge_route_${companyId}`,
      fromNodeId: `node_${raiseId}`,
      toNodeId: "node_rita",
      edgeType: "route",
      weight: 0.87,
      metadata: { active: true },
    },
  ];

  pushSignal(workspace, {
    id: createId("signal"),
    category: "raises",
    entityName: company.name,
    description: "Invest agent opened a raise graph and submitted outreach for approval.",
    severity: "medium",
    href: `/dashboard/raises/${raiseId}`,
    createdAt: new Date().toISOString(),
  });
  pushLog(workspace, {
    id: createId("log"),
    event: "Raise graph opened",
    description: `${company.name} raise created with ranked investor fit paths.`,
    source: "invest-agent",
    entityHref: `/dashboard/raises/${raiseId}`,
    occurredAt: new Date().toISOString(),
  });
  bumpIntelligence(workspace, 4);

  return workspace;
}

export function approveRaise(
  currentWorkspace: WorkspaceRecord,
  { approvalId, note }: { approvalId: string; note: string },
) {
  const workspace = clone(currentWorkspace);
  const approval = workspace.approvals.find((entry) => entry.id === approvalId);
  if (!approval) {
    throw new Error("Approval not found");
  }

  approval.status = "APPROVED";
  approval.decidedBy = "Partner";
  approval.decisionNote = note;
  approval.decidedAt = new Date().toISOString();

  const raise = workspace.raises.find((entry) => entry.id === approval.raiseId);
  if (raise) {
    raise.status = "APPROVED";
  }

  workspace.graphEdges = workspace.graphEdges.map((edge) =>
    edge.edgeType === "approval" && raise && edge.toNodeId === `node_${raise.id}`
      ? {
          ...edge,
          metadata: { ...(edge.metadata ?? {}), status: "APPROVED" },
        }
      : edge,
  );

  const companyName = raise
    ? workspace.companies.find((entry) => entry.id === raise.companyId)?.name ?? "Raise"
    : "Raise";

  pushSignal(workspace, {
    id: createId("signal"),
    category: "approvals",
    entityName: companyName,
    description: "Approval gate cleared and investor outreach route is now active.",
    severity: "low",
    href: raise ? `/dashboard/raises/${raise.id}` : "/dashboard/approvals",
    createdAt: new Date().toISOString(),
  });
  pushLog(workspace, {
    id: createId("log"),
    event: "Approval granted",
    description: note,
    source: "approvals",
    entityHref: raise ? `/dashboard/raises/${raise.id}` : "/dashboard/approvals",
    occurredAt: new Date().toISOString(),
  });
  bumpIntelligence(workspace, 3);

  return workspace;
}

export function saveTalentAsk(
  currentWorkspace: WorkspaceRecord,
  input?: { companyId?: string; text?: string; topRouteCandidate?: string },
) {
  const workspace = clone(currentWorkspace);
  const companyId = input?.companyId ?? "company_linear";
  const companyName =
    workspace.companies.find((company) => company.id === companyId)?.name ?? "Portfolio Company";
  const routeCandidates: RouteCandidateRecord[] = [
    {
      id: createId("route"),
      personId: "person_daniel",
      companyName,
      warmth: "INTERNAL",
      compositeScore: 0.89,
      dimensions: [
        { label: "Relationship", score: 0.95 },
        { label: "Response Rate", score: 0.88 },
        { label: "Relevance", score: 0.92 },
        { label: "Seniority", score: 0.82 },
        { label: "Context", score: 0.87 },
      ],
    },
  ];

  const askId = createId("ask");
  const ask = {
    id: askId,
    companyId,
    text: input?.text ?? "Hire a VP Engineering for a Series B, remote-friendly B2B SaaS team.",
    lane: "HIRE" as const,
    urgency: "HIGH" as const,
    status: "READY" as const,
    topRouteCandidate: input?.topRouteCandidate ?? "Daniel Gross",
    approvalStatus: "PENDING" as const,
    createdAt: new Date().toISOString(),
    routeCandidates,
  };

  workspace.asks = [ask, ...workspace.asks];
  workspace.graphNodes = [
    ...workspace.graphNodes,
    {
      id: `node_${ask.id}`,
      type: "ask",
      entityId: ask.id,
      position: { x: 720, y: 470 },
    },
  ];
  workspace.graphEdges = [
    ...workspace.graphEdges,
    {
      id: `edge_ask_${ask.id}`,
      fromNodeId: `node_${companyId.replace("company_", "")}`,
      toNodeId: `node_${ask.id}`,
      edgeType: "route",
      weight: 0.82,
      metadata: { active: true },
    },
  ];
  pushSignal(workspace, {
    id: createId("signal"),
    category: "network",
    entityName: companyName,
    description: "Talent agent saved a warm VP Engineering route into the ask graph.",
    severity: "medium",
    href: "/dashboard",
    createdAt: new Date().toISOString(),
  });
  pushLog(workspace, {
    id: createId("log"),
    event: "Talent ask created",
    description: `New HIRE lane ask saved for ${companyName}.`,
    source: "talent-agent",
    entityHref: "/dashboard",
    occurredAt: new Date().toISOString(),
  });
  bumpIntelligence(workspace, 2);

  return workspace;
}
