import prisma from "../config/prisma.js";
import type { QuoteStatus, Priority, RiskLevel } from "../../generated/prisma/client.js";

// ─── Domain Types ─────────────────────────────────────────────────────────────

// The DB stores missingItems as a JSON string. The repository deserializes it
// so callers always work with a proper string[].
export type ParsedAnalysisResult = {
  id: string;
  quoteId: string;
  risk: RiskLevel;
  missingItems: string[];
  confidence: number;
  analyzedAt: Date;
};

export type QuoteWithAnalysis = {
  id: string;
  customer: string;
  project: string;
  city: string;
  status: QuoteStatus;
  priority: Priority;
  estimatedValue: number;
  createdAt: Date;
  analysis: ParsedAnalysisResult | null;
};

export type FindAllFilters = {
  status?: QuoteStatus;
  priority?: Priority;
  search?: string; // matched against customer OR project (case-insensitive)
};

export type CreateQuoteData = {
  customer: string;
  project: string;
  city: string;
  priority: Priority;
  estimatedValue: number;
};

export type CreateAnalysisData = {
  risk: RiskLevel;
  missingItems: string[];
  confidence: number;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseAnalysis(raw: {
  id: string;
  quoteId: string;
  risk: RiskLevel;
  missingItems: string;
  confidence: number;
  analyzedAt: Date;
}): ParsedAnalysisResult {
  return {
    ...raw,
    missingItems: JSON.parse(raw.missingItems) as string[],
  };
}

// Prisma throws a PrismaClientKnownRequestError with code P2025
// when an update/delete targets a record that does not exist.
function isNotFound(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === "P2025"
  );
}

// ─── Repository ───────────────────────────────────────────────────────────────

export const quoteRepository = {
  async findAll(filters: FindAllFilters): Promise<QuoteWithAnalysis[]> {
    const rows = await prisma.quoteRequest.findMany({
      where: {
        ...(filters.status !== undefined && { status: filters.status }),
        ...(filters.priority !== undefined && { priority: filters.priority }),
        ...(filters.search !== undefined && {
          OR: [
            { customer: { contains: filters.search } },
            { project: { contains: filters.search } },
          ],
        }),
      },
      include: { analysis: true },
      orderBy: { createdAt: "desc" },
    });

    return rows.map((row) => ({
      ...row,
      analysis: row.analysis ? parseAnalysis(row.analysis) : null,
    }));
  },

  async findById(id: string): Promise<QuoteWithAnalysis | null> {
    const row = await prisma.quoteRequest.findUnique({
      where: { id },
      include: { analysis: true },
    });

    if (!row) return null;

    return {
      ...row,
      analysis: row.analysis ? parseAnalysis(row.analysis) : null,
    };
  },

  async create(data: CreateQuoteData): Promise<QuoteWithAnalysis> {
    const row = await prisma.quoteRequest.create({
      data,
      include: { analysis: true },
    });

    // Newly created quotes never have an analysis yet
    return { ...row, analysis: null };
  },

  async updateStatus(
    id: string,
    status: QuoteStatus,
  ): Promise<QuoteWithAnalysis | null> {
    try {
      const row = await prisma.quoteRequest.update({
        where: { id },
        data: { status },
        include: { analysis: true },
      });

      return {
        ...row,
        analysis: row.analysis ? parseAnalysis(row.analysis) : null,
      };
    } catch (err) {
      if (isNotFound(err)) return null;
      throw err;
    }
  },

  // Upsert: re-running analysis on a quote replaces the previous result.
  // The unique constraint on quoteId makes upsert the correct primitive here.
  async upsertAnalysis(
    quoteId: string,
    data: CreateAnalysisData,
  ): Promise<ParsedAnalysisResult> {
    const serialized = JSON.stringify(data.missingItems);

    const raw = await prisma.analysisResult.upsert({
      where: { quoteId },
      create: {
        quoteId,
        risk: data.risk,
        missingItems: serialized,
        confidence: data.confidence,
      },
      update: {
        risk: data.risk,
        missingItems: serialized,
        confidence: data.confidence,
        analyzedAt: new Date(),
      },
    });

    return parseAnalysis(raw);
  },
};
