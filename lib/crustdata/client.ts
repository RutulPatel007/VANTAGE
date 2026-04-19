import type {
  AutocompleteResult,
  CompanyEnrichment,
  CompanyIdentity,
  CompanySearchParams,
  CompanySearchResult,
  JobSearchParams,
  JobSearchResult,
  PersonEnrichment,
  PersonSearchParams,
  PersonSearchResult,
  WebPageEnrichment,
  WebSearchResult,
} from "@/lib/crustdata/types";
import { buildCompanySearchBody, buildPersonSearchBody } from "@/lib/crustdata/request-builders";
import { getDemoWorkspace } from "@/lib/demo/runtime";
import type { WorkspaceRecord } from "@/lib/types";

type CacheEntry<T> = { expiresAt: number; value: T };

const BASE_URL = "https://api.crustdata.com";
const API_VERSION = "2025-11-01";
const cache = new Map<string, CacheEntry<unknown>>();

function getCacheKey(endpoint: string, payload: object) {
  return `${endpoint}:${JSON.stringify(payload)}`;
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout(ms: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return { controller, timeout };
}

function normalizeDomain(domain: string) {
  return domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");
}

function domainsMatch(requestedDomain: string, returnedDomain?: string) {
  if (!returnedDomain) {
    return false;
  }

  const requested = normalizeDomain(requestedDomain);
  const returned = normalizeDomain(returnedDomain);

  return requested === returned || requested.endsWith(returned) || returned.endsWith(requested);
}

function resolveWorkspace(workspace?: WorkspaceRecord) {
  return workspace ?? getDemoWorkspace();
}

function searchDemoCompanies(params: CompanySearchParams, workspace?: WorkspaceRecord): CompanySearchResult[] {
  return resolveWorkspace(workspace).companies
    .filter((company) => {
      const query = params.query?.toLowerCase();
      const sector = params.sector?.toLowerCase();
      const geography = params.geography?.toLowerCase();

      if (query && !`${company.name} ${company.description}`.toLowerCase().includes(query)) {
        return false;
      }
      if (sector && !company.sector.toLowerCase().includes(sector)) {
        return false;
      }
      if (geography && !company.geography.toLowerCase().includes(geography)) {
        return false;
      }

      return true;
    })
    .map((company) => ({
      name: company.name,
      domain: company.domain,
      sector: company.sector,
      stage: company.stage,
      geography: company.geography,
    }))
    .slice(0, params.limit ?? 10);
}

function buildDemoCompanyEnrichment(domain: string, workspace?: WorkspaceRecord): CompanyEnrichment {
  const company = resolveWorkspace(workspace).companies.find((entry) => entry.domain === domain);
  if (company) {
    return {
      name: company.name,
      domain: company.domain,
      sector: company.sector,
      stage: company.stage,
      geography: company.geography,
      description: company.description,
      employeeCount: company.employeeCount,
      growthSignal: `${company.name} shows durable workflow pull and strong operator density.`,
    };
  }

  return {
    name: domain.split(".")[0],
    domain,
    sector: "B2B SaaS",
    stage: "Series A",
    geography: "United States",
    description: "Fallback company enrichment record.",
    employeeCount: 120,
    growthSignal: "Healthy pipeline momentum",
  };
}

function parseLiveCompany(item: any, requestedDomain?: string): CompanyEnrichment {
  const resolvedDomain =
    item.company_website_domain ??
    item.website_domain ??
    item.website?.replace(/^https?:\/\//, "").replace(/\/.*$/, "") ??
    requestedDomain ??
    "";

  if (requestedDomain && !domainsMatch(requestedDomain, resolvedDomain)) {
    throw new Error(`Crustdata returned a mismatched company for ${requestedDomain}`);
  }

  const headcount =
    item.headcount?.linkedin_headcount ??
    item.headcount?.headcount ??
    item.employee_count ??
    item.linkedin_employee_count ??
    0;
  const headcountGrowth =
    item.headcount?.linkedin_headcount_total_growth_percent?.six_months ??
    item.employee_growth_percentages?.find?.((entry: any) => entry.timespan === "SIX_MONTHS")?.percentage;

  return {
    name: item.company_name ?? item.name ?? requestedDomain?.split(".")[0] ?? "Unknown",
    domain: resolvedDomain,
    sector: item.industry ?? item.taxonomy?.linkedin_industry ?? "B2B SaaS",
    stage:
      item.last_funding_stage ??
      item.latest_funding_round?.stage ??
      item.latest_investment_stage ??
      (headcount > 500 ? "Growth" : headcount > 200 ? "Series B" : "Series A"),
    geography:
      item.location ??
      item.headquarters?.city ??
      item.headquarters?.country ??
      item.hq_country ??
      "Unknown",
    description:
      item.linkedin_company_description ??
      item.description ??
      item.tagline ??
      "Crustdata company enrichment result.",
    employeeCount: headcount,
    growthSignal:
      typeof headcountGrowth === "number"
        ? `Headcount grew ${headcountGrowth}% over the last six months.`
        : "Company enrichment retrieved from Crustdata.",
  };
}

async function fetchWithRetry<T>({
  endpoint,
  payload,
  ttlMs,
  method = "POST",
  query,
  authPreference = "bearer",
}: {
  endpoint: string;
  payload?: object;
  ttlMs: number;
  method?: "GET" | "POST";
  query?: URLSearchParams;
  authPreference?: "bearer" | "token";
}): Promise<T> {
  const cacheKey = getCacheKey(endpoint, { payload, query: query?.toString(), method, authPreference });
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value as T;
  }

  const apiKey = process.env.CRUSTDATA_API_KEY;
  if (!apiKey) {
    throw new Error("CRUSTDATA_API_KEY is not configured");
  }

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const authValue =
      authPreference === "token" ? `Token ${apiKey}` : `Bearer ${apiKey}`;

    try {
      const url = query?.size ? `${BASE_URL}${endpoint}?${query.toString()}` : `${BASE_URL}${endpoint}`;
      const { controller, timeout } = withTimeout(6_000);
      const response = await fetch(url, {
        method,
        signal: controller.signal,
        headers: {
          ...(method === "POST" ? { "Content-Type": "application/json" } : {}),
          Authorization: authValue,
          ...(authPreference === "bearer" ? { "x-api-version": API_VERSION } : {}),
        },
        ...(method === "POST" && payload ? { body: JSON.stringify(payload) } : {}),
      }).finally(() => clearTimeout(timeout));

      if (response.status === 429) {
        throw new Error("Rate limited by Crustdata");
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = (await response.json()) as T;
      cache.set(cacheKey, {
        expiresAt: Date.now() + ttlMs,
        value: result,
      });
      return result;
    } catch (error) {
      lastError = error as Error;
      if (attempt < 2) {
        await sleep(300 * 2 ** attempt);
      }
    }
  }

  throw lastError ?? new Error("Crustdata request failed");
}

function searchDemoPeople(params: PersonSearchParams, workspace?: WorkspaceRecord): PersonSearchResult[] {
  const resolvedWorkspace = resolveWorkspace(workspace);
  const people = resolvedWorkspace.people;
  return people
    .filter((person) => {
      const matchesLocation = !params.location || person.location.toLowerCase().includes(params.location.toLowerCase());
      const matchesTitle = !params.title || person.currentTitle.toLowerCase().includes(params.title.toLowerCase());
      const companyName = resolvedWorkspace.companies.find((company) => company.id === person.companyId)?.name ?? "";
      const matchesCompany = !params.company || companyName.toLowerCase().includes(params.company.toLowerCase());

      return matchesLocation && matchesTitle && matchesCompany;
    })
    .map((person) => ({
      name: person.name,
      linkedinUrl: `https://linkedin.com/in/${person.id}`,
      title: person.currentTitle,
      company:
        resolvedWorkspace.companies.find((company) => company.id === person.companyId)?.name ?? "Independent",
      location: person.location,
    }))
    .slice(0, params.limit ?? 10);
}

export const crustdataClient = {
  person: {
    async search(params: PersonSearchParams, workspace?: WorkspaceRecord): Promise<PersonSearchResult[]> {
      if (!process.env.CRUSTDATA_API_KEY) {
        return searchDemoPeople(params, workspace);
      }

      try {
        const response = await fetchWithRetry<{
          data?: { profiles?: any[]; profile?: any[] };
          profiles?: any[];
        }>({
          endpoint: "/screener/person/search",
          payload: buildPersonSearchBody(params),
          ttlMs: 5 * 60_000,
          method: "POST",
          authPreference: "bearer",
        });

        const items = response.data?.profiles ?? response.data?.profile ?? response.profiles ?? [];
        const mapped = items
          .map((item) => ({
            name: item.full_name ?? item.name ?? item.basic_profile?.name ?? "Unknown",
            linkedinUrl:
              item.linkedin_profile_url ??
              item.linkedin_url ??
              item.professional_network_profile_url ??
              "",
            title:
              item.current_title ??
              item.title ??
              item.experience?.employment_details?.current?.title ??
              "Unknown",
            company:
              item.current_company_name ??
              item.company ??
              item.experience?.employment_details?.current?.company_name ??
              "Unknown",
            location:
              item.location ??
              item.basic_profile?.location ??
              item.professional_network?.location?.country ??
              "Unknown",
          }))
          .filter((item) => item.linkedinUrl);

        return mapped.length ? mapped : searchDemoPeople(params, workspace);
      } catch {
        return searchDemoPeople(params, workspace);
      }
    },
    async enrich(linkedinUrl: string, workspace?: WorkspaceRecord): Promise<PersonEnrichment> {
      const match = searchDemoPeople({ limit: 20 }, workspace).find((person) => person.linkedinUrl === linkedinUrl);
      if (!process.env.CRUSTDATA_API_KEY || match) {
        const person = match ?? searchDemoPeople({ limit: 1 }, workspace)[0];
        return {
          ...person,
          summary: `${person.name} is a warm network node with relevant operating context for the current ask.`,
          warmSignals: ["Strong network overlap", "Fast response history"],
        };
      }

      try {
        const response = await fetchWithRetry<any>({
          endpoint: "/screener/person/enrich",
          query: new URLSearchParams({ linkedin_profile_url: linkedinUrl }),
          ttlMs: 60 * 60_000,
          method: "GET",
          authPreference: "token",
        });
        const enriched = Array.isArray(response) ? response[0] : response?.data ?? response;

        return {
          name: enriched.full_name ?? enriched.name ?? "Unknown",
          linkedinUrl,
          title: enriched.current_title ?? enriched.title ?? "Unknown",
          company: enriched.current_company_name ?? enriched.company ?? "Unknown",
          location: enriched.location ?? "Unknown",
          summary:
            enriched.summary ??
            `${enriched.full_name ?? enriched.name ?? "This contact"} is enriched from Crustdata and ready for routing.`,
          warmSignals: [
            "Crustdata verified",
            ...(Array.isArray(enriched.skills) ? enriched.skills.slice(0, 2) : ["Profile enrichment complete"]),
          ],
        };
      } catch {
        const person = searchDemoPeople({ limit: 1 }, workspace)[0];
        return {
          ...person,
          summary: `${person.name} is a warm network node with relevant operating context for the current ask.`,
          warmSignals: ["Strong network overlap", "Fast response history"],
        };
      }
    },
    async autocomplete(q: string, workspace?: WorkspaceRecord): Promise<AutocompleteResult[]> {
      return searchDemoPeople({ limit: 5 }, workspace)
        .filter((person) => person.name.toLowerCase().includes(q.toLowerCase()))
        .map((person) => ({ id: person.linkedinUrl, label: person.name, meta: person.title }));
    },
  },
  company: {
    async identify(domain: string, workspace?: WorkspaceRecord): Promise<CompanyIdentity> {
      const company = resolveWorkspace(workspace).companies.find((entry) => entry.domain === domain);
      const demoIdentity = company
        ? { name: company.name, domain: company.domain }
        : { name: domain.split(".")[0], domain };

      if (!process.env.CRUSTDATA_API_KEY) {
        return demoIdentity;
      }

      try {
        const response = await fetchWithRetry<any>({
          endpoint: "/screener/company",
          query: new URLSearchParams({ company_domain: domain }),
          ttlMs: 60 * 60_000,
          method: "GET",
          authPreference: "token",
        });
        const enriched = Array.isArray(response) ? response[0] : response?.data?.[0] ?? response;
        const parsed = parseLiveCompany(enriched, domain);
        return {
          name: parsed.name,
          domain: parsed.domain,
        };
      } catch {
        return demoIdentity;
      }
    },
    async enrich(domain: string, workspace?: WorkspaceRecord): Promise<CompanyEnrichment> {
      const demoCompany = buildDemoCompanyEnrichment(domain, workspace);

      if (!process.env.CRUSTDATA_API_KEY) {
        return demoCompany;
      }

      try {
        const response = await fetchWithRetry<any>({
          endpoint: "/screener/company",
          query: new URLSearchParams({ company_domain: domain }),
          ttlMs: 60 * 60_000,
          method: "GET",
          authPreference: "token",
        });
        const enriched = Array.isArray(response) ? response[0] : response?.data?.[0] ?? response;
        return parseLiveCompany(enriched, domain);
      } catch {
        return demoCompany;
      }
    },
    async search(params: CompanySearchParams, workspace?: WorkspaceRecord): Promise<CompanySearchResult[]> {
      const companies = searchDemoCompanies(params, workspace);

      if (!process.env.CRUSTDATA_API_KEY) {
        return companies;
      }

      try {
        const response = await fetchWithRetry<{
          data?: { companies?: any[] };
          companies?: any[];
        }>({
          endpoint: "/screener/company/search",
          payload: buildCompanySearchBody(params),
          ttlMs: 5 * 60_000,
          method: "POST",
          authPreference: "bearer",
        });

        const items = response.data?.companies ?? response.companies ?? [];
        const mapped = items.map((item) => ({
          name: item.name ?? item.company_name ?? "Unknown",
          domain: item.website ?? item.company_website_domain ?? item.domain ?? "",
          sector: item.industry ?? params.sector ?? "Unknown",
          stage: item.last_funding_stage ?? params.stage ?? "Unknown",
          geography: item.location ?? item.headquarters?.country ?? "Unknown",
        }));
        return mapped.length ? mapped : companies;
      } catch {
        return companies;
      }
    },
    async autocomplete(q: string, workspace?: WorkspaceRecord): Promise<AutocompleteResult[]> {
      return resolveWorkspace(workspace).companies
        .filter((company) => company.name.toLowerCase().includes(q.toLowerCase()))
        .map((company) => ({ id: company.domain, label: company.name, meta: company.sector }));
    },
  },
  web: {
    async search(query: string, workspace?: WorkspaceRecord): Promise<WebSearchResult[]> {
      const companies = resolveWorkspace(workspace).companies;
      return companies.slice(0, 3).map((company, index) => ({
        title: `${company.name} signal ${index + 1}`,
        url: `https://${company.domain}/signals/${index + 1}`,
        snippet: `${query} surfaced a relevant product, hiring, and investor-fit signal for ${company.name}.`,
      }));
    },
    async enrich(url: string): Promise<WebPageEnrichment> {
      return {
        url,
        summary: "Mock web enrichment summary with structured evidence extracted for the demo.",
      };
    },
  },
  job: {
    async search(params: JobSearchParams): Promise<JobSearchResult[]> {
      return [
        {
          title: params.title ?? "VP Engineering",
          location: params.location ?? "San Francisco",
          company: params.company ?? "Linear",
        },
      ];
    },
  },
};
