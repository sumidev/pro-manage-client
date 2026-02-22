import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/dashboard/stats");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error fetching stats",
      );
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null, // { totalProjects: 10, pendingTasks: 5... }
    recentActivity: [], // [ { user: 'Rahul', action: 'Moved card...' } ]
    recentProjects: [],
    myTasks: [],
    loading: false,
    error: null,
    lastFetched: null, // Caching ke liye timestamp
  },
  reducers: {
    clearDashboard: (state) => {
      state.stats = null;
      state.recentActivity = [];
      state.recentProjects = [];
      state.myTasks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats; // API response structure check kr lena
        state.recentProjects = action.payload.recentProjects || [];
        state.myTasks = action.payload.myTasks || [];
        state.lastFetched = Date.now();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
