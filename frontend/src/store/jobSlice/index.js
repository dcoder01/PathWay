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

//fetch all jobs
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

//fetchsingle job
export const fetchSingleJob = createAsyncThunk('application/fetch/single', async (jobId, thunkAPI) => {
    // console.log('asdjk');


    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/job/fetch/${jobId}`, { withCredentials: true });

        return response.data;
    } catch (error) {

        return thunkAPI.rejectWithValue(error.response?.data?.message || "fetching failed");
    }
});

//applying for jjob
export const applyJob = createAsyncThunk('application/apply/job', async ({jobId, formData}, thunkAPI) => {
    // console.log('asdjk');

    
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/application/apply/${jobId}`, formData,{ withCredentials: true});

        return response.data;
    } catch (error) {

        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to Apply");
    }
});
//create job
export const createJob = createAsyncThunk('job/create', async ( formData, thunkAPI) => {
    // console.log('asdjk');
    
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/job/register`, formData,{ withCredentials: true});

        return response.data;
    } catch (error) {

        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to Apply");
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
        allJobs: [],
        singleJob: null,
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
                state.allJobs = action.payload.jobs;
            })
            .addCase(fetchAllJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchSingleJob.pending, (state, action) => {
                state.isLoading = true;

            })
            .addCase(fetchSingleJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.singleJob = action.payload.job;
            })
            .addCase(fetchSingleJob.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(applyJob.pending, (state, action) => {
                state.isLoading = true;

            })
            .addCase(applyJob.fulfilled, (state, action) => {
                state.isLoading = false;
            
            })
            .addCase(applyJob.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(createJob.pending, (state, action) => {
                state.isLoading = true;

            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.isLoading = false;
            
            })
            .addCase(createJob.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

    },
});


export const {
    setSearchQuery
} = jobSlice.actions
export default jobSlice.reducer;
