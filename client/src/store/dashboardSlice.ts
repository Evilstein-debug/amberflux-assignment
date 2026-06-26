import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface DashboardState {
  search: string;
  statusFilter: string;
  priorityFilter: string;
  selectedQuoteId: string | null;
}

const initialState: DashboardState = {
  search: "",
  statusFilter: "",
  priorityFilter: "",
  selectedQuoteId: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },
    setPriorityFilter: (state, action: PayloadAction<string>) => {
      state.priorityFilter = action.payload;
    },
    setSelectedQuoteId: (state, action: PayloadAction<string | null>) => {
      state.selectedQuoteId = action.payload;
    },
    resetFilters: (state) => {
      state.search = "";
      state.statusFilter = "";
      state.priorityFilter = "";
    },
  },
});

export const {
  setSearch,
  setStatusFilter,
  setPriorityFilter,
  setSelectedQuoteId,
  resetFilters,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
