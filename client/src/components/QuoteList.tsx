import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../store";
import { setSelectedQuoteId } from "../store/dashboardSlice";
import { useQuotes } from "../hooks/useQuotes";
import { type QuoteStatus, type Priority } from "../api/types";

const getPriorityStyles = (priority: Priority) => {
  switch (priority) {
    case "High":
      return "bg-rose-50 text-rose-700";
    case "Medium":
      return "bg-amber-50 text-amber-700";
    case "Low":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-slate-50 text-slate-700";
  }
};

const getStatusStyles = (status: QuoteStatus) => {
  switch (status) {
    case "New":
      return "bg-sky-50 text-sky-700";
    case "InReview":
      return "bg-indigo-50 text-indigo-700";
    case "NeedsInfo":
      return "bg-amber-50 text-amber-700";
    case "WaitingForCustomer":
      return "bg-purple-50 text-purple-700";
    case "Completed":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-slate-50 text-slate-700";
  }
};

const formatStatus = (status: string) => {
  return status.replace(/([A-Z])/g, " $1").trim();
};

export function QuoteList() {
  const dispatch = useDispatch();
  const { data: quotes, isLoading, isError } = useQuotes();
  const { selectedQuoteId } = useSelector((state: RootState) => state.dashboard);

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl border border-slate-200 shadow-sm flex-1 overflow-auto flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">Loading quotes...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-surface rounded-xl border border-slate-200 shadow-sm flex-1 overflow-auto flex items-center justify-center p-8">
        <p className="text-sm text-rose-600 font-medium">Failed to load quotes. Please try again.</p>
      </div>
    );
  }

  if (!quotes || quotes.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-slate-200 shadow-sm flex-1 overflow-auto flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">No quotes found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col">
      <div className="overflow-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[25%]">Customer</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[30%]">Project</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[15%]">Value</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[15%]">Status</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[15%]">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quotes.map((quote) => {
              const isSelected = selectedQuoteId === quote.id;
              return (
                <tr
                  key={quote.id}
                  onClick={() => dispatch(setSelectedQuoteId(quote.id))}
                  className={`cursor-pointer transition-colors ${isSelected ? "bg-slate-50" : "hover:bg-slate-50/50"
                    }`}
                >
                  <td className="py-3 px-4">
                    <div className="text-sm font-medium text-slate-800">{quote.customer}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{quote.city}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-slate-700 line-clamp-1" title={quote.project}>
                      {quote.project}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm font-medium text-slate-700">
                      ${quote.estimatedValue.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium leading-none tracking-wide ${getStatusStyles(
                        quote.status
                      )}`}
                    >
                      {formatStatus(quote.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium leading-none tracking-wide ${getPriorityStyles(
                        quote.priority
                      )}`}
                    >
                      {quote.priority}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
