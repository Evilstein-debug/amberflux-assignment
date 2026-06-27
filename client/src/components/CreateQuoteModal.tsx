import React, { useState } from "react";
import { useCreateQuote } from "../hooks/useQuotes";
import { type Priority } from "../api/types";
import { useDispatch } from "react-redux";
import { setSelectedQuoteId } from "../store/dashboardSlice";

interface CreateQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateQuoteModal({ isOpen, onClose }: CreateQuoteModalProps) {
  const dispatch = useDispatch();
  const createMutation = useCreateQuote();

  const [customer, setCustomer] = useState("");
  const [project, setProject] = useState("");
  const [city, setCity] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [estimatedValue, setEstimatedValue] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        customer,
        project,
        city,
        priority,
        estimated_value: Number(estimatedValue),
      },
      {
        onSuccess: (data) => {
          // Select the new quote so its details panel opens automatically
          dispatch(setSelectedQuoteId(data.id));
          onClose();
          // Reset form
          setCustomer("");
          setProject("");
          setCity("");
          setPriority("Medium");
          setEstimatedValue("");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Create New Quote</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {createMutation.isError && (
            <div className="bg-rose-50 text-rose-700 p-3 rounded-lg text-sm border border-rose-100">
              {createMutation.error.message || "Failed to create quote. Please check your inputs."}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name *</label>
            <input
              type="text"
              required
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm text-slate-800"
              placeholder="e.g. Skyline Builders"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Description *</label>
            <input
              type="text"
              required
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm text-slate-800"
              placeholder="e.g. Office Lobby Renovation"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm text-slate-800"
                placeholder="e.g. Dallas, TX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Value *</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  required
                  min="1"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(e.target.value)}
                  className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm text-slate-800"
                  placeholder="42000"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm text-slate-800 bg-white"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="mt-4 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-5 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {createMutation.isPending && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              {createMutation.isPending ? "Creating..." : "Create Quote"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
