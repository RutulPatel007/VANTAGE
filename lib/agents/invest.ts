import { z } from "zod";

import { getDemoWorkspace } from "@/lib/demo/runtime";
import { runEnrichmentPipeline } from "@/lib/enrichment/pipeline";
import { buildFundContext, buildInvestPrompt } from "@/lib/llm/prompts";
import { streamAgentResponse } from "@/lib/llm/stream";
import type { WorkspaceRecord } from "@/lib/types";

export const investInputSchema = z.object({
  thesis: z.string(),
  companyId: z.string().optional(),
  raiseId: z.string().optional(),
  workspace: z.custom<WorkspaceRecord>().optional(),
});

export const investAgent = {
  name: "invest",
  description: "Builds deal memos, portfolio alerts, and investor fit analysis.",
  inputSchema: investInputSchema,
  async *run(input: z.infer<typeof investInputSchema>) {
    const workspace = input.workspace ?? getDemoWorkspace();
    const companyId = input.companyId ?? "company_linear";
    const company =
      workspace.companies.find((entry) => entry.id === companyId) ??
      workspace.companies.find((entry) => entry.id === "company_linear") ??
      workspace.companies[0];

    yield { type: "thinking", text: "Reading portfolio context and raise adjacency..." };
    yield { type: "enriching", entity: company.name, mode: "company", step: 1, total: 3 };

    const pipeline = await runEnrichmentPipeline({
      mode: "company",
      companyName: company.name,
      domain: company.domain,
      workspace,
    });

    const enrichedCompany = pipeline.entities[0];
    const context = buildFundContext(workspace, "/dashboard/graph");
    const prompt = buildInvestPrompt(context, enrichedCompany as any);

    yield { type: "enriching", entity: "Investor fit and readiness", mode: "company", step: 2, total: 3 };

    let dealMemo = "";
    const mockText = `Executive summary: ${company.name} fits the current ${input.thesis} mandate with strong product-led evidence and credible operator pull. Market opportunity: workflow depth plus cross-functional adoption make this a durable wedge. Team assessment: founder quality and execution cadence remain unusually strong. Risks and open questions: enterprise expansion pacing, cap table pressure, and whether PLG efficiency holds as GTM broadens. Recommendation: open the raise graph, route through the a16z relationship, and keep approval controls tight.`;

    for await (const chunk of streamAgentResponse({
      prompt,
      systemPrompt: "You are an investing partner writing a sharp, concise memo for a venture fund.",
      mockText,
    })) {
      dealMemo += chunk;
      yield { type: "llm_chunk", text: chunk };
    }

    yield {
      type: "result",
      output: {
        companyId,
        convictionNote: "Strong product pull, believable Series B narrative, and warm investor route via Rita Singh.",
        dealMemo,
        portfolioAlerts: [
          {
            title: `${company.name} has expanded hiring intensity`,
            severity: "medium",
          },
        ],
        investorFit: [
          { firmName: "a16z", compositeScore: 0.91 },
          { firmName: "Benchmark", compositeScore: 0.83 },
        ],
        readinessScore: 78,
      },
    };
  },
};
