import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import { SummaryCards } from "./components/SummaryCards";
import { Filters } from "./components/Filters";
import { QuoteList } from "./components/QuoteList";
import { QuoteDetails } from "./components/QuoteDetails";
import { CreateQuoteModal } from "./components/CreateQuoteModal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedQuoteId } = useSelector((state: RootState) => state.dashboard);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-surface border-b border-slate-200 px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-40">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Quote Request Workflow</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and analyze customer quotes</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm text-sm"
        >
          + New Quote
        </button>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCards />
        </section>

        <section className="flex flex-1 gap-6 overflow-hidden min-h-[500px]">
          <div className={`flex flex-col gap-4 transition-all duration-300 ${selectedQuoteId ? "w-2/3" : "w-full"}`}>
            <Filters />
            <QuoteList />
          </div>

          <QuoteDetails />
        </section>
      </main>

      <CreateQuoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default App;
