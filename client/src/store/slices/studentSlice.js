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

export const uploadProjectFiles = createAsyncThunk('student/uploadProjectFiles', async ({ projectId, files }, thunkAPI) => {
  try {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const res = await axiosInstance.post(`/student/upload/${projectId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.success(res.data.message);
    thunkAPI.dispatch(fetchProject());
    return res.data.data?.project;
  } catch (error) {
    toast.error(error.response.data.message || "Failed to upload files");
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchDashboardStats = createAsyncThunk('student/fetchDashboardStats', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/student/dashboard-stats');
    return res.data.data || {};
  } catch (error) {
    toast.error(error.response.data.message || "Failed to fetch dashboard stats");
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getFeedBack = createAsyncThunk('student/getFeedBack', async (projectId, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/student/feedback/${projectId}`);
    return res.data.data?.feedback || [];
  } catch (error) {
    toast.error(error.response.data.message || "Failed to fetch feedback");
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const downloadFile = createAsyncThunk('student/downloadFile', async ({ projectId, fileId }, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/student/download/${projectId}/${fileId}`, {
      responseType: 'blob',
    });
    return {
      blob: res.data,
      projectId,
      fileId
    }
    toast.success("File downloaded successfully");
  } catch (error) {
    toast.error(error.response.data.message || "Failed to download file");
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
    builder.addCase(uploadProjectFiles.fulfilled, (state, action) => {
      const newFiles = action.payload?.project?.files || action.payload?.files || [];
      state.files = [...state.files, ...newFiles];
    });
    builder.addCase(fetchDashboardStats.fulfilled, (state, action) => {
      state.dashboardStats = action.payload || {};
    });
    builder.addCase(getFeedBack.fulfilled, (state, action) => {
      state.feedback = action.payload || [];
    });
  },
});

export default studentSlice.reducer;
