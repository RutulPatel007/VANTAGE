<div align="center">

# VANTAGE

### The AI-Native Operating System for Modern Venture Funds

[![Deploy](https://img.shields.io/badge/Deploy-Live-success)](#)
[![Demo](https://img.shields.io/badge/Video-Loom-blue)](#)
[![License](https://img.shields.io/badge/License-MIT-gray)](#)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](#)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-2.0%20Flash-4285F4)](#)
[![Crustdata](https://img.shields.io/badge/Crustdata-Enrichment-teal)](#)

**[[Live Link](https://vantage-one-delta.vercel.app/)]** | **[[Loom Video](https://www.loom.com/share/aeb14f8be6704a9ab79125f2bda4a2fe)]** | **[[GitHub](https://github.com/RutulPatel007/VANTAGE)]**

</div>

<br />

<img width="1428" height="848" alt="VANTAGE Dashboard — Operating Graph" src="https://github.com/user-attachments/assets/02d3d141-5903-49fe-b8cf-799af9b8aebe" />

<img width="1428" height="847" alt="VANTAGE Dashboard — Agent Drawer" src="https://github.com/user-attachments/assets/4fce0147-009a-4443-83ee-ca7620d09bcc" />

---

## Table of Contents

1. [The Problem](#-the-problem)
2. [Core Philosophy — VC as a Graph Problem](#-core-philosophy--vc-as-a-graph-problem)
3. [What is VANTAGE?](#-what-is-vantage)
4. [Key Concepts](#-key-concepts)
   - [The Operating Graph](#1-the-operating-graph)
   - [Autonomous Agents](#2-autonomous-agents)
   - [Enrichment Pipeline](#3-the-enrichment-pipeline)
   - [Approval Gates (Human-in-the-Loop)](#4-approval-gates-human-in-the-loop)
   - [Institutional Memory](#5-institutional-memory--the-intelligence-score)
5. [Agent Deep-Dives](#-agent-deep-dives)
   - [Invest Agent](#1-the-invest-agent-deal-sourcing--diligence)
   - [Talent Agent](#2-the-talent-agent-warm-candidate-routing)
   - [Sales Agent](#3-the-sales-agent-gtm--network-leverage)
6. [Platform Features](#-platform-features)
7. [System Architecture](#-system-architecture)
   - [High-Level Data Flow](#high-level-data-flow)
   - [Codebase Structure](#codebase-structure)
   - [Database Schema](#database-schema-prismapostgresql)
   - [State Management](#state-management)
   - [Design System](#design-system)
8. [Technology Stack](#-technology-stack)
9. [Quickstart & Local Development](#-quickstart--local-development)
10. [API Reference](#-api-reference)
11. [Testing](#-testing)
12. [Demo Mode & Graceful Degradation](#-demo-mode--graceful-degradation)
13. [The "Killer Demo" Moment](#-the-killer-demo-moment)
14. [Roadmap](#-roadmap)

---

## 🔍 The Problem

Modern venture capital firms manage an enormous, unstructured graph of relationships—portfolio companies, founders, operators, advisors, friendly VCs, LPs, and talent. Yet the tools they use are fundamentally **passive**:

| What Exists Today | Why It Fails |
|---|---|
| **CRMs** (Affinity, Attio) | Passive databases. They store contacts but don't *act* on them. No routing, no scoring, no outbound. |
| **Deal Flow Trackers** | Capture inbound interest. They can't proactively *source* from the fund's own network. |
| **Spreadsheets & Notions** | Manual, siloed, no enrichment. A partner's operating context lives in their head, not in the system. |
| **Point AI Tools** | Generate generic emails or summaries with no knowledge of the fund's thesis, portfolio, or warm paths. |

The result: warm introductions happen over Slack DMs. Deal memos live in Google Docs. Talent asks get lost in email threads. The fund's collective intelligence is scattered and ephemeral.

**VANTAGE eliminates this.**

---

## 🧠 Core Philosophy — VC as a Graph Problem

> *"Venture capital is a graph problem. Every founder, investor, and operator represents a node. The value of a fund is determined by the density, warmth, and routing efficiency of its graph."*

VANTAGE is built on a single, powerful insight: **the fund's network is its product**. Rather than treating contacts as rows in a database, VANTAGE models the entire venture ecosystem as an **Operating Graph** — a live, weighted, typed graph where:

- **Nodes** represent entities: the fund itself, portfolio companies, founders, operators, advisors, friendly VCs, raise events, and active asks.
- **Edges** carry meaning: `portfolio` (investment relationship), `network` (trust relationship), `route` (active warm path), and `approval` (pending human checkpoint).
- **Weights** quantify warmth: every edge has a 0–1 weight that reflects the strength and recency of the relationship.

AI agents **read from** this graph to identify warm paths. Human decisions **write back** to the graph. Over time, the graph becomes the fund's compounding advantage — a self-reinforcing flywheel of institutional memory.

```
┌──────────────────────────────────────────────────────────────┐
│                    THE OPERATING GRAPH                        │
│                                                              │
│   ┌─────┐  portfolio   ┌─────────┐  network  ┌──────────┐  │
│   │ Fund │─────────────▶│ Stripe  │──────────▶│  Karri   │  │
│   │      │             └─────────┘           │ Saarinen │  │
│   │      │  portfolio   ┌─────────┐          └──────────┘  │
│   │      │─────────────▶│ Linear  │                         │
│   │      │             └────┬────┘                         │
│   │      │                  │ route (0.87)                  │
│   │      │  network    ┌────▼────┐  approval  ┌──────────┐ │
│   │      │────────────▶│  Rita   │───────────▶│  Raise   │ │
│   └─────┘             │ Singh   │            │  Graph   │ │
│                        └─────────┘            └──────────┘ │
│                                                              │
│   Agents READ from the graph.                                │
│   Approvals WRITE back to the graph.                         │
│   Memory COMPOUNDS in the graph.                             │
└──────────────────────────────────────────────────────────────┘
```

---

## ⚡ What is VANTAGE?

**VANTAGE** is a complete, AI-native operating system for venture capital funds. It combines:

1. **Three Autonomous AI Agents** (Invest, Talent, Sales) powered by **Google Gemini 2.0 Flash** that actively source deals, recruit talent, and generate warm outbound — not just summarize data.
2. **A Real-Time Data Enrichment Pipeline** backed by **Crustdata's professional data API** that hydrates every company and person in the graph with live headcount, funding, hiring signals, and LinkedIn profiles.
3. **An Operating Graph** (built with **React Flow**) that visually and structurally maps the fund's entire universe — portfolio, network, raises, and asks — and grows smarter with every interaction.
4. **Human-in-the-Loop Approval Gates** that ensure the AI never acts autonomously. Every outbound email, every deal memo, and every investor route passes through a human checkpoint before execution.
5. **Institutional Memory** that transforms agent outputs from ephemeral chat into permanent operating artifacts. An "Intelligence Score" tracks how much smarter the fund is getting over time.

---

## 📐 Key Concepts

### 1. The Operating Graph

The Operating Graph is the **backbone of VANTAGE**. It is not a decorative visualization — it is the core data structure that all agents read from and all user actions write back to.

**Node Types:**

| Type | Description | Source Data |
|------|-------------|-------------|
| `fund` | The venture fund itself | `FundRecord` — thesis, stage focus, sectors, geography |
| `company` | Portfolio companies | `CompanyRecord` — domain, sector, stage, employee count, signal state |
| `founder` | Founders, operators, advisors, friendly VCs | `PersonRecord` — title, role type, trust level, location |
| `ask` | Active requests being routed through the network | `AskRecord` — lane, urgency, route candidates |
| `raise` | Fundraising events tracked by the invest agent | `RaiseRecord` — readiness score, investor fit, deal memo |

**Edge Types:**

| Type | Meaning | Visual |
|------|---------|--------|
| `portfolio` | Fund → Company investment relationship | Solid line |
| `network` | Fund/Company → Person trust relationship | Dashed line |
| `route` | Active warm path (animated) | Animated dashed line |
| `approval` | Pending human checkpoint | Dotted line with status metadata |

**Graph Mutations:** The graph is not static. Three operations mutate it:

- **`createRaiseFromInvest()`** — Adds a `raise` node, an `approval` edge from the fund, and a `route` edge to the warmest investor contact.
- **`saveTalentAsk()`** — Adds an `ask` node and a `route` edge from the relevant portfolio company.
- **`approveRaise()`** — Updates the `approval` edge metadata from `PENDING` → `APPROVED`, activating the investor route.

### 2. Autonomous Agents

VANTAGE operates through three specialized AI agents. They share a core enrichment pipeline (powered by Crustdata) but apply completely different reasoning paradigms and Gemini system prompts.

All agents implement the same `Agent<TInput>` interface:

```typescript
interface Agent<TInput extends z.ZodTypeAny = ZodSchema> {
  name: string;
  description: string;
  inputSchema: TInput;              // Zod-validated input
  run: (input) => AsyncGenerator<AgentEvent>;  // Streams events
}
```

Every agent is an **async generator** that yields a typed stream of events:

```
thinking → enriching → llm_chunk (streamed) → result
```

This architecture enables **real-time UI streaming** — the user watches the agent think, enrich, and reason in real time through the Agent Drawer.

### 3. The Enrichment Pipeline

The enrichment pipeline (`runEnrichmentPipeline()`) is the shared data engine that feeds all three agents. It is a **modal pipeline** — the same function behaves differently based on the `mode` parameter:

| Mode | Used By | What It Does |
|------|---------|--------------|
| `person` | Sales Agent | Searches Crustdata for people by job title and company, enriches LinkedIn profiles, fetches web evidence |
| `person+geo` | Talent Agent | Same as `person` but adds geographic filtering (radius search), cross-references active job listings |
| `company` | Invest Agent | Enriches company by domain (headcount, funding stage, growth signals), builds peer context from portfolio |

**Crustdata Integration Architecture:**

```
┌───────────────────────────────────────────────────────┐
│                  crustdataClient                       │
├───────────────────────────────────────────────────────┤
│  person.search()    → POST /screener/person/search    │
│  person.enrich()    → GET  /screener/person/enrich    │
│  person.autocomplete()                                │
│  company.identify() → GET  /screener/company          │
│  company.enrich()   → GET  /screener/company          │
│  company.search()   → POST /screener/company/search   │
│  company.autocomplete()                               │
│  web.search()       → Demo-backed web signals         │
│  job.search()       → Job listing signals             │
├───────────────────────────────────────────────────────┤
│  Built-in: TTL caching, 3x retry with exponential     │
│            backoff, 6s timeout, demo fallback          │
└───────────────────────────────────────────────────────┘
```

The client includes sophisticated request builders that translate high-level parameters (like `"San Francisco"`) into Crustdata's filter format (like `"San Francisco Bay Area"` in a `REGION` filter), and normalize seniority levels (`"vp"` → `"Vice President"`).

### 4. Approval Gates (Human-in-the-Loop)

VANTAGE embraces a foundational principle: **AI does the heavy lifting, but humans make the decisions.**

Every consequential action — investor outreach, deal memo publication, talent routing — flows through an `ApprovalRecord`:

```
Agent generates output
        ↓
    ApprovalRecord created (status: PENDING)
        ↓
    Appears in /dashboard/approvals
        ↓
    Human clicks "Approve with Note"
        ↓
    approveRaise() mutates graph, logs to memory, bumps intelligence
        ↓
    Route becomes active
```

This is not a formality. The approval system creates a **trust layer** that makes AI-generated outreach credible enough for venture-scale relationships.

### 5. Institutional Memory & The Intelligence Score

Most AI tools produce ephemeral output — chat messages that disappear into history. VANTAGE is different. Every agent action creates a **permanent artifact** in the system's memory:

- **Execution Timeline** (`ExecutionLogRecord[]`) — chronological log of every workspace action (fund launched, raise created, approval granted, talent ask saved).
- **Signal Feed** (`SignalEventRecord[]`) — categorized, severity-tagged notifications (portfolio signals, network changes, raise events).
- **Intelligence Score** (`IntelligenceRecord`) — a composite metric that tracks how much smarter the fund is getting over time.

The Intelligence Score is calculated from four dimensions:

| Dimension | What It Measures |
|-----------|------------------|
| Network Depth | How densely connected the operating graph is |
| Ask Velocity | How quickly asks move from DRAFT → READY → EXECUTING |
| Route Accuracy | How well the warm-path routing performs |
| Outcome Rate | How many approved actions led to successful outcomes |

Every mutation (raise creation: `+4`, approval: `+3`, talent ask: `+2`) bumps the score. The fund literally gets smarter with every interaction.

---

## 🦾 Agent Deep-Dives

### 1. The Invest Agent (Deal Sourcing & Diligence)

The Invest Agent is the strategic brain of VANTAGE. Given a fund thesis and target company, it builds a complete investment analysis artifact.

**Input Schema (Zod-validated):**
```typescript
z.object({
  thesis: z.string(),                        // e.g., "Series B SaaS with >$5M ARR, product-led growth"
  companyId: z.string().optional(),           // Target company from the graph
  raiseId: z.string().optional(),             // Existing raise to extend
  workspace: z.custom<WorkspaceRecord>().optional(),
})
```

**Execution Flow:**
```
1. Read portfolio context and raise adjacency
2. Enrich target company via Crustdata (mode: "company")
   → headcount, funding stage, growth signals, peer context
3. Build fund context prompt (thesis, portfolio, active asks/raises)
4. Stream Gemini response with invest-specific system prompt
5. Yield structured result
```

**Output:**

| Field | Description |
|-------|-------------|
| `dealMemo` | AI-generated investment memo covering team, market, product-led evidence, risks, and recommendations |
| `convictionNote` | Concise rationale for the investment angle |
| `investorFit[]` | Multi-dimensional scoring: `a16z — 0.91`, `Benchmark — 0.83`, with warm path descriptions |
| `readinessScore` | 0-100 composite (Team, Market, Traction, Cap Table, Narrative) |
| `portfolioAlerts[]` | Proactive notifications (e.g., "Company has expanded hiring intensity") |

**Post-Agent Action:** Clicking **"Open Raise Graph"** calls `createRaiseFromInvest()`, which:
- Creates a `RaiseRecord` with full readiness breakdown and investor fit rankings
- Creates an `ApprovalRecord` (status: `PENDING`)
- Adds a `raise` node to the operating graph
- Adds `approval` and `route` edges
- Pushes a signal and execution log entry
- Bumps the intelligence score by `+4`

### 2. The Talent Agent (Warm Candidate Routing)

The Talent Agent executes surgical talent searches for portfolio hires, prioritizing candidates connected via warm network paths.

**Input Schema:**
```typescript
z.object({
  jobDescription: z.string(),   // e.g., "VP Engineering, B2B SaaS, Series B, remote-friendly"
  location: z.string(),         // e.g., "San Francisco"
  companyId: z.string().optional(),
  workspace: z.custom<WorkspaceRecord>().optional(),
})
```

**Execution Flow:**
```
1. Parse hiring brief, extract role title
2. Enrich candidates via Crustdata (mode: "person+geo")
   → person search with geographic radius, cross-ref job listings
3. Build talent-specific prompt with fund context
4. Stream Gemini response with talent partner system prompt
5. Yield scored candidate shortlist
```

**Output:**

| Field | Description |
|-------|-------------|
| `candidates[]` | Deeply profiled candidates, each with a multi-factor score |
| `.scores.skillMatch` | Technical/functional fit (0-100) |
| `.scores.seniorityFit` | Level appropriateness (0-100) |
| `.scores.locationFit` | Geographic alignment (0-100) |
| `.scores.warmth` | Critically: Internal vs. Network vs. Cold path strength (0-100) |
| `.scores.composite` | Weighted aggregate (0-100) |
| `.warmPath` | `"internal"` / `"network"` / `"cold"` |
| `screeningNotes[]` | Venture-partner-grade synthesis of why the talent cluster fits |

**Post-Agent Action:** Clicking **"Save To Ask Graph"** calls `saveTalentAsk()`, which:
- Creates an `AskRecord` in the `HIRE` lane with route candidates
- Adds an `ask` node to the operating graph
- Adds a `route` edge from the portfolio company
- Pushes a signal and execution log entry
- Bumps the intelligence score by `+2`

### 3. The Sales Agent (GTM & Network Leverage)

The Sales Agent uses the Operating Graph to generate contextual, warm outbound sequences for portfolio GTM motions.

**Input Schema:**
```typescript
z.object({
  query: z.string(),                   // e.g., "Find Series B CROs in PLG SaaS"
  companyId: z.string().optional(),
  targetPersona: z.string().optional(),
  workspace: z.custom<WorkspaceRecord>().optional(),
})
```

**Execution Flow:**
```
1. Analyze customer-intro paths and warm outbound angles
2. Enrich GTM persona targets via Crustdata (mode: "person")
   → person search by job title and company name
3. Build sales-specific prompt with fund and portfolio context
4. Stream Gemini response with GTM strategist system prompt
5. Yield email sequences and account briefing
```

**Output:**

| Field | Description |
|-------|-------------|
| `emailSequences[]` | Bespoke, non-generic 2-3 touch email sequences leveraging the fund's operating perspective |
| `briefing` | Account strategy explaining *why* to target this prospect and the exact warm path vector |
| `prospects[]` | Enriched prospect profiles from Crustdata |

---

## ⚙️ Platform Features

### 🌐 The Operating Graph (`/dashboard/graph`)

An interactive, explorable graph visualization built with **React Flow**. Features custom node types (Fund, Company, Founder, Ask, Raise) and edge types (Portfolio, Network, Route, Approval) with animated routing edges. Click any node to open a detail sheet with full entity data.

### 📊 Portfolio Pulse Dashboard (`/dashboard`)

The command center showing three key metrics (portfolio companies, pending approvals, active asks), a real-time signal feed, and the active ask board — all driven by live workspace state.

### 🛡️ Approval Queue (`/dashboard/approvals`)

A dedicated approval interface where human partners review AI-generated outputs before they become active. Each approval shows the source agent, summary, and provides "Approve with Note" functionality.

### 💰 Raise Detail (`/dashboard/raises/[id]`)

Deep-dive into any raise event with a readiness gauge (SVG arc visualization), ranked investor fit table (with composite scores and warm path descriptions), the full conviction note, and the AI-generated deal memo.

### 🧠 Memory & Intelligence (`/dashboard/memory`)

The system's institutional memory: an execution timeline of every action, the Fund Intelligence Score with trend chart (built with Recharts), and per-dimension breakdowns (Network Depth, Ask Velocity, Route Accuracy, Outcome Rate).

### 🤖 Agent Drawer (Side Panel)

A slide-out panel accessible from anywhere in the dashboard. Three tabs (Sales, Talent, Invest) with pre-filled forms, real-time streaming output, and post-agent actions (Open Raise Graph, Save To Ask Graph).

---

## 🏗️ System Architecture

### High-Level Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                          CLIENT (Next.js App Router)             │
│                                                                  │
│  Landing Page ──▶ Onboarding ──▶ Dashboard Shell                 │
│                                   ├── /graph      (OperatingGraph)│
│                                   ├── /           (Portfolio Pulse)│
│                                   ├── /approvals  (ApprovalQueue) │
│                                   ├── /raises/[id](Raise Detail)  │
│                                   └── /memory     (Intelligence)  │
│                                                                  │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────────────┐  │
│  │ Zustand      │    │ React Query  │    │ Agent Drawer       │  │
│  │ Workspace    │    │ (TanStack)   │    │ (SSE Stream)       │  │
│  │ + UI Store   │    │              │    │                    │  │
│  └──────┬───────┘    └──────────────┘    └────────┬───────────┘  │
│         │                                          │              │
├─────────┼──────────────────────────────────────────┼──────────────┤
│         │              SERVER (API Routes)          │              │
│         │                                          │              │
│  ┌──────▼──────────────────────────────────────────▼──────────┐  │
│  │                  /api/agents/stream                         │  │
│  │  Parses agentName → selects agent → runs async generator   │  │
│  │  → encodes AgentEvents as SSE → streams to client          │  │
│  └──────────────────────────┬─────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────▼─────────────────────────────────┐  │
│  │              Agent Layer (lib/agents/)                      │  │
│  │  investAgent | talentAgent | salesAgent                    │  │
│  │  All implement Agent<TInput> interface                     │  │
│  │  All use Zod validation, async generators                  │  │
│  └──────────────────────────┬─────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────▼─────────────────────────────────┐  │
│  │           Enrichment Pipeline (lib/enrichment/)             │  │
│  │  runEnrichmentPipeline({ mode, query, workspace })         │  │
│  │  → Crustdata search → Crustdata enrich → Web evidence     │  │
│  └──────────────────────────┬─────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────▼─────────────────────────────────┐  │
│  │           LLM Layer (lib/llm/)                              │  │
│  │  streamAgentResponse() → Gemini 2.0 Flash via Vercel AI SDK│  │
│  │  buildFundContext() → structured prompt with workspace data │  │
│  └──────────────────────────┬─────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────▼─────────────────────────────────┐  │
│  │           External APIs                                     │  │
│  │  Crustdata API (api.crustdata.com) → Person, Company, Web  │  │
│  │  Google Gemini (via @ai-sdk/google) → LLM reasoning        │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Codebase Structure

```
VANTAGE/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Landing page (features, CTA, how-it-works)
│   ├── layout.tsx                    # Root layout (Geist fonts, Providers)
│   ├── globals.css                   # Design tokens, surface cards, shimmer, noise grid
│   ├── (auth)/                       # Auth route group (onboarding flow)
│   ├── dashboard/                    # Authenticated workspace
│   │   ├── layout.tsx                # WorkspaceGate + DashboardShell
│   │   ├── page.tsx                  # Portfolio Pulse (signals, asks, metrics)
│   │   ├── graph/                    # Operating Graph visualization
│   │   ├── approvals/                # Approval queue
│   │   ├── raises/                   # Raise detail pages
│   │   └── memory/                   # Intelligence score + execution timeline
│   ├── graph/                        # Graph page (alternate route)
│   ├── approvals/                    # Approvals page (alternate route)
│   ├── memory/                       # Memory page (alternate route)
│   ├── raises/                       # Raises page (alternate route)
│   └── api/
│       ├── agents/
│       │   ├── stream/               # SSE streaming endpoint for all agents
│       │   ├── invest/               # Direct invest agent route
│       │   ├── talent/               # Direct talent agent route
│       │   └── sales/                # Direct sales agent route
│       └── live/
│           ├── approvals/            # Live approval mutations
│           ├── asks/                 # Live ask mutations
│           ├── raises/               # Live raise mutations
│           └── connect-fund/         # Fund connection endpoint
│
├── components/                       # React components
│   ├── ui/                           # Design system primitives
│   │   ├── Badge.tsx                 # Tonal badges (accent, signal, pending, approved)
│   │   ├── Button.tsx                # Primary/secondary buttons with CVA variants
│   │   ├── Card.tsx                  # Surface cards with header/content slots
│   │   ├── Sheet.tsx                 # Slide-out panel (used by Agent Drawer + Graph details)
│   │   ├── SectionHeader.tsx         # Eyebrow + title + description headers
│   │   ├── TrendPill.tsx             # Green/red delta indicators
│   │   ├── Skeleton.tsx              # Loading shimmer placeholders
│   │   └── Providers.tsx             # React Query provider wrapper
│   ├── shell/                        # Dashboard chrome
│   │   ├── DashboardShell.tsx        # Main layout with sidebar + top bar + agent drawer
│   │   ├── Sidebar.tsx               # Navigation sidebar with route links
│   │   ├── AgentDrawer.tsx           # THE CORE UI: tri-tab agent panel with SSE streaming
│   │   ├── CommandPalette.tsx        # ⌘K command palette
│   │   └── NotificationBell.tsx      # Signal notification indicator
│   ├── graph/                        # Operating Graph components
│   │   ├── OperatingGraph.tsx        # React Flow wrapper with custom node/edge types
│   │   ├── nodes/                    # Custom graph nodes
│   │   │   ├── FundTwinNode.tsx      # Fund node (central hub)
│   │   │   ├── CompanyTwinNode.tsx   # Portfolio company nodes
│   │   │   ├── FounderTwinNode.tsx   # Person/founder nodes
│   │   │   ├── AskNode.tsx           # Active ask nodes
│   │   │   └── RaiseNode.tsx         # Raise event nodes
│   │   └── edges/                    # Custom graph edges
│   │       ├── PortfolioEdge.tsx     # Solid portfolio connections
│   │       ├── NetworkEdge.tsx       # Dashed network connections
│   │       ├── RouteEdge.tsx         # Animated warm-path connections
│   │       └── ApprovalEdge.tsx      # Approval-gated connections
│   ├── feed/
│   │   └── SignalFeed.tsx            # Real-time signal event feed
│   ├── raises/
│   │   └── ReadinessGauge.tsx        # SVG arc readiness visualization
│   ├── memory/
│   │   ├── ExecutionTimeline.tsx     # Chronological action log
│   │   └── FundIntelligenceScore.tsx # Intelligence score with Recharts area chart
│   ├── approvals/
│   │   └── ApprovalQueue.tsx         # Pending approval cards with action buttons
│   └── workspace/
│       └── WorkspaceGate.tsx         # Hydration gate (waits for Zustand persistence)
│
├── lib/                              # Core business logic
│   ├── types.ts                      # 180 lines of TypeScript types (the domain model)
│   ├── utils.ts                      # cn(), formatRelativeTime(), clamp(), average()
│   ├── agents/                       # Agent implementations
│   │   ├── base.ts                   # Agent interface + AgentEvent union type
│   │   ├── invest.ts                 # Invest agent (deal memos, investor fit)
│   │   ├── talent.ts                 # Talent agent (candidate scoring, warm paths)
│   │   └── sales.ts                  # Sales agent (email sequences, account briefings)
│   ├── crustdata/                    # Crustdata API integration
│   │   ├── client.ts                 # Full API client (475 lines) with caching, retries, fallbacks
│   │   ├── types.ts                  # Person/Company/Web/Job search & enrichment types
│   │   └── request-builders.ts       # Filter normalization (regions, seniority, headcount buckets)
│   ├── enrichment/
│   │   └── pipeline.ts              # THE CORE: modal enrichment pipeline (person/person+geo/company)
│   ├── llm/
│   │   ├── prompts.ts               # Prompt templates (fund context builder + agent-specific prompts)
│   │   ├── stream.ts                # Gemini streaming via Vercel AI SDK (with mock fallback)
│   │   └── context.ts               # LLM context utilities
│   ├── graph/
│   │   └── builder.ts               # Converts WorkspaceRecord → React Flow nodes/edges
│   ├── store/
│   │   ├── workspace-store.ts       # Zustand persisted store (workspace state + mutations)
│   │   └── ui-store.ts              # Zustand ephemeral store (sidebar, agent drawer, active tab)
│   ├── workspace/
│   │   └── mutations.ts             # Pure workspace mutation functions (397 lines)
│   └── demo/
│       ├── seed.ts                  # Deterministic demo workspace seed data
│       └── runtime.ts               # Server-side demo workspace singleton
│
├── prisma/
│   └── schema.prisma                # PostgreSQL schema (Fund, Company, Person, Ask, Raise, etc.)
│
├── tests/
│   ├── workspace-mutations.test.ts  # 4 tests covering launch, ask, raise, approval mutations
│   └── crustdata-client.test.ts     # 2 tests for request builder filter normalization
│
├── DEMO_SCRIPT.md                   # Structured demo walkthrough (8 steps)
├── package.json                     # Dependencies and scripts
├── tailwind.config.ts               # Custom design tokens, animations, fonts
├── tsconfig.json                    # TypeScript configuration
└── postcss.config.js                # PostCSS (Tailwind + Autoprefixer)
```

### Database Schema (Prisma/PostgreSQL)

VANTAGE ships with a production-grade relational schema designed for multi-tenant fund workspaces:

```
Fund (1) ──▶ (N) Company ──▶ (1) CompanyTwin
  │                │
  │                ├──▶ (N) Ask ──▶ (N) RouteCandidate ──▶ (N) RouteScore
  │                └──▶ (N) Raise
  │
  ├──▶ (N) Person ──▶ (1) FounderTwin
  ├──▶ (1) FundTwin
  ├──▶ (N) Approval
  ├──▶ (N) SignalEvent
  └──▶ (N) ExecutionLog
```

Key design decisions:
- **Twin Models** (`CompanyTwin`, `FounderTwin`, `FundTwin`) store enrichment data separately from core entities, enabling independent refresh cycles.
- **RouteScore** normalizes multi-dimensional scoring (relationship, response rate, relevance, seniority, context) with configurable weights.
- **Every entity is fund-scoped** via `fundId` foreign key, enabling multi-tenant isolation.

### State Management

VANTAGE uses a **dual-store** architecture with Zustand:

| Store | Persistence | Purpose |
|-------|------------|---------|
| `useWorkspaceStore` | `localStorage` (via `zustand/persist`) | Full workspace state: fund, companies, people, graph, signals, asks, raises, approvals, execution log, intelligence |
| `useUiStore` | Ephemeral (memory only) | Sidebar collapse state, agent drawer open/close, active agent tab |

The workspace store exposes four mutation actions that mirror the pure functions in `lib/workspace/mutations.ts`:
- `launchWorkspace(input)` — Initialize from seed + onboarding customization
- `createRaiseFromInvest({ companyId, convictionNote, dealMemo })`
- `approveRaise({ approvalId, note })`
- `saveTalentAsk({ companyId, text, topRouteCandidate })`

### Design System

VANTAGE uses a **dark-mode-first** design system with CSS custom properties:

```css
--bg-base:     10 10 11       /* Near-black base */
--bg-surface:  17 17 19       /* Card surfaces */
--bg-elevated: 24 24 27       /* Hover states */
--bg-overlay:  31 31 35       /* Overlays */
--accent:      99 102 241     /* Indigo accent */
--signal:      20 184 166     /* Teal signal */
--pending:     245 158 11     /* Amber pending */
--approved:    16 185 129     /* Emerald approved */
--rejected:    239 68 68      /* Red rejected */
```

Visual features:
- **Geist Sans + Mono** typography with OpenType features (`cv02`, `cv03`, `cv04`, `cv11`)
- **Glassmorphism** surfaces (`backdrop-blur-xl`, translucent backgrounds)
- **Gradient backgrounds** (radial indigo + teal accents)
- **Custom animations**: `pulseRing` for live indicators, `dashflow` for animated graph edges, `shimmer` for loading states
- **Grid noise** pattern overlay for depth
- **indigo glow** box shadows for elevated elements

---

## 🤝 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14.2 (App Router) | Server/client rendering, API routes, file-based routing |
| **Language** | TypeScript 5 | End-to-end type safety |
| **AI / LLM** | Google Gemini 2.0 Flash (via `@ai-sdk/google` + Vercel AI SDK) | Streaming text generation for agent reasoning |
| **Data Enrichment** | Crustdata API | Real-time person search, company enrichment, LinkedIn profiles, hiring signals |
| **Graph Visualization** | React Flow 11 | Interactive node/edge graph with custom types, minimap, controls |
| **State Management** | Zustand 5 (with `zustand/persist`) | Client-side workspace persistence + ephemeral UI state |
| **Data Fetching** | TanStack React Query 5 | Server state management and caching |
| **Styling** | Tailwind CSS 3.4 + CSS Custom Properties | Utility-first styling with semantic design tokens |
| **Animation** | Framer Motion 12 | Smooth transitions, presence animations, layout animations |
| **Charts** | Recharts 3 | Intelligence score area chart and trend visualization |
| **Schema Validation** | Zod 4 | Runtime type validation for agent inputs and API payloads |
| **Database** | PostgreSQL (via Prisma 6) | Production relational schema (12 models) |
| **Typography** | Geist Sans + Geist Mono | Modern, clean typeface with OpenType features |
| **Icons** | Lucide React | Consistent, tree-shakeable icon set |
| **Component Utilities** | CVA + clsx + tailwind-merge | Type-safe component variants and class merging |
| **Background Jobs** | Inngest 4 | Event-driven function scheduling (for async enrichment) |

---

## 🚀 Quickstart & Local Development

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### 1. Clone & Install

```bash
git clone https://github.com/RutulPatel007/VANTAGE.git
cd VANTAGE
npm install
```

### 2. Environment Variables

Create a `.env.local` file at the root:

```env
# Required for live AI reasoning (optional — falls back to demo mode)
GEMINI_API_KEY=your_google_gemini_key_here
# OR
GOOGLE_GENERATIVE_AI_API_KEY=your_google_gemini_key_here

# Required for live data enrichment (optional — falls back to demo data)
CRUSTDATA_API_KEY=your_crustdata_key_here

# Required for database persistence (optional — app works without)
DATABASE_URL=postgresql://user:password@localhost:5432/vantage
```

> **Important:** If API keys are omitted, VANTAGE gracefully degrades to demo mode. The app runs end-to-end with deterministic, seeded data — no external services required.

### 3. Run Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000`.

### 4. Run Tests

```bash
npx tsx --test tests/
```

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 🗄️ API Reference

### Agent Streaming Endpoint

All agents are accessible through a unified SSE streaming endpoint:

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/agents/stream` | Unified agent streaming (SSE) |

**Request Body:**
```json
{
  "agentName": "invest" | "talent" | "sales",
  "input": { /* agent-specific payload */ }
}
```

**SSE Event Stream:**
```
event: thinking
data: {"text":"Reading portfolio context and raise adjacency..."}

event: enriching
data: {"entity":"Linear","mode":"company","step":1,"total":3}

event: llm_chunk
data: {"text":"Executive summary: "}

event: llm_chunk
data: {"text":"Linear fits the current mandate..."}

event: result
data: {"agentName":"invest","output":{...structured result...}}

event: done
data: {}
```

### Direct Agent Routes

| Method | Route | Agent | Payload |
|--------|-------|-------|---------|
| `POST` | `/api/agents/invest` | Invest | `{ thesis, companyId?, raiseId? }` |
| `POST` | `/api/agents/talent` | Talent | `{ jobDescription, location, companyId? }` |
| `POST` | `/api/agents/sales` | Sales | `{ query, targetPersona?, companyId? }` |

### Live Mutation Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/live/approvals` | Approve/reject a pending approval |
| `POST` | `/api/live/asks` | Create or update an ask |
| `POST` | `/api/live/raises` | Create a raise from invest output |
| `POST` | `/api/live/connect-fund` | Connect/launch a fund workspace |

---

## 🧪 Testing

VANTAGE includes targeted tests for core business logic:

### Workspace Mutations (`tests/workspace-mutations.test.ts`)
- ✅ `launchWorkspace` applies onboarding data (fund name, thesis, portfolio, network, friendly VCs) and verifies propagation across signals, asks, and execution logs
- ✅ `saveTalentAsk` adds ask + graph node + signal + memory entry + intelligence bump (+2)
- ✅ `createRaiseFromInvest` opens raise graph + pending approval + graph edges + intelligence bump (+4)
- ✅ `approveRaise` updates approval + raise status + graph edge metadata + intelligence bump (+3)

### Crustdata Request Builders (`tests/crustdata-client.test.ts`)
- ✅ `buildPersonSearchBody` correctly maps params to Crustdata filter format (region normalization, seniority aliases)
- ✅ `buildCompanySearchBody` correctly maps params including headcount bucketing (51-200 → `"51-200"`)

---

## 🛡️ Demo Mode & Graceful Degradation

VANTAGE is designed to **never crash** due to missing external services. The fallback architecture works at three levels:

| Layer | With API Key | Without API Key |
|-------|-------------|-----------------|
| **LLM (Gemini)** | Streams live Gemini 2.0 Flash responses | Streams deterministic mock text word-by-word (18ms delay per word) |
| **Data (Crustdata)** | Live person/company search and enrichment | Falls back to demo workspace seed data (3 companies, 5 people) |
| **Database (Prisma)** | Full PostgreSQL persistence | Client-side localStorage persistence via Zustand |

The demo seed (`lib/demo/seed.ts`) includes a complete workspace:
- **Fund**: Sequoia Demo Fund (thesis: early-stage B2B SaaS)
- **Portfolio**: Stripe, Notion, Linear (with full metadata)
- **Network**: Karri Saarinen (CEO, Linear), Ivan Zhao (CEO, Notion), Christina Cacioppo (Advisor), Rita Singh (Partner, a16z), Daniel Gross (Talent Advisor)
- **Graph**: 9 nodes, 8 edges (fully connected)
- **Signals**: 2 seeded portfolio signals
- **Intelligence**: Starting score of 72

---

## 🎯 The "Killer Demo" Moment

Search a single company name across all three agent tabs, and watch VANTAGE surface it simultaneously as:

- 🎯 A **Sales Target** — mapping a VP with CRM pain to a portfolio GTM motion, with bespoke email sequences
- 👤 A **Talent Opportunity** — identifying engineers with warm intro paths, scored on skill, seniority, location, and warmth
- 📈 An **Investment Signal** — noting headcount growth, raise readiness, and ranked investor fit with warm paths

**No competitor can show that from a single, unified interface.**

The demo flow:
```
Landing → Onboarding → Graph → Run Invest Agent → Open Raise Graph →
Approve in Approvals → Check Memory (Intelligence Score +7) →
Run Talent Agent → Save To Ask Graph → Dashboard (new ask visible)
```

Every step in this flow mutates the graph, creates memory, and compounds the intelligence score. The system literally gets smarter as you demo it.

---

## 🗺️ Roadmap

- [ ] **Ask OS Copilot** — Natural language command interface ("Route a VP Eng intro to Linear through Daniel") powered by `buildCopilotSystemPrompt()`
- [ ] **Live Crustdata Webhooks** — Real-time signals when portfolio companies have headcount changes, funding events, or leadership transitions
- [ ] **Multi-Fund Tenancy** — Full PostgreSQL persistence with Prisma, Supabase auth, and fund-scoped data isolation
- [ ] **Inngest Background Jobs** — Async enrichment pipelines that refresh company twins and founder twins on a schedule
- [ ] **Email Execution** — Send approved outbound sequences directly from the approval gate (Resend/SendGrid integration)
- [ ] **LP Reporting** — Auto-generated quarterly reports from the execution log and intelligence score trajectory
- [ ] **Mobile-First Dashboard** — Responsive redesign for partner-on-the-go workflows

---

<div align="center">

**Built for Hackathon 2026 · YC Spring 2026 RFS aligned: AI-Native Agencies + AI-Native Hedge Funds**

<br />

*VANTAGE transforms venture capital from a relationship business into a relationship operating system.*

</div>
