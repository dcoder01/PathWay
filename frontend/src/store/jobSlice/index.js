import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks for login and register
export const fetchAppliedJobs = createAsyncThunk('application/fetch/user', async (_,thunkAPI) => {
    
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/application/fetch`, { withCredentials: true });


        return response.data;
    } catch (error) {


        return thunkAPI.rejectWithValue(error.response?.data?.message || "fetching failed");
    }
});


// Auth Slice
const jobSlice = createSlice({
    name: 'job',
    initialState: {
        isLoading: true,
        appliedJobs: [],
        error: null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        // Login cases
        builder
            .addCase(fetchAppliedJobs.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.appliedJobs = action.payload.applications;
            })
            .addCase(fetchAppliedJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

    },
});



export default jobSlice.reducer;
