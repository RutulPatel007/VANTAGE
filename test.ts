import { translateQueryToFilters, generateDealMemo } from "./lib/llm/prompts";

async function main() {
  try {
    const thesis = "B2B SaaS, EU-based, 10–100 employees, more than 20% headcount growth in last 6 months, no US VC funding yet";
    console.log("Testing translateQueryToFilters...");
    const parsed = await translateQueryToFilters(thesis + " (searching for companies, not people)");
    console.dir(parsed, { depth: null });
  } catch (err) {
    console.error("Error in translateQueryToFilters:");
    console.error(err);
  }

  try {
    console.log("\nTesting generateDealMemo...");
    const memo = await generateDealMemo(
      { name: "Acme Corp", description: "B2B SaaS", headcount: 50, funding_stage: "series_a" },
      [{ name: "Alice", title: "CEO" }],
      ["Acme launches new product"],
      [{ title: "Software Engineer" }],
      "B2B SaaS, EU-based, 10–100 employees, more than 20% headcount growth in last 6 months, no US VC funding yet"
    );
    console.dir(memo, { depth: null });
  } catch (err) {
    console.error("Error in generateDealMemo:");
    console.error(err);
  }
}

main();
