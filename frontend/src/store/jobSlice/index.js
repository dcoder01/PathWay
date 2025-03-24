import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

// Async Thunks for login and register
export const fetchAppliedJobs = createAsyncThunk('application/fetch/user', async (_, thunkAPI) => {

    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/application/fetch`, { withCredentials: true });


        return response.data;
    } catch (error) {


        return thunkAPI.rejectWithValue(error.response?.data?.message || "fetching failed");
    }
});


export const fetchAllJobs = createAsyncThunk('application/fetch/allJobs', async (_, thunkAPI) => {
 
    // const {searchQuery} = useSelector(store=>store.jobSlice);
    // console.log('asdjk');
    

    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/job/fetch`, { withCredentials: true });


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
        appliedJobsUser: [],
        error: null,
        searchQuery: "",
        allJobs:[],
    },

    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        }
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
                state.appliedJobsUser = action.payload.applications;
            })
            .addCase(fetchAppliedJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllJobs.pending, (state, action) => {
                state.isLoading = true;
             
            })
            .addCase(fetchAllJobs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allJobs=action.payload.jobs;
            })
            .addCase(fetchAllJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

    },
});


export const {
    setSearchQuery
} = jobSlice.actions
export default jobSlice.reducer;
