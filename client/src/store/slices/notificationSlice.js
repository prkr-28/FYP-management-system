import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/notification/");
      return response.data.data || response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notifications");
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch notifications");
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (notificationId, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/notification/mark-as-read/${notificationId}`);
      toast.success("Notification marked as read");
      return response.data.data.notification;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark notification as read");
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to mark notification as read");
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.put("/notification/mark-all-as-read");
      toast.success("All notifications marked as read");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark all notifications as read");
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to mark all notifications as read");
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (notificationId, thunkAPI) => {
    try {
      await axiosInstance.delete(`/notification/delete/${notificationId}`);
      toast.success("Notification deleted successfully");
      return notificationId;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete notification");
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete notification");
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.notifications || action.payload || [];
        state.unreadCount = action.payload?.unreadOnly || 0;
        state.readCount = action.payload?.readOnly || 0;
        state.highPriorityMessages = action.payload?.highPriorityMessages || 0;
        state.thisWeekNotifications = action.payload?.thisWeekNotifications || 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notifications";
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.list = state.list.map(notification => {
          if (notification._id === action.payload._id) {
            return { ...notification, isRead: true };
          }
          return notification;
        });
        state.unreadCount = Math.max(state.unreadCount - 1, 0);
        state.readCount += 1;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.list = state.list.map(notification => ({ ...notification, isRead: true }));
        state.readCount += state.unreadCount;
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.list = state.list.filter(notification => notification._id !== action.payload);
        const deletedNotification = state.list.find(notification => notification._id === action.payload);
        if (deletedNotification) {
          if (deletedNotification.isRead) {
            state.readCount = Math.max(state.readCount - 1, 0);
          } else {
            state.unreadCount = Math.max(state.unreadCount - 1, 0);
          }

          if (deletedNotification.priority === "high") {
            state.highPriorityMessages = Math.max(state.highPriorityMessages - 1, 0);
          }

          // const oneWeekAgo = new Date();
          // oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          // if (new Date(deletedNotification.createdAt) >= oneWeekAgo) {
          //   state.thisWeekNotifications = Math.max(state.thisWeekNotifications - 1, 0);
          // }
        }
      })
  },
});

export default notificationSlice.reducer;
