import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/notification/get-notifications");
      return response.data.data.notifications;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notifications");
      return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications");
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/notification/mark-as-read/${notificationId}`);
      toast.success("Notification marked as read");
      return response.data.data.notification;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark notification as read");
      return rejectWithValue(error.response?.data?.message || "Failed to mark notification as read");
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.put("/notification/mark-all-as-read");
      toast.success("All notifications marked as read");
      return;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark all notifications as read");
      return rejectWithValue(error.response?.data?.message || "Failed to mark all notifications as read");
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/notification/delete/${notificationId}`);
      toast.success("Notification deleted successfully");
      return notificationId;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete notification");
      return rejectWithValue(error.response?.data?.message || "Failed to delete notification");
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    list: [],
    unreadCount: 0,
    readCount: 0,
    highPriorityMessages: 0,
    thisWeekNotifications: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => { },
});

export default notificationSlice.reducer;
