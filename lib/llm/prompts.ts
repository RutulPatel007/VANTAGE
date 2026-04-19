import type { CompanyEnrichment, EnrichedEntity } from "@/lib/crustdata/types";
import type { FundRecord, RaiseRecord, WorkspaceRecord } from "@/lib/types";

export interface FundContext {
  fundName: string;
  thesis: string;
  stage: string[];
  sectors: string[];
  geography: string[];
  portfolio: { name: string; sector: string; stage: string }[];
  activeAsks: { text: string; lane: string; status: string }[];
  activeRaises: { company: string; readinessScore: number }[];
  pendingApprovals: number;
  currentPage: string;
}

export function buildFundContext(workspace: WorkspaceRecord, currentPage: string): FundContext {
  return {
    fundName: workspace.fund.name,
    thesis: workspace.fund.thesis,
    stage: workspace.fund.stage,
    sectors: workspace.fund.sectors,
    geography: workspace.fund.geography,
    portfolio: workspace.companies.map((company) => ({
      name: company.name,
      sector: company.sector,
      stage: company.stage,
    })),
    activeAsks: workspace.asks.map((ask) => ({
      text: ask.text,
      lane: ask.lane,
      status: ask.status,
    })),
    activeRaises: workspace.raises.map((raise) => {
      const company = workspace.companies.find((entry) => entry.id === raise.companyId);
      return {
        company: company?.name ?? "Unknown",
        readinessScore: raise.readiness.score,
      };
    }),
    pendingApprovals: workspace.approvals.filter((approval) => approval.status === "PENDING").length,
    currentPage,
  };
}

function formatContext(context: FundContext) {
  return [
    `Fund: ${context.fundName}. Thesis: ${context.thesis}`,
    `Portfolio: ${context.portfolio.map((company) => `${company.name} (${company.sector})`).join(", ")}`,
    `Current context: ${context.activeAsks.length} asks, ${context.activeRaises.length} raises, ${context.pendingApprovals} pending approvals`,
    `Current page: ${context.currentPage}`,
  ].join("\n");
}

export function buildSalesPrompt(context: FundContext, enrichedData: EnrichedEntity[]) {
  return `${formatContext(context)}\nTask: Generate warm, personalized outbound sequences for ${enrichedData.length} people.`;
}

export function buildTalentPrompt(context: FundContext, jd: string, candidates: EnrichedEntity[]) {
  return `${formatContext(context)}\nTask: Score candidates for the following role:\n${jd}\nCandidate count: ${candidates.length}.`;
}

export function buildInvestPrompt(context: FundContext, company: CompanyEnrichment, raise?: RaiseRecord) {
  return `${formatContext(context)}\nTask: Build an invest memo for ${company.name} (${company.sector}). Raise context: ${raise?.status ?? "new raise"}.`;
}

export function buildCopilotSystemPrompt(context: FundContext) {
  return `${formatContext(context)}\nYou are the operating system copilot for a venture fund.`;
}
