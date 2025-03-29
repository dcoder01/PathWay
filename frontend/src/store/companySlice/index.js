import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllCompanies = createAsyncThunk("company/fetchAllCompanies",async (_, thunkAPI) => {
 
  
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/company/fetch`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch companies");
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    allCompanies: [],
    loading: false,
    error: null,
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
      });
  },
});

export default companySlice.reducer;
