import { z } from "zod";

import type { Agent } from "@/lib/agents/base";
import { getDemoWorkspace } from "@/lib/demo/runtime";
import { runEnrichmentPipeline } from "@/lib/enrichment/pipeline";
import { buildFundContext, buildTalentPrompt } from "@/lib/llm/prompts";
import { streamAgentResponse } from "@/lib/llm/stream";
import type { WorkspaceRecord } from "@/lib/types";

export const talentInputSchema = z.object({
  jobDescription: z.string(),
  location: z.string(),
  companyId: z.string().optional(),
  workspace: z.custom<WorkspaceRecord>().optional(),
});

function extractRoleTitle(jobDescription: string) {
  const firstSegment = jobDescription.split(",")[0]?.trim();
  return firstSegment || "VP Engineering";
}

export const talentAgent: Agent<typeof talentInputSchema> = {
  name: "talent",
  description: "Finds and scores candidates with warm path context.",
  inputSchema: talentInputSchema,
  async *run(input) {
    const workspace = input.workspace ?? getDemoWorkspace();
    const company =
      workspace.companies.find((entry) => entry.id === input.companyId) ??
      workspace.companies.find((entry) => entry.id === "company_linear") ??
      workspace.companies[0];
    const roleTitle = extractRoleTitle(input.jobDescription);

    yield { type: "thinking", text: "Parsing hiring brief and mapping warm talent nodes..." };
    yield { type: "enriching", entity: input.location, mode: "person+geo", step: 1, total: 3 };

    const pipeline = await runEnrichmentPipeline({
      mode: "person+geo",
      query: input.jobDescription,
      jobTitle: roleTitle,
      location: input.location,
      companyName: company?.name,
      workspace,
    });

    yield { type: "enriching", entity: "Warm route scoring", mode: "person+geo", step: 2, total: 3 };

    const context = buildFundContext(workspace, "/dashboard");
    const prompt = buildTalentPrompt(context, input.jobDescription, pipeline.entities);
    const mockText = `The top candidate cluster matches ${roleTitle} well because the group shows strong systems depth, stage adjacency, and warm network access. Prioritize internal and network paths first, especially anyone with recent product engineering scale experience in San Francisco or remote-friendly teams.`;
    let synthesis = "";

    for await (const chunk of streamAgentResponse({
      prompt,
      systemPrompt: "You are a venture talent partner creating concise hiring guidance and candidate notes.",
      mockText,
    })) {
      synthesis += chunk;
      yield { type: "llm_chunk", text: chunk };
    }

    const output = {
      candidates: pipeline.entities.slice(0, 3).map((entity, index) => ({
        person: entity,
        scores: {
          skillMatch: 82 - index * 3,
          seniorityFit: 88 - index * 4,
          locationFit: 90 - index * 2,
          warmth: 95 - index * 7,
          composite: 89 - index * 4,
        },
        screeningNote:
          "Strong engineering leadership pattern with good stage adjacency and a clearly warm intro route through the current network.",
        warmPath: index === 0 ? "internal" : index === 1 ? "network" : "cold",
      })),
      screeningNotes: [
        {
          title: "Top candidate read",
          body: synthesis || "Best fit combines stage match, systems depth, and direct operator credibility.",
        },
      ],
      warmCandidates: pipeline.entities.slice(0, 2),
      companyId: company?.id,
    };

    yield { type: "result", output };
  },
};
