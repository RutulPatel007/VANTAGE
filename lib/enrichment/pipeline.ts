import { crustdataClient } from "@/lib/crustdata/client";
import { getDemoWorkspace } from "@/lib/demo/runtime";
import type {
  CompanyEnrichment,
  CompanySearchResult,
  EnrichedEntity,
  PersonEnrichment,
  PersonSearchResult,
  WebSearchResult,
} from "@/lib/crustdata/types";
import type { WorkspaceRecord } from "@/lib/types";

export type EnrichmentMode = "person" | "person+geo" | "company";

export interface PipelineInput {
  mode: EnrichmentMode;
  query?: string;
  domain?: string;
  linkedinUrl?: string;
  location?: string;
  jobTitle?: string;
  companyName?: string;
  workspace?: WorkspaceRecord;
}

export interface PipelineResult {
  entities: EnrichedEntity[];
  webEvidence: WebSearchResult[];
  peerContext: EnrichedEntity[];
  refreshedAt: Date;
}

async function enrichPeople(
  searchResults: PersonSearchResult[],
  workspace: WorkspaceRecord,
): Promise<PersonEnrichment[]> {
  return Promise.all(
    searchResults.slice(0, 3).map((person) => crustdataClient.person.enrich(person.linkedinUrl, workspace)),
  );
}

async function enrichCompanies(
  searchResults: CompanySearchResult[],
  workspace: WorkspaceRecord,
): Promise<CompanyEnrichment[]> {
  return Promise.all(
    searchResults.slice(0, 3).map((company) => crustdataClient.company.enrich(company.domain, workspace)),
  );
}

function buildPeerCompanyContext(company: CompanyEnrichment, workspace: WorkspaceRecord): CompanyEnrichment[] {
  return workspace
    .companies.filter((entry) => entry.domain !== company.domain)
    .map((entry) => ({
      name: entry.name,
      domain: entry.domain,
      sector: entry.sector,
      stage: entry.stage,
      geography: entry.geography,
      description: entry.description,
      employeeCount: entry.employeeCount,
      growthSignal: `${entry.name} remains relevant peer context for routing and investor-fit analysis.`,
    }));
}

export async function runEnrichmentPipeline(input: PipelineInput): Promise<PipelineResult> {
  const workspace = input.workspace ?? getDemoWorkspace();

  if (input.mode === "person") {
    const searchResults = await crustdataClient.person.search({
      title: input.jobTitle ?? input.query,
      company: input.companyName,
      limit: 3,
    }, workspace);
    const entities = searchResults.length ? await enrichPeople(searchResults, workspace) : [];
    const webEvidence = await crustdataClient.web.search(
      `${input.companyName ?? "portfolio company"} ${input.jobTitle ?? input.query ?? "persona"}`,
      workspace,
    );

    return {
      entities,
      webEvidence,
      peerContext: entities,
      refreshedAt: new Date(),
    };
  }

  if (input.mode === "person+geo") {
    const searchResults = await crustdataClient.person.search({
      title: input.jobTitle ?? input.query,
      location: input.location,
      geoRadius: 20,
      limit: 3,
    }, workspace);
    const entities = searchResults.length ? await enrichPeople(searchResults, workspace) : [];
    const jobs = await crustdataClient.job.search({
      title: input.jobTitle ?? "VP Engineering",
      location: input.location,
      company: input.companyName,
    });

    return {
      entities,
      webEvidence: jobs.map((job) => ({
        title: `${job.company} hiring signal`,
        url: "#",
        snippet: `${job.title} role detected in ${job.location}.`,
      })),
      peerContext: entities,
      refreshedAt: new Date(),
    };
  }

  const company =
    input.domain
      ? await crustdataClient.company.enrich(input.domain, workspace)
      : (
          await enrichCompanies(
            await crustdataClient.company.search({ query: input.companyName ?? input.query }, workspace),
            workspace,
          )
        )[0] ?? await crustdataClient.company.enrich("linear.app", workspace);
  const peers = buildPeerCompanyContext(company, workspace);
  const webEvidence = await crustdataClient.web.search(`${company.name} market signal`, workspace);

  return {
    entities: [company],
    webEvidence,
    peerContext: peers,
    refreshedAt: new Date(),
  };
}
