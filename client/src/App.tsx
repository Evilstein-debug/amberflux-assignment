import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./store";

function App() {
  const dispatch = useDispatch();
  const { selectedQuoteId } = useSelector((state: RootState) => state.dashboard);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-surface border-b border-slate-200 px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Quote Request Workflow</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and analyze customer quotes</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-sm">
          + New Quote
        </button>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col">
              <span className="text-sm font-medium text-slate-500 mb-1">Loading...</span>
              <span className="text-2xl font-bold text-slate-800">-</span>
            </div>
          ))}
        </section>

        <section className="flex flex-1 gap-6 overflow-hidden min-h-[500px]">
          <div className={`flex flex-col gap-4 transition-all duration-300 ${selectedQuoteId ? "w-2/3" : "w-full"}`}>
            <div className="bg-surface p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search quotes by customer or project..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                />
              </div>
              <div className="flex gap-3">
                <select className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-primary">
                  <option value="">All Statuses</option>
                  <option value="New">New</option>
                  <option value="InReview">In Review</option>
                </select>
                <select className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-primary">
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-slate-200 shadow-sm flex-1 overflow-auto flex items-center justify-center">
              <div className="text-slate-400">Quote List Placeholder (Data loading soon)</div>
            </div>
          </div>

          {selectedQuoteId && (
            <div className="w-1/3 bg-surface rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-right-4 fade-in duration-300">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800">Quote Details</h2>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
              </div>
              <div className="p-6 flex-1 overflow-auto flex items-center justify-center text-slate-400">
                Details panel for {selectedQuoteId}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
