# VANTAGE — The Operating System for Modern Venture Funds

[![Deploy](https://img.shields.io/badge/Deploy-Live-success)](#) 
[![Demo](https://img.shields.io/badge/Video-Loom-blue)](#)

**Deployed Link:** [Insert Deployed Link Here]
**Loom Video:** [Insert Loom Video Link Here]

VANTAGE is an AI-powered operating system that combines intelligent graph routing, autonomous agents, and real-time data enrichment to help venture funds source deals, route capital, and manage relationships at scale. Built on top of **Crustdata** APIs and **Google Gemini**, VANTAGE provides a unified platform where deal flow, talent acquisition, and sales outreach happen autonomously but under strict human supervision.

## 🎯 The "Killer Demo" Moment

Search a single company name across all three operational tabs. Vantage surfaces it as:
- A **Sales Target** (e.g. VP with CRM pain)
- A **Talent Opportunity** (e.g. Engineers worth recruiting)
- An **Investment Signal** (e.g. Headcount growing, no US VC yet)

No competitor can show that from a single unified data layer.

## 🧠 Architecture & Agents

Vantage uses a single, shared enrichment pipeline that powers three distinct autonomous agents.

```text
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

### How the Shared Pipeline Works
All three agents call `runEnrichmentPipeline()` from `lib/enrichment/pipeline.ts`.
- **Sales agent** → `mode: "person"` → enriches individuals + web signals
- **Talent agent** → `mode: "person"` with `geo_distance` → enriches candidates + employer prestige
- **Invest agent** → `mode: "company"` → enriches companies + founder profiles + job signals

Each agent then applies its own scoring + LLM reasoning on top of the raw enriched entities.

## 🚀 Quickstart

1. **Clone and Configure**
   ```bash
   cp .env.example .env.local
   # Add your CRUSTDATA_API_KEY and GEMINI_API_KEY
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Access the App**
   Open [http://localhost:3000](http://localhost:3000)

## 📡 API Routes

| Method | Path | Agent | Body |
|--------|------|-------|------|
| POST | `/api/agents/sales` | Sales | `{ query, senderContext, maxProspects? }` |
| POST | `/api/agents/talent` | Talent | `{ jdUrl?, jdText?, facilityLat, facilityLng, radiusKm }` |
| POST | `/api/agents/invest` | Invest | `{ mode: "source" \| "monitor", thesis?, portfolioCompanyIds? }` |

## 🌟 Features

- **Intelligent Graph Routing:** AI-powered routing connects every deal, founder, and investor through warm network paths.
- **Autonomous Deal Flow:** Invest, Talent, and Sales agents work 24/7 to surface opportunities and manage outreach.
- **Investor Fit Scoring:** Multi-dimensional fit analysis matches companies with the right funds at the right stage.
- **Talent Acquisition:** Route warm talent asks through the graph to find the perfect hires.
- **Crustdata Integration:** Real-time company and person enrichment from the world's largest professional data platform.
- **Approval Gates:** Human-in-the-loop checkpoints ensure every outbound action gets reviewed.

## 🤝 Credits

Built on [Crustdata](https://crustdata.com) APIs + [Google Gemini](https://deepmind.google/technologies/gemini/).

*YC Spring 2026 RFS aligned: AI-Native Agencies + AI-Native Hedge Funds.*
