import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllCompanies = createAsyncThunk("company/fetchAllCompanies", async (_, thunkAPI) => {


  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/company/fetch`, { withCredentials: true });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch companies");
  }
}
);
//fetch company by recruiter
export const fetchRecruiterCompany = createAsyncThunk("company/fetchRecruiterCompany", async (_, thunkAPI) => {


  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/company/compnayByRecruiter`, { withCredentials: true });
    
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch company");
  }
}
);
//regiser company 
export const registerCompany = createAsyncThunk("company/registerCompany", async (input, thunkAPI) => {

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/company/register`, input, { withCredentials: true });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to register company");
  }
}
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    allCompanies: [],
    loading: false,
    error: null,
    recruiterCompany: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.allCompanies = action.payload.companies;
      })
      .addCase(fetchAllCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecruiterCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecruiterCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.recruiterCompany = action.payload.companies;
      })
      .addCase(fetchRecruiterCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;

      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default companySlice.reducer;
