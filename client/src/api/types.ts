export type Priority = "Low" | "Medium" | "High";
export type QuoteStatus = "New" | "InReview" | "NeedsInfo" | "WaitingForCustomer" | "Completed";
export type RiskLevel = "Low" | "Medium" | "High";

export interface ParsedAnalysisResult {
  id: string;
  quoteId: string;
  risk: RiskLevel;
  missingItems: string[];
  confidence: number;
  analyzedAt: string;
}

export interface QuoteWithAnalysis {
  id: string;
  customer: string;
  project: string;
  city: string;
  status: QuoteStatus;
  priority: Priority;
  estimatedValue: number;
  createdAt: string;
  analysis: ParsedAnalysisResult | null;
}

export interface CreateQuoteData {
  customer: string;
  project: string;
  city: string;
  priority: Priority;
  estimated_value: number;
}
