import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const submitProjectProposal = createAsyncThunk('student/submitProjectProposal', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/student/project-proposal', data);
    toast.success(res.data.message);
    return res.data.project;
  } catch (error) {
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchProject = createAsyncThunk('student/fetchProject', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/student/project');
    return res.data.data?.project;
  } catch (error) {
    toast.error(error.response.data.message || "Failed to fetch project");
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getSupervisor = createAsyncThunk('student/getSupervisor', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/student/supervisor");
    return res.data.data?.supervisor;
  }
  catch (error) {
    toast.error(error.response.data.message || "Failed to fetch supervisor");
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchAllSupervisors = createAsyncThunk('student/fetchAllSupervisors', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/student/supervisors');
    return res.data.data?.supervisors || [];
  } catch (error) {
    toast.error(error.response.data.message || "Failed to fetch available supervisors");
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const requestSupervisor = createAsyncThunk('student/requestSupervisor', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/student/request-supervisor', data);
    thunkAPI.dispatch(getSupervisor());
    return res.data.data?.request;
  } catch (error) {
    toast.error(error.response.data.message || "Failed to request supervisor");
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const studentSlice = createSlice({
  name: "student",
  initialState: {
    project: null,
    files: [],
    supervisors: [],
    dashboardStats: [],
    supervisor: null,
    deadlines: [],
    feedback: [],
    status: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(submitProjectProposal.fulfilled, (state, action) => {
      state.project = action.payload?.project || action.payload;
    });
    builder.addCase(fetchProject.fulfilled, (state, action) => {
      state.project = action.payload?.project || action.payload || null;
    });
    builder.addCase(getSupervisor.fulfilled, (state, action) => {
      state.supervisor = action.payload || null;
    });
    builder.addCase(fetchAllSupervisors.fulfilled, (state, action) => {
      state.supervisors = action.payload.supervisors || action.payload || [];
    });
    builder.addCase(requestSupervisor.fulfilled, (state, action) => {
      state.requests = [...state.requests, action.payload.request];
    });
  },
});

export default studentSlice.reducer;
