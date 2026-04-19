import type { CompanySearchParams, PersonSearchParams } from "./types";

const PERSON_REGION_ALIASES: Record<string, string> = {
  "san francisco": "San Francisco Bay Area",
  "sf": "San Francisco Bay Area",
  "new york": "New York City Metropolitan Area",
  "nyc": "New York City Metropolitan Area",
};

const COMPANY_REGION_ALIASES: Record<string, string> = {
  us: "United States",
  usa: "United States",
};

const SENIORITY_ALIASES: Record<string, string> = {
  vp: "Vice President",
  "vice president": "Vice President",
  cxo: "CXO",
  ceo: "CXO",
  cto: "CXO",
  cfo: "CXO",
};

function bucketHeadcountRange(min?: number, max?: number) {
  if (min === 51 && max === 200) {
    return "51-200";
  }
  if (min === 201 && max === 500) {
    return "201-500";
  }
  if (min === 501 && max === 1000) {
    return "501-1,000";
  }
  if (min && min >= 1001) {
    return "1,001+";
  }
  return undefined;
}

function normalizePersonRegion(region?: string) {
  if (!region) {
    return undefined;
  }

  return PERSON_REGION_ALIASES[region.trim().toLowerCase()] ?? region;
}

function normalizeCompanyRegion(region?: string) {
  if (!region) {
    return undefined;
  }

  return COMPANY_REGION_ALIASES[region.trim().toLowerCase()] ?? region;
}

function normalizeSeniority(seniority?: string) {
  if (!seniority) {
    return undefined;
  }

  return SENIORITY_ALIASES[seniority.trim().toLowerCase()] ?? seniority;
}

export function buildPersonSearchBody(params: PersonSearchParams) {
  const filters = [];

  if (params.title) {
    filters.push({
      filter_type: "CURRENT_TITLE",
      type: "in",
      value: [params.title],
    });
  }

  if (params.company) {
    filters.push({
      filter_type: "CURRENT_COMPANY",
      type: "in",
      value: [params.company],
    });
  }

  const region = normalizePersonRegion(params.location);
  if (region) {
    filters.push({
      filter_type: "REGION",
      type: "in",
      value: [region],
    });
  }

  const seniority = normalizeSeniority(params.seniority);
  if (seniority) {
    filters.push({
      filter_type: "SENIORITY_LEVEL",
      type: "in",
      value: [seniority],
    });
  }

  return {
    filters,
    page: 1,
    limit: params.limit ?? 10,
  };
}

export function buildCompanySearchBody(params: CompanySearchParams) {
  const filters = [];

  if (params.query) {
    filters.push({
      filter_type: "KEYWORD",
      type: "in",
      value: [params.query],
    });
  }

  if (params.sector) {
    filters.push({
      filter_type: "INDUSTRY",
      type: "in",
      value: [params.sector],
    });
  }

  const region = normalizeCompanyRegion(params.geography);
  if (region) {
    filters.push({
      filter_type: "REGION",
      type: "in",
      value: [region],
    });
  }

  const headcountBucket = bucketHeadcountRange(params.minHeadcount, params.maxHeadcount);
  if (headcountBucket) {
    filters.push({
      filter_type: "COMPANY_HEADCOUNT",
      type: "in",
      value: [headcountBucket],
    });
  }

  return {
    filters,
    page: 1,
    limit: params.limit ?? 10,
  };
}
