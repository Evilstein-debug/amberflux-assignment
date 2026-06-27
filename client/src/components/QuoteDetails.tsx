import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../store";
import { setSelectedQuoteId } from "../store/dashboardSlice";
import { useQuoteDetails, useAnalyzeQuote, useUpdateQuoteStatus } from "../hooks/useQuotes";
import { type QuoteStatus, type RiskLevel } from "../api/types";

const getRiskStyles = (risk: RiskLevel) => {
  switch (risk) {
    case "High":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "Medium":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Low":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

export function QuoteDetails() {
  const dispatch = useDispatch();
  const { selectedQuoteId } = useSelector((state: RootState) => state.dashboard);

  const { data: quote, isLoading } = useQuoteDetails(selectedQuoteId);
  const analyzeMutation = useAnalyzeQuote();
  const updateStatusMutation = useUpdateQuoteStatus();

  if (!selectedQuoteId) return null;

  const handleClose = () => {
    dispatch(setSelectedQuoteId(null));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!quote) return;
    updateStatusMutation.mutate({
      id: quote.id,
      status: e.target.value as QuoteStatus,
    });
  };

  const handleAnalyze = () => {
    if (!quote) return;
    analyzeMutation.mutate(quote.id);
  };

  return (
    <div className="w-1/3 bg-surface rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">Quote Details</h2>
        <button
          onClick={handleClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-5 flex flex-col gap-6">
        {isLoading || !quote ? (
          <div className="flex justify-center p-8">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Header Info */}
            <div>
              <h3 className="text-lg font-bold text-slate-800">{quote.customer}</h3>
              <p className="text-sm text-slate-600 mt-1">{quote.project}</p>
              <p className="text-xs text-slate-500 mt-1">{quote.city}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Value</p>
                <p className="text-base font-semibold text-slate-800 mt-0.5">
                  ${quote.estimatedValue.toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Priority</p>
                <p className="text-base font-semibold text-slate-800 mt-0.5">{quote.priority}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</label>
              <select
                value={quote.status}
                onChange={handleStatusChange}
                disabled={updateStatusMutation.isPending}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 text-slate-800 bg-white"
              >
                <option value="New">New</option>
                <option value="InReview">In Review</option>
                <option value="NeedsInfo">Needs Info</option>
                <option value="WaitingForCustomer">Waiting for Customer</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Analysis Section */}
            <div className="border-t border-slate-100 pt-5 mt-2">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">AI Risk Analysis</h4>
                {!quote.analysis && (
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzeMutation.isPending}
                    className="text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                  >
                    {analyzeMutation.isPending ? "Analyzing..." : "Run Analysis"}
                  </button>
                )}
              </div>

              {quote.analysis ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 font-medium">Assessed Risk:</span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-md font-medium border ${getRiskStyles(
                        quote.analysis.risk
                      )}`}
                    >
                      {quote.analysis.risk}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 font-medium">Confidence:</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {quote.analysis.confidence}%
                    </span>
                  </div>

                  {quote.analysis.missingItems.length > 0 ? (
                    <div>
                      <span className="text-sm text-slate-600 font-medium mb-2 block">Identified Missing Items:</span>
                      <ul className="flex flex-col gap-1.5">
                        {quote.analysis.missingItems.map((item, i) => (
                          <li key={i} className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-md border border-slate-100 flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm flex items-center gap-2 border border-emerald-100">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      No missing items identified. Quote looks complete.
                    </div>
                  )}

                  {analyzeMutation.isPending && (
                    <div className="text-xs text-indigo-600 animate-pulse mt-2 text-center bg-indigo-50 py-2 rounded-md">
                      Re-analyzing...
                    </div>
                  )}
                  {!analyzeMutation.isPending && (
                    <button
                      onClick={handleAnalyze}
                      className="text-xs text-slate-500 hover:text-indigo-600 underline text-center mt-2 transition-colors"
                    >
                      Run analysis again
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                  <p className="text-sm text-slate-500">
                    No analysis has been run for this quote yet.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
