"use client";

import { ArrowRight, CheckCircle2, Link2, Network, Sparkles, Target, Users, Zap } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";

const features = [
  {
    icon: Network,
    title: "Intelligent Graph Routing",
    description: "AI-powered routing connects every deal, founder, and investor through warm network paths.",
  },
  {
    icon: Zap,
    title: "Autonomous Deal Flow",
    description: "Invest, Talent, and Sales agents work 24/7 to surface opportunities and manage outreach.",
  },
  {
    icon: Target,
    title: "Investor Fit Scoring",
    description: "Multi-dimensional fit analysis matches companies with the right funds at the right stage.",
  },
  {
    icon: Users,
    title: "Talent Acquisition",
    description: "Route warm talent asks through the graph to find the perfect hires.",
  },
  {
    icon: Link2,
    title: "Crustdata Integration",
    description: "Real-time company and person enrichment from the world's largest professional data platform.",
  },
  {
    icon: CheckCircle2,
    title: "Approval Gates",
    description: "Human-in-the-loop checkpoints ensure every outbound action gets reviewed.",
  },
];

export default function LandingPage() {
  const [demoLoading, setDemoLoading] = useState(false);

  const startDemo = () => {
    setDemoLoading(true);
    window.location.href = "/onboarding";
  };

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-base/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Sparkles className="h-4 w-4 text-base" />
            </div>
            <span className="font-mono text-lg font-semibold">VANTAGE</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-sm text-text-2 hover:text-text-1">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-text-2 hover:text-text-1">
              How it works
            </a>
            <Button size="sm" onClick={startDemo}>
              Start Demo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </header>

      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-base px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-approved opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-approved"></span>
              </span>
              <span className="text-xs font-medium text-text-2">Live at Hackathon 2026</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight lg:text-7xl">
              The operating system for{" "}
              <span className="text-accent">modern venture funds</span>
            </h1>
            <p className="mb-10 text-xl text-text-2">
              VANTAGE is an AI-powered operating system that combines intelligent graph
              routing, autonomous agents, and real-time data enrichment to help funds
              source deals, route capital, and manage relationships at scale.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" onClick={startDemo} disabled={demoLoading}>
                <Sparkles className="h-4 w-4" />
                {demoLoading ? "Loading..." : "Launch Interactive Demo"}
              </Button>
<Button size="lg" variant="secondary" onClick={() => window.open("https://github.com", "_blank")}>
              View on GitHub
            </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Everything you need to run a modern fund
            </h2>
            <p className="text-lg text-text-2">
              From deal sourcing to investor matching, VANTAGE automates the
              entire venture workflow.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-3xl border border-border bg-base/50 p-6 transition-colors hover:border-accent/30"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-base">
                  <feature.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-text-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">How VANTAGE works</h2>
            <p className="text-lg text-text-2">
              A three-step workflow that transforms venture operations
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8">
              <div className="relative rounded-3xl border border-border bg-base/50 p-8">
                <div className="absolute -left-12 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-accent font-mono text-sm font-bold">
                  1
                </div>
                <h3 className="mb-2 text-xl font-semibold">Seed Your Graph</h3>
                <p className="text-text-2">
                  Import your portfolio companies, operator network, and friendly VCs. The graph
                  automatically maps relationships and creates warm paths between entities.
                </p>
              </div>

              <div className="relative rounded-3xl border border-border bg-base/50 p-8">
                <div className="absolute -left-12 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-accent font-mono text-sm font-bold">
                  2
                </div>
                <h3 className="mb-2 text-xl font-semibold">Deploy AI Agents</h3>
                <p className="text-text-2">
                  Three specialized agents—Invest, Talent, and Sales—continuously
                  surface opportunities, build deal memos, and route capital
                  through warm connections.
                </p>
              </div>

              <div className="relative rounded-3xl border border-border bg-base/50 p-8">
                <div className="absolute -left-12 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-accent font-mono text-sm font-bold">
                  3
                </div>
                <h3 className="mb-2 text-xl font-semibold">Approve & Execute</h3>
                <p className="text-text-2">
                  Every outbound action requires human approval. Review deal memos,
                  investor fit scores, and talent routes before they go live.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl border border-accent/30 bg-accent/5 p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to transform your fund?
            </h2>
            <p className="mb-8 text-lg text-text-2">
              Launch the interactive demo and see VANTAGE in action.
            </p>
            <Button size="lg" onClick={startDemo}>
              Start Interactive Demo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-accent">
                <Sparkles className="h-3 w-3 text-base" />
              </div>
              <span className="font-mono text-sm font-semibold">VANTAGE</span>
            </div>
            <p className="text-sm text-text-3">
              Built for Hackathon 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}