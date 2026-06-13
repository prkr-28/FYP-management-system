import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const createStudent = createAsyncThunk(
  "createStudent",
  async (Data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/admin/create-student", Data);
      toast.success(response.data.message || "Student created successfully");
      return response.data.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create student");
      return thunkAPI.rejectWithValue(error.response?.data.message || "Failed to create student");
    }
  }
);

export const updateStudent = createAsyncThunk(
  "updateStudent",
  async ({ id, Data }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/admin/update-student/${id}`, Data);
      toast.success(response.data.message || "Student updated successfully");
      return response.data.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update student");
      return thunkAPI.rejectWithValue(error.response?.data.message || "Failed to update student");
    }
  }
);

export const deleteStudent = createAsyncThunk(
  "deleteStudent",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/admin/delete-student/${id}`);
      toast.success(response.data.message || "Student deleted successfully");
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete student");
      return thunkAPI.rejectWithValue(error.response?.data.message || "Failed to delete student");
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "getAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/admin/get-all-users");
      return response.data.data.users;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
      return thunkAPI.rejectWithValue(error.response?.data.message || "Failed to fetch users");
    }
  }
);

//similar async thunks can be created for teachers..

export const createTeacher = createAsyncThunk(
  "createTeacher",
  async (Data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/admin/create-teacher", Data);
      toast.success(response.data.message || "Teacher created successfully");
      return response.data.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create teacher");
      return thunkAPI.rejectWithValue(error.response?.data.message || "Failed to create teacher");
    }
  }
);

export const updateTeacher = createAsyncThunk(
  "updateTeacher",
  async ({ id, Data }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/admin/update-teacher/${id}`, Data);
      toast.success(response.data.message || "Teacher updated successfully");
      return response.data.data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update teacher");
      return thunkAPI.rejectWithValue(error.response?.data.message || "Failed to update teacher");
    }
  }
);

export const deleteTeacher = createAsyncThunk(
  "deleteTeacher",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/admin/delete-teacher/${id}`);
      toast.success(response.data.message || "Teacher deleted successfully");
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete teacher");
      return thunkAPI.rejectWithValue(error.response?.data.message || "Failed to delete teacher");
    }
  }
);

export const getAllProjects = createAsyncThunk(
  "getAllProjects",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/admin/get-all-projects");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch projects");
      return thunkAPI.rejectWithValue(error.response?.data.message || "Failed to fetch projects");
    }
  }
);

export const getDashBoardStats = createAsyncThunk(
  "getDashBoardStats",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/admin/get-dashboard-stats");
      return response.data.data.stats;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch dashboard stats");
      return thunkAPI.rejectWithValue(error.response?.data.message || "Failed to fetch dashboard stats");
    }
  }
);



const adminSlice = createSlice({
  name: "admin",
  initialState: {
    students: [],
    teachers: [],
    projects: [],
    users: [],
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createStudent.fulfilled, (state, action) => {
        if (state.users) {
          state.users.unshift(action.payload); // Add new student to the users list
        }
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        if (state.users) {
          state.users = state.users.map(user => user._id === action.payload._id ? { ...user, ...action.payload } : user);
        }
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        if (state.users) {
          state.users = state.users.filter(user => user._id !== action.payload);
        }
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        if (state.users) {
          state.users.unshift(action.payload); // Add new teacher to the users list
        }
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        if (state.users) {
          state.users = state.users.map(user => user._id === action.payload._id ? { ...user, ...action.payload } : user);
        }
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        if (state.users) {
          state.users = state.users.filter(user => user._id !== action.payload);
        }
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.projects = action.payload.projects;
      })
      .addCase(getDashBoardStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default adminSlice.reducer;
