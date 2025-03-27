import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllSchedules = createAsyncThunk("schedule/fetchAllSchedules",async (_, thunkAPI) => {
 
  
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/schedule/fetch`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch schedules");
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    studentSchedules: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSchedules.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.studentSchedules = action.payload.schedules;
      })
      .addCase(fetchAllSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default scheduleSlice.reducer;
