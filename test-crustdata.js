require('dotenv').config({ path: '.env.local' });
const apiKey = process.env.CRUSTDATA_API_KEY;

async function testPersonSearch() {
  const res = await fetch("https://api.crustdata.com/person/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "x-api-version": "2025-11-01"
    },
    body: JSON.stringify({
      filters: [
        { filter_type: "current_company", type: "in", value: ["Linear"] }
      ]
    })
  });
  console.log("Person Search:", res.status, await res.text());
}

async function testCompanySearch() {
  const res = await fetch("https://api.crustdata.com/company/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "x-api-version": "2025-11-01"
    },
    body: JSON.stringify({
      filters: [
        { filter_type: "company_name", type: "in", value: ["Linear"] }
      ]
    })
  });
  console.log("Company Search:", res.status, await res.text());
}

testPersonSearch();
testCompanySearch();
