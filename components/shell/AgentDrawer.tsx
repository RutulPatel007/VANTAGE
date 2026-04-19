"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Sheet } from "@/components/ui/Sheet";
import { useUiStore } from "@/lib/store/ui-store";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { cn } from "@/lib/utils";

type AgentTab = "sales" | "talent" | "invest";
type StreamEvent =
  | { event: "thinking"; data: { text: string } }
  | { event: "enriching"; data: { entity: string; mode: string; step: number; total: number } }
  | { event: "llm_chunk"; data: { text: string } }
  | { event: "result"; data: { agentName: AgentTab; output: any } }
  | { event: "error"; data: { message: string } }
  | { event: "done"; data: Record<string, never> };

const tabs: Array<{ id: AgentTab; label: string }> = [
  { id: "sales", label: "Sales" },
  { id: "talent", label: "Talent" },
  { id: "invest", label: "Invest" },
];

async function* parseEventStream(response: Response): AsyncGenerator<StreamEvent> {
  if (!response.body) {
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";

    for (const chunk of chunks) {
      const eventMatch = chunk.match(/event: (.+)/);
      const dataMatch = chunk.match(/data: (.+)/);
      if (!eventMatch || !dataMatch) {
        continue;
      }
      yield {
        event: eventMatch[1] as StreamEvent["event"],
        data: JSON.parse(dataMatch[1]),
      } as StreamEvent;
    }
  }
}

export function AgentDrawer() {
  const router = useRouter();
  const { agentDrawerOpen, activeAgentTab, setAgentDrawerOpen, setActiveAgentTab } = useUiStore();
  const workspace = useWorkspaceStore((state) => state.workspace);
  const createRaiseFromInvest = useWorkspaceStore((state) => state.createRaiseFromInvest);
  const saveTalentAsk = useWorkspaceStore((state) => state.saveTalentAsk);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [streamedText, setStreamedText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    salesQuery: "Find Series B CROs in PLG SaaS for a warm outbound sequence.",
    salesCompanyId: "company_linear",
    talentJd: "VP Engineering, B2B SaaS, Series B, remote-friendly",
    talentLocation: "San Francisco",
    talentCompanyId: "company_linear",
    investThesis: "Series B SaaS with >$5M ARR, product-led growth",
    investCompanyId: "company_linear",
  });
  const companyOptions = useMemo(
    () =>
      workspace.companies.map((company) => ({
        id: company.id,
        label: company.name,
      })),
    [workspace.companies],
  );

  const activeLabel = useMemo(
    () => tabs.find((tab) => tab.id === activeAgentTab)?.label ?? "Invest",
    [activeAgentTab],
  );

  useEffect(() => {
    const fallbackCompanyId = workspace.companies[0]?.id ?? "company_linear";

    setForm((current) => ({
      ...current,
      salesCompanyId: companyOptions.some((company) => company.id === current.salesCompanyId)
        ? current.salesCompanyId
        : fallbackCompanyId,
      talentCompanyId: companyOptions.some((company) => company.id === current.talentCompanyId)
        ? current.talentCompanyId
        : fallbackCompanyId,
      investCompanyId: companyOptions.some((company) => company.id === current.investCompanyId)
        ? current.investCompanyId
        : fallbackCompanyId,
    }));
  }, [companyOptions, workspace.companies]);

  async function runAgent(tab: AgentTab) {
    setLoading(true);
    setStatus("Initializing agent...");
    setStreamedText("");
    setResult(null);

    const payload =
      tab === "sales"
        ? {
            agentName: "sales",
            input: { query: form.salesQuery, targetPersona: "CRO", companyId: form.salesCompanyId, workspace },
          }
        : tab === "talent"
          ? {
              agentName: "talent",
              input: {
                jobDescription: form.talentJd,
                location: form.talentLocation,
                companyId: form.talentCompanyId,
                workspace,
              },
            }
          : {
              agentName: "invest",
              input: { thesis: form.investThesis, companyId: form.investCompanyId, workspace },
            };

    const response = await fetch("/api/agents/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatus("Agent request failed before streaming started.");
      setLoading(false);
      return;
    }

    for await (const entry of parseEventStream(response)) {
      if (entry.event === "thinking") {
        setStatus(entry.data.text);
      }
      if (entry.event === "enriching") {
        setStatus(`Enriching ${entry.data.entity}... (${entry.data.step}/${entry.data.total})`);
      }
      if (entry.event === "llm_chunk") {
        setStreamedText((current) => current + entry.data.text);
      }
      if (entry.event === "result") {
        setResult(entry.data.output);
      }
      if (entry.event === "error") {
        setStatus(entry.data.message);
        setStreamedText(entry.data.message);
        setLoading(false);
      }
      if (entry.event === "done") {
        setStatus(null);
        setLoading(false);
      }
    }
  }

  function openRaiseGraph() {
    if (!result?.companyId) {
      return;
    }

    const raiseId = createRaiseFromInvest({
      companyId: result.companyId,
      convictionNote: result.convictionNote,
      dealMemo: result.dealMemo ?? streamedText,
    });
    setAgentDrawerOpen(false);
    if (raiseId) {
      router.push(`/dashboard/raises/${raiseId}`);
    }
  }

  function saveTalentAskToGraph() {
    saveTalentAsk({
      companyId: result?.companyId ?? form.talentCompanyId,
      text: form.talentJd,
      topRouteCandidate: result?.candidates?.[0]?.person?.name,
    });
    setAgentDrawerOpen(false);
    router.push("/dashboard");
  }

  return (
    <Sheet
      open={agentDrawerOpen}
      onClose={() => setAgentDrawerOpen(false)}
      title={`${activeLabel} Agent`}
      description="Three specialized agents running on the same operating graph."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-base/60 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveAgentTab(tab.id)}
              className={cn(
                "rounded-2xl px-3 py-2 text-sm transition",
                activeAgentTab === tab.id ? "bg-accent text-white" : "text-text-2 hover:bg-elevated hover:text-text-1",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Run {activeLabel}</CardTitle>
              <p className="mt-1 text-sm text-text-2">Stream thinking, enrichment, and structured output live.</p>
            </div>
            <Badge tone="accent">Hybrid</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAgentTab === "sales" ? (
              <>
                <select
                  className="w-full rounded-2xl border border-border bg-base px-4 py-3 text-sm text-text-1 outline-none focus:border-accent"
                  value={form.salesCompanyId}
                  onChange={(event) => setForm((current) => ({ ...current, salesCompanyId: event.target.value }))}
                >
                  {companyOptions.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.label}
                    </option>
                  ))}
                </select>
                <textarea
                  className="min-h-24 w-full rounded-2xl border border-border bg-base px-4 py-3 text-sm text-text-1 outline-none focus:border-accent"
                  value={form.salesQuery}
                  onChange={(event) => setForm((current) => ({ ...current, salesQuery: event.target.value }))}
                />
              </>
            ) : null}
            {activeAgentTab === "talent" ? (
              <>
                <select
                  className="w-full rounded-2xl border border-border bg-base px-4 py-3 text-sm text-text-1 outline-none focus:border-accent"
                  value={form.talentCompanyId}
                  onChange={(event) => setForm((current) => ({ ...current, talentCompanyId: event.target.value }))}
                >
                  {companyOptions.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.label}
                    </option>
                  ))}
                </select>
                <textarea
                  className="min-h-24 w-full rounded-2xl border border-border bg-base px-4 py-3 text-sm text-text-1 outline-none focus:border-accent"
                  value={form.talentJd}
                  onChange={(event) => setForm((current) => ({ ...current, talentJd: event.target.value }))}
                />
                <input
                  className="w-full rounded-2xl border border-border bg-base px-4 py-3 text-sm text-text-1 outline-none focus:border-accent"
                  value={form.talentLocation}
                  onChange={(event) => setForm((current) => ({ ...current, talentLocation: event.target.value }))}
                />
              </>
            ) : null}
            {activeAgentTab === "invest" ? (
              <>
                <select
                  className="w-full rounded-2xl border border-border bg-base px-4 py-3 text-sm text-text-1 outline-none focus:border-accent"
                  value={form.investCompanyId}
                  onChange={(event) => setForm((current) => ({ ...current, investCompanyId: event.target.value }))}
                >
                  {companyOptions.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.label}
                    </option>
                  ))}
                </select>
                <textarea
                  className="min-h-24 w-full rounded-2xl border border-border bg-base px-4 py-3 text-sm text-text-1 outline-none focus:border-accent"
                  value={form.investThesis}
                  onChange={(event) => setForm((current) => ({ ...current, investThesis: event.target.value }))}
                />
              </>
            ) : null}
            <Button className="w-full" onClick={() => runAgent(activeAgentTab)} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Run {activeLabel} Agent
            </Button>
          </CardContent>
        </Card>

        <AnimatePresence mode="popLayout">
          {status ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="rounded-2xl border border-pending/20 bg-pending/10 px-4 py-3 text-sm text-pending"
            >
              {status}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Card className="min-h-[280px]">
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border bg-base/80 p-4 text-sm leading-7 text-text-2 whitespace-pre-wrap">
              {streamedText || "Agent response will stream here with progressively richer context."}
            </div>

            {result ? (
              <div className="space-y-3">
                {activeAgentTab === "sales" ? (
                  <div className="space-y-3">
                    {result.emailSequences?.map((sequence: any, index: number) => (
                      <div key={`${sequence.subject}-${index}`} className="rounded-2xl border border-border bg-base/60 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-text-3">Sequence {index + 1}</p>
                        <p className="mt-2 font-medium text-text-1">{sequence.subject}</p>
                        <p className="mt-2 text-sm text-text-2">{sequence.body}</p>
                      </div>
                    ))}
                    {result.briefing ? (
                      <div className="rounded-2xl border border-border bg-base/60 p-4 text-sm text-text-2">
                        {result.briefing}
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {activeAgentTab === "talent" ? (
                  <div className="space-y-3">
                    {result.candidates?.map((candidate: any, index: number) => (
                      <div key={`${candidate.person?.name}-${index}`} className="rounded-2xl border border-border bg-base/60 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-text-1">{candidate.person?.name}</p>
                            <p className="text-sm text-text-2">
                              {candidate.person?.title} · {candidate.person?.company}
                            </p>
                          </div>
                          <Badge tone={candidate.warmPath === "internal" ? "accent" : candidate.warmPath === "network" ? "signal" : "pending"}>
                            {candidate.warmPath}
                          </Badge>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-text-2">
                          <p>Skill: {candidate.scores?.skillMatch}</p>
                          <p>Composite: {candidate.scores?.composite}</p>
                          <p>Location: {candidate.scores?.locationFit}</p>
                          <p>Warmth: {candidate.scores?.warmth}</p>
                        </div>
                        <p className="mt-3 text-sm text-text-2">{candidate.screeningNote}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {activeAgentTab === "invest" ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-border bg-base/60 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-text-3">Readiness</p>
                        <p className="mt-2 font-mono text-3xl text-text-1">{result.readinessScore}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-base/60 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-text-3">Conviction</p>
                        <p className="mt-2 text-sm text-text-2">{result.convictionNote}</p>
                      </div>
                    </div>
                    {result.investorFit?.map((fit: any) => (
                      <div key={fit.firmName} className="flex items-center justify-between rounded-2xl border border-border bg-base/60 px-4 py-3">
                        <div>
                          <p className="font-medium text-text-1">{fit.firmName}</p>
                          {fit.warmPath ? <p className="text-sm text-text-2">{fit.warmPath}</p> : null}
                        </div>
                        <p className="font-mono text-xl text-accent">
                          {typeof fit.compositeScore === "number" ? Math.round(fit.compositeScore * 100) : fit.compositeScore}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {activeAgentTab === "invest" ? (
                  <Button onClick={openRaiseGraph} className="w-full">
                    Open Raise Graph
                  </Button>
                ) : null}
                {activeAgentTab === "talent" ? (
                  <Button onClick={saveTalentAskToGraph} className="w-full" variant="secondary">
                    Save To Ask Graph
                  </Button>
                ) : null}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </Sheet>
  );
}
