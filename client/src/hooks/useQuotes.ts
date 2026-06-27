import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { type QuoteStatus, type QuoteWithAnalysis } from "../api/types";
import { useSelector } from "react-redux";
import { type RootState } from "../store";

export function useQuotes() {
  const { search, statusFilter, priorityFilter } = useSelector(
    (state: RootState) => state.dashboard
  );

  return useQuery({
    queryKey: ["quotes", { search, statusFilter, priorityFilter }],
    queryFn: () =>
      api.quotes.getAll({
        search: search || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
      }),
  });
}

export function useQuoteDetails(id: string | null) {
  return useQuery({
    queryKey: ["quote", id],
    queryFn: () => (id ? api.quotes.getById(id) : null),
    enabled: !!id,
  });
}

export function useAnalyzeQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.quotes.analyze(id),
    onSuccess: (data: QuoteWithAnalysis) => {
      // Invalidate the list to refresh data
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      // Update the specific quote in the cache so the details panel updates instantly
      queryClient.setQueryData(["quote", data.id], data);
    },
  });
}

export function useUpdateQuoteStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: QuoteStatus }) =>
      api.quotes.updateStatus(id, status),
    onSuccess: (data: QuoteWithAnalysis) => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      queryClient.setQueryData(["quote", data.id], data);
    },
  });
}

export function useCreateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof api.quotes.create>[0]) => api.quotes.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
  });
}
