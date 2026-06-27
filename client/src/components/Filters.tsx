import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../store";
import { setSearch, setStatusFilter, setPriorityFilter } from "../store/dashboardSlice";

export function Filters() {
  const dispatch = useDispatch();
  const { search, statusFilter, priorityFilter } = useSelector(
    (state: RootState) => state.dashboard
  );

  return (
    <div className="bg-surface p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search quotes by customer or project..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
        />
      </div>
      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => dispatch(setStatusFilter(e.target.value))}
          className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-primary text-slate-700"
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="InReview">In Review</option>
          <option value="NeedsInfo">Needs Info</option>
          <option value="WaitingForCustomer">Waiting for Customer</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => dispatch(setPriorityFilter(e.target.value))}
          className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-primary text-slate-700"
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
    </div>
  );
}
