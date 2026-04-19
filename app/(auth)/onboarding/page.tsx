"use client";

import { Check, ChevronRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useWorkspaceStore } from "@/lib/store/workspace-store";

const steps = [
  "Fund identity",
  "Import portfolio",
  "Import network",
  "Friendly VCs",
  "Launch",
];

export default function OnboardingPage() {
  const router = useRouter();
  const hydrated = useWorkspaceStore((state) => state.hydrated);
  const workspace = useWorkspaceStore((state) => state.workspace);
  const launchWorkspace = useWorkspaceStore((state) => state.launchWorkspace);
  const [currentStep, setCurrentStep] = useState(0);
  const [launching, setLaunching] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [fundName, setFundName] = useState(workspace.fund.name);
  const [thesis, setThesis] = useState(workspace.fund.thesis);
  const [portfolio, setPortfolio] = useState(workspace.companies.map((company) => company.name));
  const [network, setNetwork] = useState(workspace.people.map((person) => person.name));
  const [friendlyVcs, setFriendlyVcs] = useState(
    workspace.people
      .filter((person) => person.roleType.toLowerCase().includes("vc"))
      .map((person) => person.name)
      .slice(0, Math.max(workspace.fund.friendlyVcCount, 2)),
  );

  const progress = useMemo(() => ((currentStep + 1) / steps.length) * 100, [currentStep]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    setFundName(workspace.fund.name);
    setThesis(workspace.fund.thesis);
    setPortfolio(workspace.companies.map((company) => company.name));
    setNetwork(workspace.people.map((person) => person.name));
    setFriendlyVcs((current) => {
      if (current.length) {
        return current;
      }

      return ["a16z", "Benchmark"];
    });
  }, [hydrated, workspace]);

  async function launchDemo() {
    setLaunching(true);
    setLogs([]);
    const payload = launchWorkspace({
      fundName,
      thesis,
      portfolio,
      network,
      friendlyVcs,
    });

    for (const line of payload.logs) {
      setLogs((current) => [...current, line]);
      await new Promise((resolve) => setTimeout(resolve, 420));
    }

    router.push("/dashboard/graph");
    setLaunching(false);
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-5 py-10 lg:px-8">
      <SectionHeader
        eyebrow="Demo onboarding"
        title="Seed the operating graph"
        description="A polished launch flow that initializes the Sequoia Demo Fund workspace without making the story depend on fragile live imports."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden">
          <div className="border-b border-border p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-1">{steps[currentStep]}</p>
                <p className="text-sm text-text-2">Step {currentStep + 1} of {steps.length}</p>
              </div>
              <Badge tone="accent">Demo bypass</Badge>
            </div>
            <div className="h-2 rounded-full bg-base">
              <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {steps.map((step, index) => {
                const complete = index < currentStep;
                const active = index === currentStep;
                return (
                  <div
                    key={step}
                    className={`rounded-2xl border px-3 py-2 text-xs ${
                      complete
                        ? "border-approved/30 bg-approved/10 text-approved"
                        : active
                          ? "border-accent/30 bg-accent/10 text-accent"
                          : "border-border bg-base text-text-3"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current">
                        {complete ? <Check className="h-3 w-3" /> : index + 1}
                      </span>
                    </div>
                    <p className="leading-5">{step}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <CardContent className="pt-5">
            {currentStep === 0 ? (
              <div className="grid gap-4">
                <div className="rounded-3xl border border-border bg-base/80 p-5">
                  <p className="mb-2 text-xs uppercase tracking-[0.22em] text-text-3">Fund name</p>
                  <input
                    value={fundName}
                    onChange={(event) => setFundName(event.target.value)}
                    className="w-full bg-transparent text-xl font-semibold text-text-1 outline-none"
                  />
                </div>
                <div className="rounded-3xl border border-border bg-base/80 p-5">
                  <p className="mb-2 text-xs uppercase tracking-[0.22em] text-text-3">Thesis</p>
                  <textarea
                    value={thesis}
                    onChange={(event) => setThesis(event.target.value)}
                    className="min-h-24 w-full resize-none bg-transparent text-sm leading-7 text-text-2 outline-none"
                  />
                </div>
              </div>
            ) : null}

            {currentStep === 1 ? (
              <div className="grid gap-3">
                {portfolio.map((company, index) => (
                  <div key={`${company}-${index}`} className="flex items-center justify-between rounded-3xl border border-border bg-base/80 px-5 py-4">
                    <div>
                      <input
                        value={company}
                        onChange={(event) =>
                          setPortfolio((current) =>
                            current.map((entry, currentIndex) => (currentIndex === index ? event.target.value : entry)),
                          )
                        }
                        className="bg-transparent font-medium text-text-1 outline-none"
                      />
                      <p className="text-sm text-text-2">{company.toLowerCase().replace(/\s+/g, "")}.com</p>
                    </div>
                    <Badge tone="signal">Identified</Badge>
                  </div>
                ))}
              </div>
            ) : null}

            {currentStep === 2 ? (
              <div className="grid gap-3">
                {network.map((person, index) => (
                  <div key={`${person}-${index}`} className="flex items-center justify-between rounded-3xl border border-border bg-base/80 px-5 py-4">
                    <div>
                      <input
                        value={person}
                        onChange={(event) =>
                          setNetwork((current) =>
                            current.map((entry, currentIndex) => (currentIndex === index ? event.target.value : entry)),
                          )
                        }
                        className="bg-transparent font-medium text-text-1 outline-none"
                      />
                      <p className="text-sm text-text-2">{index < 2 ? "Founder" : "Operator network"}</p>
                    </div>
                    <Badge tone={index < 2 ? "accent" : "signal"}>{index < 2 ? "Founder" : "Trusted"}</Badge>
                  </div>
                ))}
              </div>
            ) : null}

            {currentStep === 3 ? (
              <div className="grid gap-3">
                {friendlyVcs.map((firm, index) => (
                  <div key={`${firm}-${index}`} className="flex items-center justify-between rounded-3xl border border-border bg-base/80 px-5 py-4">
                    <div>
                      <input
                        value={firm}
                        onChange={(event) =>
                          setFriendlyVcs((current) =>
                            current.map((entry, currentIndex) => (currentIndex === index ? event.target.value : entry)),
                          )
                        }
                        className="bg-transparent font-medium text-text-1 outline-none"
                      />
                      <p className="text-sm text-text-2">Friendly VC network</p>
                    </div>
                    <Badge tone="approved">Added</Badge>
                  </div>
                ))}
              </div>
            ) : null}

            {currentStep === 4 ? (
              <div className="space-y-4">
                <div className="rounded-3xl border border-border bg-base/80 p-5">
                  <p className="text-sm text-text-2">
                    {portfolio.length} portfolio companies · {network.length} network contacts · {friendlyVcs.length} friendly VCs
                  </p>
                </div>
                <Button className="w-full" size="lg" onClick={launchDemo} disabled={launching}>
                  <Sparkles className="h-4 w-4" />
                  {launching ? "Launching demo workspace..." : "Launch CapitalOS / VANTAGE"}
                </Button>
                <div className="rounded-3xl border border-border bg-base/80 p-5">
                  <p className="mb-3 text-xs uppercase tracking-[0.24em] text-text-3">Launch log</p>
                  <div className="space-y-3 text-sm text-text-2">
                    {logs.length ? logs.map((log) => <p key={log}>{log}</p>) : <p>Ready to hydrate the graph and hand off to the dashboard.</p>}
                  </div>
                </div>
              </div>
            ) : null}

            {currentStep < 4 ? (
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setCurrentStep((current) => Math.min(current + 1, steps.length - 1))}>
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Launch outcome</CardTitle>
              <p className="mt-1 text-sm text-text-2">This cycle optimizes for a stable, polished hackathon walkthrough.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-border bg-base/70 p-5">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-text-3">What becomes real</p>
              <ul className="space-y-2 text-sm text-text-2">
                <li>Fund, company, founder, ask, and raise graph entities</li>
                <li>Signal feed and execution memory baseline</li>
                <li>Hybrid provider boundaries for Gemini and Crustdata</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-base/70 p-5">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-text-3">Why this is demo-safe</p>
              <p className="text-sm leading-7 text-text-2">
                The onboarding flow looks alive, but the workspace is deterministically seeded so the graph and agent loops stay reliable under time pressure.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
