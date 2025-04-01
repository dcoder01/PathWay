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
//fetch company by id

export const fetchCompanyById = createAsyncThunk("company/fetchCompanyById", async (companyId, thunkAPI) => {

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/company/fetch/${companyId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to get company");
  }
}
);
//update company

export const updateCompany = createAsyncThunk("company/updateCompany", async ({ companyId, updateData }, thunkAPI) => {

  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/company/update/${companyId}`, updateData, { withCredentials: true });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update company");
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
    currentCompany: null,
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
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCompany=action.payload.company
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default companySlice.reducer;
