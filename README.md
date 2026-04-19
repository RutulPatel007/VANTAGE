# VANTAGE — Universal B2B Intelligence Platform

One enrichment pipeline. Three autonomous agents.

## Architecture

```
lib/
  crustdata/
    client.ts       ← All Crustdata API calls (person, company, web, jobs)
    types.ts        ← Shared TypeScript interfaces
  enrichment/
    pipeline.ts     ← THE CORE: shared enrichment pipeline used by all agents
  agents/
    sales.ts        ← Sales Agent: prospects + 3-touch email sequences
    talent.ts       ← Talent Agent: candidates + scoring + shortlists
    invest.ts       ← Invest Agent: deal sourcing + memos + portfolio monitoring
  llm/
    prompts.ts      ← All Gemini prompts + LLM client (filter translator, email gen, etc.)
app/
  page.tsx          ← Main UI: tabbed interface for all three agents
  api/
    agents/
      sales/route.ts
      talent/route.ts
      invest/route.ts
```

## How the shared pipeline works

All three agents call `runEnrichmentPipeline()` from `lib/enrichment/pipeline.ts`.

- **Sales agent** → `mode: "person"` → enriches individuals + web signals
- **Talent agent** → `mode: "person"` with `geo_distance` → enriches candidates + employer prestige
- **Invest agent** → `mode: "company"` → enriches companies + founder profiles + job signals

Each agent then applies its own scoring + LLM reasoning on top of the raw enriched entities.

## Quickstart

```bash
cp .env.example .env.local
# Add your CRUSTDATA_API_KEY and GEMINI_API_KEY

npm install
npm run dev
```

Open http://localhost:3000

## API routes

| Method | Path                    | Agent  | Body                                       |
|--------|-------------------------|--------|--------------------------------------------|
| POST   | /api/agents/sales       | Sales  | `{ query, senderContext, maxProspects? }`  |
| POST   | /api/agents/talent      | Talent | `{ jdUrl?, jdText?, facilityLat, facilityLng, radiusKm }` |
| POST   | /api/agents/invest      | Invest | `{ mode: "source" \| "monitor", thesis?, portfolioCompanyIds? }` |

## The "killer demo" moment

Search a single company name across all three tabs. It surfaces as:
- A **sales target** (VP with CRM pain)
- A **talent opportunity** (engineers worth recruiting)
- An **investment signal** (headcount growing, no US VC yet)

No competitor can show that from a single data layer.

## Credits

Built on [Crustdata](https://crustdata.com) APIs + [Google Gemini](https://deepmind.google/technologies/gemini/).
YC Spring 2026 RFS aligned: AI-Native Agencies + AI-Native Hedge Funds.
