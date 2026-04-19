<div align="center">
  <h1>VANTAGE</h1>
  <p><b>The AI-Native Operating System for Modern Venture Funds</b></p>
  
  [![Deploy](https://img.shields.io/badge/Deploy-Live-success)](#) 
  [![Demo](https://img.shields.io/badge/Video-Loom-blue)](#)
  [![License](https://img.shields.io/badge/License-MIT-gray)](#)

  **[[Live Link](https://vantage-one-delta.vercel.app/)]** | **[[Loom Video](https://www.loom.com/share/aeb14f8be6704a9ab79125f2bda4a2fe)]**
</div>

<br />

VANTAGE is a complete operating system built for the venture ecosystem. Unlike traditional CRMs that just act as passive databases, VANTAGE leverages **autonomous AI agents** powered by **Google Gemini**, built on top of **Crustdata’s real-time professional data** to actively source deals, recruit talent, and generate warm sales introductions—all while maintaining strict human-in-the-loop approval processes.

---
<img width="1428" height="847" alt="image" src="https://github.com/user-attachments/assets/4fce0147-009a-4443-83ee-ca7620d09bcc" />

## 🌟 The Core Philosophy

Venture capital is a graph problem. Every founder, investor, and operator you know represents a node in your network. VANTAGE treats this network not as a list of contacts, but as an **Operating Graph**.

By maintaining a continuously expanding graph of portfolio companies, operators, and syndicate partners, VANTAGE uncovers the hidden, "warm" paths between your fund and the opportunities you want to capture. The platform then deploys specialized Agents that traverse this graph to create actionable, highly credible outbound workflows.

---

## 🦾 Autonomous Agents

VANTAGE operates through three distinct, specialized AI agents. They share a core "Enrichment Pipeline" (powered by Crustdata) but apply completely different reasoning and scoring paradigms.

### 1. The Invest Agent (Deal Sourcing & Diligence)
The Invest Agent continuously evaluates your portfolio and external signals to identify highly qualified investment opportunities that map to your fund's thesis.

- **Inputs**: Fund thesis, Portfolio Context, Target Company ID.
- **Workflow**: Reads portfolio context → Enriches target company details → Evaluates investor fit and raise readiness.
- **Outputs**:
  - **Deal Memo**: An auto-generated, highly analytical investment memo (Team, Market, Product-led Evidence, Risks, and Recommendations).
  - **Conviction Note**: Concise rationale for the investment angle.
  - **Investor Fit Scoring**: Multi-dimensional scoring mapping the company to potential syndicates/investors (e.g., `a16z - 0.91`, `Benchmark - 0.83`).
  - **Portfolio Alerts**: Proactive notifications (e.g., "Company has expanded hiring intensity").

### 2. The Talent Agent (Warm Candidate Routing)
Executes surgical searches for key portfolio hires, prioritizing candidates connected via warm network paths.

- **Inputs**: Job Description, Location, Target Portfolio Company.
- **Workflow**: Parses the hiring brief → Maps warm talent nodes → Geographically enriches individuals.
- **Outputs**:
  - **Candidate Shortlists**: Deeply profiled candidates.
  - **Multi-Factor Scoring**: Evaluates `skillMatch`, `seniorityFit`, `locationFit`, and crucially, `warmth` (Internal vs. Network vs. Cold paths) to create a `composite` score.
  - **Screening Notes**: A venture partner’s read on the candidate cluster, specifying why the talent fits the stage and requirement.

### 3. The Sales Agent (GTM & Network Leverage)
Uses the Operating Graph to generate highly-contextual, warm outbound sequences for your portfolio's GTM motions.

- **Inputs**: Target Persona / Role, Query, Target Company.
- **Workflow**: Analyzes customer-intro paths → Enriches the GTM persona targets.
- **Outputs**:
  - **3-Touch Email Sequences**: Bespoke, non-generic email sequences that explicitly leverage the fund's operating perspective to earn curiosity.
  - **Account Briefings**: Immediate strategy on why to target this prospect using an exact, warm path vector from the fund's network.

---

## ⚙️ Platform Features

### 🌐 The Operating Graph (`/dashboard/graph`)
The backbone of VANTAGE. A visual and structural mapping of companies, past investors, fund partners, and executive talent. Agents constantly read off this graph, and every approved interaction adds new "Memory" to it, increasing its strength over time.

### 🛡️ Approval Gates (`/dashboard/approvals`)
VANTAGE embraces **"Human-in-the-Loop"**. The AI agents do the heavy lifting of sourcing, scoring, and writing, but they never execute actions automatically. Every outbound email and every final deal memo hits the Approvals dashboard, waiting for a human partner to click "Approve with Note".

### 🧠 Institutional Memory (`/dashboard/memory`)
Action is never ephemeral in VANTAGE. Approving an auto-generated deal memo or sales sequence creates an artifact in the system’s Memory Timeline. The "Intelligence Score" of the system perpetually compounds.

---

## 🎯 The "Killer Demo" Moment

We built VANTAGE to highlight the power of unified data. Search a single company name across all three operational tabs, and watch Vantage surface it as:
- A **Sales Target** (e.g., mapping a VP with CRM pain to a portfolio GTM motion)
- A **Talent Opportunity** (e.g., identifying engineers ripe for poaching)
- An **Investment Signal** (e.g., noting exploding headcount with no US VC yet)

No competitor can show that from a single, unified interface.

---

## 🏗️ Architecture & Codebase

```text
lib/
  crustdata/
    client.ts       ← Core Crustdata API Integration (person, company, web, jobs)
    types.ts        ← Shared Types
  enrichment/
    pipeline.ts     ← THE CORE: The shared enrichment pipeline used by all Agents
  agents/
    sales.ts        ← Sales Agent Logic & Prompts
    talent.ts       ← Talent Agent Logic & Prompts
    invest.ts       ← Invest Agent Logic & Prompts
  llm/
    prompts.ts      ← Gemini System Prompts (Filter Translator, Email Gen, Memos)
    stream.ts       ← LLM Streaming utilities for real-time UI typing
app/
  page.tsx          ← Main Landing UI
  dashboard/        ← Authenticated Workspace (Graph, Memory, Raises, Approvals)
  api/
    agents/         ← Next.js API Routes for triggering the specialized agents
```

**How the Pipeline Works**
All agents trigger `runEnrichmentPipeline()` seamlessly:
- **Sales** calls it with `mode: "person"`.
- **Talent** calls it with `mode: "person+geo"` evaluating spatial dynamics.
- **Invest** calls it with `mode: "company"`.
Agents ingest the raw returned data and combine it with Gemini-backed reasoning models to execute their tasks.

---

## 🚀 Quickstart & Local Development

VANTAGE is built on Next.js, initialized with robust type-safety and modern React server-centric patterns.

### 1. Repository Setup

```bash
git clone https://github.com/RutulPatel007/VANTAGE.git
cd VANTAGE
npm install
```

### 2. Environment Variables

Create a `.env.local` file at the root. You will need API keys for Google Gemini and Crustdata.

```env
# Example .env.local
CRUSTDATA_API_KEY=your_crustdata_key_here
GEMINI_API_KEY=your_google_gemini_key_here
# Alternative Gemini Key syntax supported
GOOGLE_GENERATIVE_AI_API_KEY=your_google_gemini_key_here
```
*(Note: If keys are omitted, VANTAGE gracefully degrades to local fallback/demo modes to prevent the app from crashing.)*

### 3. Run Development Server

```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

---

## 🗄️ API Reference

| Method | Route | Responsible Agent | Payload Schema |
|--------|-------|-------------------|----------------|
| `POST` | `/api/agents/sales` | Sales Agent | `{ query, senderContext, companyId?, targetPersona?, maxProspects? }` |
| `POST` | `/api/agents/talent` | Talent Agent | `{ jobDescription, location, companyId? }` |
| `POST` | `/api/agents/invest` | Invest Agent | `{ thesis, companyId?, raiseId? }` |

*(Requests are streamed back to the client visualizing the Agent's specific phase—e.g. `thinking` → `enriching` → `llm_chunk` streaming → `result`.)*

---

## 🤝 Technology Stack

- **Frontend/Framework**: Next.js (App Router), React, Tailwind CSS
- **AI/LLM**: Google Gemini (via `@google/genai`)
- **Data Enrichment**: Crustdata API
- **Validation**: Zod
- **Icons**: Lucide React

---

*Built for Hackathon 2026. YC Spring 2026 RFS aligned: AI-Native Agencies + AI-Native Hedge Funds.*
