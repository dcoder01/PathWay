import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllSchedules = createAsyncThunk("schedule/fetchAllSchedules", async (_, thunkAPI) => {


  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/schedule/fetch`, { withCredentials: true });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch schedules");
  }
}
);
//create schedule
export const createSchedule = createAsyncThunk('schedule/create', async ({ jobId, studentId, formData }, thunkAPI) => {
  // console.log('asdjk');

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/schedule/create/${jobId}/${studentId}`, formData, { withCredentials: true });

    return response.data;
  } catch (error) {

    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create");
  }
});
//update
export const updateSchedule = createAsyncThunk('schedule/update', async ({scheduleId, formData}, thunkAPI) => {
  // console.log('asdjk');

  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/schedule/update/${scheduleId}`,formData , { withCredentials: true });

    return response.data;
  } catch (error) {

    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update");
  }
});
//delete
export const deleteSchedule = createAsyncThunk('schedule/delete', async (scheduleId, thunkAPI) => {

  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/schedule/delete/${scheduleId}`, { withCredentials: true });

    return response.data;
  } catch (error) {

    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete");
  }
});
//fetch
export const fetchSchedulesCoordinator = createAsyncThunk('schedule/fetchCoordinator', async (jobId, thunkAPI) => {

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/schedule/fetch/${jobId}`, { withCredentials: true });

    return response.data;
  } catch (error) {

    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch");
  }
});
const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    studentSchedules: [],
    loading: false,
    error: null,
    coordinatorSchedules:[],
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
      })
      .addCase(createSchedule.pending, (state, action) => {
        state.loading = true;

      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSchedule.pending, (state, action) => {
        state.loading = true;

      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSchedule.pending, (state, action) => {
        state.loading = true;

      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.loading = false;

      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSchedulesCoordinator.pending, (state, action) => {
        state.loading = true;

      })
      .addCase(fetchSchedulesCoordinator.fulfilled, (state, action) => {
        state.loading = false;
        state.coordinatorSchedules=action.payload.schedules

      })
      .addCase(fetchSchedulesCoordinator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.coordinatorSchedules=[]
      })
  },
});

export default scheduleSlice.reducer;
