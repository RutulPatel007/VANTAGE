import { z } from "zod";

import type { Agent } from "@/lib/agents/base";
import { getDemoWorkspace } from "@/lib/demo/runtime";
import { runEnrichmentPipeline } from "@/lib/enrichment/pipeline";
import { buildFundContext, buildSalesPrompt } from "@/lib/llm/prompts";
import { streamAgentResponse } from "@/lib/llm/stream";
import type { WorkspaceRecord } from "@/lib/types";

export const salesInputSchema = z.object({
  query: z.string(),
  companyId: z.string().optional(),
  targetPersona: z.string().optional(),
  workspace: z.custom<WorkspaceRecord>().optional(),
});

export const salesAgent: Agent<typeof salesInputSchema> = {
  name: "sales",
  description: "Generates warm outbound sequences and account briefings.",
  inputSchema: salesInputSchema,
  async *run(input) {
    const workspace = input.workspace ?? getDemoWorkspace();
    const company =
      workspace.companies.find((entry) => entry.id === input.companyId) ??
      workspace.companies.find((entry) => entry.id === "company_linear") ??
      workspace.companies[0];

    yield { type: "thinking", text: "Analyzing customer-intro paths and warm outbound angles..." };
    yield { type: "enriching", entity: input.targetPersona ?? "GTM persona", mode: "person", step: 1, total: 3 };

    const pipeline = await runEnrichmentPipeline({
      mode: "person",
      query: input.query,
      jobTitle: input.targetPersona ?? "CRO",
      companyName: company?.name,
      workspace,
    });

    yield { type: "enriching", entity: "Outbound sequence", mode: "person", step: 2, total: 3 };

    const context = buildFundContext(workspace, "/dashboard");
    const prompt = buildSalesPrompt(context, pipeline.entities);
    const primaryProspects = pipeline.entities.slice(0, 3);
    const mockText = `Prioritize ${"name" in (primaryProspects[0] ?? {}) ? primaryProspects[0].name : "the top prospect"} first because the warm overlap with ${company?.name ?? "the portfolio company"} is strongest. Lead with workflow pain, reference the fund's operating perspective, and keep the ask tight enough for a fast reply. Sequence one should earn curiosity, sequence two should deepen relevance with specific context, and sequence three should make the warm path explicit.`;
    let briefing = "";

    for await (const chunk of streamAgentResponse({
      prompt,
      systemPrompt: "You are a GTM strategist writing sharp, concise outreach guidance for a venture fund.",
      mockText,
    })) {
      briefing += chunk;
      yield { type: "llm_chunk", text: chunk };
    }

    const output = {
      emailSequences: [
        {
          subject: `Warm path into ${company?.name ?? "workflow"} operating leverage`,
          body: `Saw the signal around revenue workflow sprawl. We have a specific operator path from ${workspace.fund.name} that could help tighten that handoff without adding another heavy process layer.`,
        },
        {
          subject: `A more specific angle for ${company?.name ?? "the account"}`,
          body: `Your role sits right at the point where product usage needs to turn into repeatable GTM motion. We can share a short operator briefing and make a warm introduction if that would be useful.`,
        },
      ],
      briefing,
      prospects: primaryProspects,
    };

    yield { type: "result", output };
  },
};
