import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const createDeadline = createAsyncThunk("createDeadline", async ({ id, dueDate }, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`/deadline/create-deadline/${id}`, { dueDate });
    toast.success("Deadline created successfully");
    return response.data.data?.deadline || response.data.data || res.data || null;
  } catch (error) {
    toast.error(error.response?.data?.message || "An error occurred while creating the deadline.");
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

const deadlineSlice = createSlice({
  name: "deadline",
  initialState: {
    deadlines: [],
    nearby: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDeadline.fulfilled, (state, action) => {
        const item = action.payload;
        if (item) {
          state.deadlines.push(item);
        }
      })
  },
});

export default deadlineSlice.reducer;
