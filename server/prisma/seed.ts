import prisma from "../src/config/prisma.js";

async function seed() {
  const existingCount = await prisma.quoteRequest.count();
  if (existingCount > 0) {
    console.log(`Database already has ${existingCount} quotes — skipping seed.`);
    return;
  }

  const quotes = await prisma.quoteRequest.createManyAndReturn({
    data: [
      {
        customer: "Skyline Builders",
        project: "Office Lobby Renovation",
        city: "Dallas, TX",
        priority: "High",
        estimatedValue: 42000,
        status: "New",
      },
      {
        customer: "Harbor Construction",
        project: "Waterfront Retail Buildout",
        city: "Seattle, WA",
        priority: "High",
        estimatedValue: 128500,
        status: "InReview",
      },
      {
        customer: "Crestview Development",
        project: "Parking Structure Expansion",
        city: "Phoenix, AZ",
        priority: "Medium",
        estimatedValue: 310000,
        status: "NeedsInfo",
      },
      {
        customer: "Pinnacle Contractors",
        project: "Medical Office Fit-Out",
        city: "Nashville, TN",
        priority: "High",
        estimatedValue: 95000,
        status: "WaitingForCustomer",
      },
      {
        customer: "Summit Engineering",
        project: "Warehouse HVAC Upgrade",
        city: "Denver, CO",
        priority: "Low",
        estimatedValue: 22000,
        status: "Completed",
      },
      {
        customer: "Greenfield Associates",
        project: "Restaurant Interior Remodel",
        city: "Austin, TX",
        priority: "Medium",
        estimatedValue: 67500,
        status: "New",
      },
      {
        customer: "Lakefront Builders",
        project: "Hotel Conference Room Buildout",
        city: "Chicago, IL",
        priority: "High",
        estimatedValue: 215000,
        status: "InReview",
      },
      {
        customer: "Metro Construction Group",
        project: "Retail Strip Center Renovation",
        city: "Atlanta, GA",
        priority: "Medium",
        estimatedValue: 88000,
        status: "Completed",
      },
      {
        customer: "Apex Structural",
        project: "School Gymnasium Renovation",
        city: "Columbus, OH",
        priority: "Low",
        estimatedValue: 49000,
        status: "New",
      },
      {
        customer: "Ironwood Contractors",
        project: "Data Center Power Upgrade",
        city: "San Jose, CA",
        priority: "High",
        estimatedValue: 175000,
        status: "NeedsInfo",
      },
    ],
  });

  // Seed analysis results for the two completed/in-review quotes
  const analyzed = quotes.filter((q) =>
    ["Completed", "InReview"].includes(q.status),
  );

  const analysisData: Array<{
    quoteId: string;
    risk: "Low" | "Medium" | "High";
    missingItems: string;
    confidence: number;
  }> = [
    {
      quoteId: analyzed[0]!.id, // Summit Engineering — Completed
      risk: "Low",
      missingItems: JSON.stringify([]),
      confidence: 97,
    },
    {
      quoteId: analyzed[1]!.id, // Metro Construction — Completed
      risk: "Medium",
      missingItems: JSON.stringify(["Final material specs"]),
      confidence: 88,
    },
    {
      quoteId: analyzed[2]!.id, // Harbor Construction — InReview
      risk: "High",
      missingItems: JSON.stringify([
        "Structural drawings",
        "Load requirements",
        "Permits",
      ]),
      confidence: 72,
    },
    {
      quoteId: analyzed[3]!.id, // Lakefront Builders — InReview
      risk: "Medium",
      missingItems: JSON.stringify(["ADA compliance report"]),
      confidence: 84,
    },
  ];

  await prisma.analysisResult.createMany({ data: analysisData });

  console.log(`✅ Seeded ${quotes.length} quotes and ${analysisData.length} analysis results.`);
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
