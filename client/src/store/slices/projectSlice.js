import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";


export const downloadFile = createAsyncThunk("downloadProjectFile", async ({ projectId, fileId }, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/${projectId}/files/${fileId}/download`, {
      responseType: "blob",
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

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    selected: null,
  },
  reducers: {},
  extraReducers: (builder) => { },
});

export default projectSlice.reducer;
