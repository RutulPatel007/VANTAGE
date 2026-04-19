import assert from "node:assert/strict";
import test from "node:test";

import { demoWorkspaceSeed } from "../lib/demo/seed.ts";
import {
  approveRaise,
  createRaiseFromInvest,
  launchWorkspace,
  saveTalentAsk,
} from "../lib/workspace/mutations.ts";

test("launchWorkspace applies onboarding data across the workspace", () => {
  const workspace = launchWorkspace(demoWorkspaceSeed, {
    fundName: "Northstar Ventures",
    thesis: "Applied AI for vertical SaaS.",
    portfolio: ["Arc", "Mercury", "Attio"],
    network: ["Reid Hoffman", "Elad Gil", "Claire Hughes Johnson"],
    friendlyVcs: ["Index Ventures", "Sequoia"],
  });

  assert.equal(workspace.fund.name, "Northstar Ventures");
  assert.equal(workspace.fund.thesis, "Applied AI for vertical SaaS.");
  assert.deepEqual(
    workspace.companies.map((company) => company.name),
    ["Arc", "Mercury", "Attio"],
  );
  assert.deepEqual(
    workspace.people.slice(0, 3).map((person) => person.name),
    ["Reid Hoffman", "Elad Gil", "Claire Hughes Johnson"],
  );
  assert.equal(workspace.fund.friendlyVcCount, 2);
  assert.ok(workspace.launchedAt);
  assert.equal(workspace.executionLog[0]?.event, "Fund launched");
});

test("saveTalentAsk adds the ask, graph node, signal, and memory entry for the selected company", () => {
  const launched = launchWorkspace(demoWorkspaceSeed, {
    portfolio: ["Arc", "Mercury", "Attio"],
  });

  const updated = saveTalentAsk(launched, {
    companyId: "company_notion",
    text: "Hire a founding product marketer.",
    topRouteCandidate: "Claire Hughes Johnson",
  });

  assert.equal(updated.asks[0]?.companyId, "company_notion");
  assert.equal(updated.asks[0]?.topRouteCandidate, "Claire Hughes Johnson");
  assert.equal(updated.asks[0]?.approvalStatus, "PENDING");
  assert.equal(updated.graphNodes.at(-1)?.type, "ask");
  assert.equal(updated.graphEdges.at(-1)?.edgeType, "route");
  assert.match(updated.signals[0]?.description ?? "", /Talent agent saved/i);
  assert.equal(updated.executionLog[0]?.event, "Talent ask created");
  assert.equal(updated.intelligence.score, launched.intelligence.score + 2);
});

test("createRaiseFromInvest opens a raise graph and adds a pending approval", () => {
  const launched = launchWorkspace(demoWorkspaceSeed, {
    portfolio: ["Arc", "Mercury", "Attio"],
  });

  const updated = createRaiseFromInvest(launched, {
    companyId: "company_linear",
    convictionNote: "High conviction around product pull.",
    dealMemo: "Memo body",
  });

  const raise = updated.raises[0];
  const approval = updated.approvals[0];

  assert.equal(raise?.companyId, "company_linear");
  assert.equal(raise?.status, "APPROVAL_PENDING");
  assert.equal(approval?.raiseId, raise?.id);
  assert.equal(approval?.status, "PENDING");
  assert.equal(updated.graphNodes.at(-1)?.type, "raise");
  assert.deepEqual(
    updated.graphEdges.slice(-2).map((edge) => edge.edgeType),
    ["approval", "route"],
  );
  assert.equal(updated.executionLog[0]?.event, "Raise graph opened");
});

test("approveRaise updates the approval, the raise, the graph edge, and memory", () => {
  const launched = launchWorkspace(demoWorkspaceSeed);
  const withRaise = createRaiseFromInvest(launched, {
    companyId: "company_linear",
    convictionNote: "High conviction around product pull.",
    dealMemo: "Memo body",
  });
  const approvalId = withRaise.approvals[0]?.id;

  assert.ok(approvalId);

  const updated = approveRaise(withRaise, {
    approvalId: approvalId!,
    note: "Proceed with Rita for the first investor route.",
  });

  assert.equal(updated.approvals[0]?.status, "APPROVED");
  assert.equal(updated.approvals[0]?.decisionNote, "Proceed with Rita for the first investor route.");
  assert.equal(updated.raises[0]?.status, "APPROVED");
  assert.equal(
    updated.graphEdges.find((edge) => edge.edgeType === "approval")?.metadata?.status,
    "APPROVED",
  );
  assert.equal(updated.executionLog[0]?.event, "Approval granted");
  assert.equal(updated.intelligence.score, withRaise.intelligence.score + 3);
});
