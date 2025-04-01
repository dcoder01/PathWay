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
export const applyJob = createAsyncThunk('application/apply/job', async ({ formData}, thunkAPI) => {
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

//fetch jobs coordinator

export const fetchCoordinatorJobs = createAsyncThunk('job/coordinator', async (_, thunkAPI) => {
    // console.log('asdjk');
    
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/job/fetchJobs`, { withCredentials: true});

        return response.data;
    } catch (error) {

        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch");
    }
});
// fetch all appliacnts

export const fetchAllApplicants = createAsyncThunk('applicants/fetch', async (jobId, thunkAPI) => {
    // console.log('asdjk');
    
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/application/fetch/${jobId}`, { withCredentials: true});
        // console.log(response.data);/
        
        return response.data;
    } catch (error) {

        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch");
    }
});

//updatestus
export const updateStatus = createAsyncThunk('applications/updateStatus', async ({jobId,applicationId, status}, thunkAPI) => {
    // console.log('asdjk');
    
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/application/updatestatus/${applicationId}`,{status}, { withCredentials: true}); 
       
        return response.data;
    } catch (error) {

        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch");
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
        coordinatorJobs:[],
        applicants:null,
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
            .addCase(fetchCoordinatorJobs.pending, (state, action) => {
                state.isLoading = true;

            })
            .addCase(fetchCoordinatorJobs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.coordinatorJobs=action.payload.jobs
            
            })
            .addCase(fetchCoordinatorJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllApplicants.pending, (state, action) => {
                state.isLoading = true;

            })
            .addCase(fetchAllApplicants.fulfilled, (state, action) => {
                state.isLoading = false;
                state.applicants=action.payload.job
            
            })
            .addCase(fetchAllApplicants.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updateStatus.pending, (state, action) => {
                state.isLoading = true;

            })
            .addCase(updateStatus.fulfilled, (state, action) => {
                state.isLoading = false;
               
            
            })
            .addCase(updateStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
           

    },
});


export const {
    setSearchQuery
} = jobSlice.actions
export default jobSlice.reducer;
