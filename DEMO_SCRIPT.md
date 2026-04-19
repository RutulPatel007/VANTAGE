# CapitalOS / VANTAGE Demo Script

## Setup

1. Start the app:

```bash
npm install
npm run dev
```

2. Open:

```text
http://localhost:3000
```

3. Optional live providers:

- Set `CRUSTDATA_API_KEY` to enable live Crustdata requests.
- Set `GEMINI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY` to enable live Gemini streaming.

Without those keys, the app still runs end to end in demo-safe fallback mode.

## Demo Flow

### 1. Landing

- Open the landing page.
- Say: "CapitalOS / VANTAGE is a live operating system for venture funds. It combines three AI agents with a fund-owned operating graph."
- Click `Start Demo`.

### 2. Onboarding

- On `Fund identity`, show that the fund name and thesis are editable.
- Click through portfolio, network, and friendly VC steps.
- On `Launch`, say: "This initializes the workspace and hydrates the graph in a deterministic way, so the demo stays reliable."
- Click `Launch CapitalOS / VANTAGE`.

### 3. Graph

- You land on `/dashboard/graph`.
- Say: "The graph is the product backbone. Agents read from it, approvals mutate it, and memory accumulates around it."
- Click a company or founder node to show the right-side detail sheet.

### 4. Invest Agent

- Open the `Agents` drawer.
- Stay on the `Invest` tab.
- Use the thesis:

```text
Series B SaaS with >$5M ARR, product-led growth
```

- Click `Run Invest Agent`.
- Narrate the stream: thinking → enriching → memo output.
- Click `Open Raise Graph`.

### 5. Raise Detail

- You should land on `/dashboard/raises/<id>`.
- Call out:
  - readiness gauge
  - investor fit ranking
  - conviction memo
- Say: "The agent output is no longer ephemeral. It becomes an operating artifact."

### 6. Approval

- Navigate to `/dashboard/approvals`.
- Click `Approve with note`.
- Say: "This is the trust layer. Outreach remains human-controlled, but the AI does the heavy lifting."

### 7. Memory

- Navigate to `/dashboard/memory`.
- Point out:
  - the timeline entry for raise creation
  - the approval entry
  - the intelligence score increase
- Say: "The system gets smarter over time because agent actions become memory, not just chat output."

### 8. Talent Bonus

- Re-open `Agents`.
- Switch to `Talent`.
- Use:

```text
VP Engineering, B2B SaaS, Series B, remote-friendly
```

- Location:

```text
San Francisco
```

- Click `Run Talent Agent`.
- Then click `Save To Ask Graph`.
- Navigate back to `/dashboard` and mention the active ask count and signal changes.

## Fallback Notes

- If Crustdata is unavailable or rate-limited, the app falls back to the seeded demo workspace.
- If Gemini is unavailable, the agent drawer still streams deterministic mock output.
- The live demo does not depend on external services succeeding in real time.
