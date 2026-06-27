import { useQuotes } from "../hooks/useQuotes";

export function SummaryCards() {
  const { data: quotes, isLoading } = useQuotes();

  if (isLoading) {
    return (
      <>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-surface rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col animate-pulse"
          >
            <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-slate-200 rounded w-16"></div>
          </div>
        ))}
      </>
    );
  }

  const total = quotes?.length || 0;
  const highPriority = quotes?.filter((q) => q.priority === "High").length || 0;
  const pendingReview =
    quotes?.filter((q) =>
      ["New", "InReview", "NeedsInfo"].includes(q.status)
    ).length || 0;
  const completed = quotes?.filter((q) => q.status === "Completed").length || 0;

  const cards = [
    { label: "Total Quotes", value: total },
    { label: "High Priority", value: highPriority },
    { label: "Pending Review", value: pendingReview },
    { label: "Completed", value: completed },
  ];

  return (
    <>
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-surface rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col transition-shadow hover:shadow-md"
        >
          <span className="text-sm font-medium text-slate-500 mb-1">
            {card.label}
          </span>
          <span className="text-2xl font-bold text-slate-800">
            {card.value}
          </span>
        </div>
      ))}
    </>
  );
}
