import type { QuoteWithAnalysis, CreateQuoteData, QuoteStatus } from "./types";

const BASE_URL = "/api";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  quotes: {
    getAll: (params?: { status?: string; priority?: string; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.append("status", params.status);
      if (params?.priority) searchParams.append("priority", params.priority);
      if (params?.search) searchParams.append("search", params.search);
      
      const query = searchParams.toString();
      return fetchJson<QuoteWithAnalysis[]>(`/quotes${query ? `?${query}` : ""}`);
    },
    
    getById: (id: string) => 
      fetchJson<QuoteWithAnalysis>(`/quotes/${id}`),
      
    create: (data: CreateQuoteData) => 
      fetchJson<QuoteWithAnalysis>("/quotes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
      
    updateStatus: (id: string, status: QuoteStatus) => 
      fetchJson<QuoteWithAnalysis>(`/quotes/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
      
    analyze: (id: string) => 
      fetchJson<QuoteWithAnalysis>(`/quotes/${id}/analyze`, {
        method: "POST",
      }),
  },
};
