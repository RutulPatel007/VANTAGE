export type AskLane =
  | "HIRE"
  | "CUSTOMER_INTRO"
  | "ADVISOR_OPERATOR"
  | "VENDOR_PARTNER"
  | "RAISE";

export type Warmth = "INTERNAL" | "NETWORK" | "FRIENDLY_VC" | "EXTERNAL";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type AskStatus = "DRAFT" | "ROUTING" | "READY" | "EXECUTING";
export type RaiseStatus = "DRAFT" | "OPEN" | "APPROVAL_PENDING" | "APPROVED";
export type SignalSeverity = "low" | "medium" | "high";
export type GraphNodeType = "fund" | "company" | "founder" | "ask" | "raise";
export type GraphEdgeType = "portfolio" | "network" | "route" | "approval";

export interface FundRecord {
  id: string;
  name: string;
  thesis: string;
  stage: string[];
  sectors: string[];
  geography: string[];
  partnerCount: number;
  friendlyVcCount: number;
}

export interface CompanyRecord {
  id: string;
  name: string;
  domain: string;
  sector: string;
  stage: string;
  description: string;
  geography: string;
  signalState: "hydrated" | "stale";
  employeeCount: number;
  raiseReadiness: number;
}

export interface PersonRecord {
  id: string;
  name: string;
  currentTitle: string;
  companyId?: string;
  location: string;
  roleType: string;
  trustLevel: "high" | "medium" | "low";
}

export interface GraphNodeRecord {
  id: string;
  type: GraphNodeType;
  entityId: string;
  position: { x: number; y: number };
  metadata?: Record<string, unknown>;
}

export interface GraphEdgeRecord {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  edgeType: GraphEdgeType;
  weight: number;
  metadata?: Record<string, unknown>;
}

export interface SignalEventRecord {
  id: string;
  category: "portfolio" | "network" | "approvals" | "raises";
  entityName: string;
  description: string;
  severity: SignalSeverity;
  href: string;
  createdAt: string;
}

export interface ExecutionLogRecord {
  id: string;
  event: string;
  description: string;
  source: string;
  entityHref?: string;
  occurredAt: string;
}

export interface InvestorFitRecord {
  id: string;
  firmName: string;
  stageFit: number;
  geoFit: number;
  sectorFit: number;
  partnerMatch: number;
  compositeScore: number;
  warmPath: string;
}

export interface ReadinessRecord {
  score: number;
  factors: Array<{ label: string; score: number }>;
}

export interface RaiseRecord {
  id: string;
  companyId: string;
  status: RaiseStatus;
  convictionNote: string;
  ownerName: string;
  readiness: ReadinessRecord;
  investorFit: InvestorFitRecord[];
  dealMemo: string;
  createdAt: string;
  approvalId?: string;
}

export interface ApprovalRecord {
  id: string;
  raiseId?: string;
  askId?: string;
  title: string;
  summary: string;
  status: ApprovalStatus;
  requestedBy: string;
  decidedBy?: string;
  decisionNote?: string;
  requestedAt: string;
  decidedAt?: string;
}

export interface RouteCandidateRecord {
  id: string;
  personId: string;
  companyName: string;
  warmth: Warmth;
  compositeScore: number;
  dimensions: Array<{ label: string; score: number }>;
}

export interface AskRecord {
  id: string;
  companyId?: string;
  text: string;
  lane: AskLane;
  urgency: "HIGH" | "MEDIUM" | "LOW";
  status: AskStatus;
  topRouteCandidate?: string;
  approvalStatus?: ApprovalStatus;
  createdAt: string;
  routeCandidates: RouteCandidateRecord[];
}

export interface IntelligenceRecord {
  score: number;
  delta: number;
  components: Array<{ label: string; score: number; delta: number }>;
  history: Array<{ day: string; score: number }>;
}

export interface WorkspaceRecord {
  fund: FundRecord;
  companies: CompanyRecord[];
  people: PersonRecord[];
  graphNodes: GraphNodeRecord[];
  graphEdges: GraphEdgeRecord[];
  signals: SignalEventRecord[];
  asks: AskRecord[];
  raises: RaiseRecord[];
  approvals: ApprovalRecord[];
  executionLog: ExecutionLogRecord[];
  intelligence: IntelligenceRecord;
  launchedAt?: string;
}

export interface LaunchWorkspaceInput {
  fundName?: string;
  thesis?: string;
  portfolio?: string[];
  network?: string[];
  friendlyVcs?: string[];
}
