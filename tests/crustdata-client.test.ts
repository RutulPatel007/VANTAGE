import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCompanySearchBody,
  buildPersonSearchBody,
} from "../lib/crustdata/request-builders.ts";

test("buildPersonSearchBody maps params to Crustdata filter_type payload", () => {
  const payload = buildPersonSearchBody({
    title: "VP Sales",
    company: "Linear",
    location: "San Francisco",
    seniority: "VP",
    limit: 7,
  });

  assert.deepEqual(payload, {
    filters: [
      { filter_type: "CURRENT_TITLE", type: "in", value: ["VP Sales"] },
      { filter_type: "CURRENT_COMPANY", type: "in", value: ["Linear"] },
      { filter_type: "REGION", type: "in", value: ["San Francisco Bay Area"] },
      { filter_type: "SENIORITY_LEVEL", type: "in", value: ["Vice President"] },
    ],
    page: 1,
    limit: 7,
  });
});

test("buildCompanySearchBody maps params to Crustdata company search filters", () => {
  const payload = buildCompanySearchBody({
    query: "product-led growth",
    sector: "Developer Tools",
    stage: "Series B",
    geography: "United States",
    minHeadcount: 51,
    maxHeadcount: 200,
  });

  assert.deepEqual(payload, {
    filters: [
      { filter_type: "KEYWORD", type: "in", value: ["product-led growth"] },
      { filter_type: "INDUSTRY", type: "in", value: ["Developer Tools"] },
      { filter_type: "REGION", type: "in", value: ["United States"] },
      { filter_type: "COMPANY_HEADCOUNT", type: "in", value: ["51-200"] },
    ],
    page: 1,
    limit: 10,
  });
});
