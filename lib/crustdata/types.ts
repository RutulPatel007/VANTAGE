export interface PersonSearchParams {
  title?: string;
  company?: string;
  location?: string;
  geoRadius?: number;
  seniority?: string;
  limit?: number;
}

export interface CompanySearchParams {
  query?: string;
  sector?: string;
  stage?: string;
  geography?: string;
  minHeadcount?: number;
  maxHeadcount?: number;
  limit?: number;
}

export interface JobSearchParams {
  title?: string;
  company?: string;
  location?: string;
  limit?: number;
}

export interface AutocompleteResult {
  id: string;
  label: string;
  meta?: string;
}

export interface PersonSearchResult {
  name: string;
  linkedinUrl: string;
  title: string;
  company: string;
  location: string;
}

export interface PersonEnrichment extends PersonSearchResult {
  summary: string;
  warmSignals: string[];
}

export interface CompanyIdentity {
  name: string;
  domain: string;
}

export interface CompanySearchResult {
  name: string;
  domain: string;
  sector: string;
  stage: string;
  geography: string;
}

export interface CompanyEnrichment extends CompanySearchResult {
  description: string;
  employeeCount: number;
  growthSignal: string;
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface WebPageEnrichment {
  url: string;
  summary: string;
}

export interface JobSearchResult {
  title: string;
  location: string;
  company: string;
}

export type EnrichedEntity = PersonEnrichment | CompanyEnrichment;
