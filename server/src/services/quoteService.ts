import { quoteRepository } from "../repositories/quoteRepository.js";
import type {
  FindAllFilters,
  QuoteWithAnalysis,
  CreateQuoteData,
  CreateAnalysisData,
} from "../repositories/quoteRepository.js";
import { config } from "../config/index.js";
import { ApiError } from "../utils/ApiError.js";
import type { QuoteStatus } from "../../generated/prisma/client.js";

// Shape of the JSON body that FastAPI returns from POST /analyze
type FastApiAnalysisResponse = {
  risk: "Low" | "Medium" | "High";
  missing_items: string[];
  confidence: number;
};

export const quoteService = {
  async getAllQuotes(filters: FindAllFilters): Promise<QuoteWithAnalysis[]> {
    return quoteRepository.findAll(filters);
  },

  async getQuoteById(id: string): Promise<QuoteWithAnalysis> {
    const quote = await quoteRepository.findById(id);
    if (!quote) throw new ApiError(404, `Quote '${id}' not found`);
    return quote;
  },

  async createQuote(data: CreateQuoteData): Promise<QuoteWithAnalysis> {
    return quoteRepository.create(data);
  },

  async updateQuoteStatus(
    id: string,
    status: QuoteStatus,
  ): Promise<QuoteWithAnalysis> {
    const updated = await quoteRepository.updateStatus(id, status);
    if (!updated) throw new ApiError(404, `Quote '${id}' not found`);
    return updated;
  },

  async analyzeQuote(id: string): Promise<QuoteWithAnalysis> {
    // 1. Confirm the quote exists before hitting the external service
    const quote = await quoteRepository.findById(id);
    if (!quote) throw new ApiError(404, `Quote '${id}' not found`);

    // 2. Call the FastAPI analysis service
    let payload: FastApiAnalysisResponse;
    try {
      const response = await fetch(`${config.fastApiUrl}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote_id: id,
          project: quote.project,
          estimated_value: quote.estimatedValue,
        }),
      });

      if (!response.ok) {
        throw new ApiError(
          502,
          `Analysis service responded with status ${response.status}`,
        );
      }

      payload = (await response.json()) as FastApiAnalysisResponse;
    } catch (err) {
      // Re-throw ApiErrors as-is; treat all other fetch errors (network, timeout) as 502
      if (err instanceof ApiError) throw err;
      throw new ApiError(502, "Analysis service is unavailable");
    }

    // 3. Persist the result — upsert so re-running analysis replaces the old result
    const analysisData: CreateAnalysisData = {
      risk: payload.risk,
      missingItems: payload.missing_items,
      confidence: payload.confidence,
    };

    const analysis = await quoteRepository.upsertAnalysis(id, analysisData);

    // 4. Return the full quote with the freshly saved analysis attached
    return { ...quote, analysis };
  },
};
