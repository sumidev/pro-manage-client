import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const createTask = createAsyncThunk(
  "tasks/task",
  async (taskData, thunkAPI) => {
    try {
      const response = await api.post(
        `/projects/${taskData.projectId}/tasks`,
        taskData,
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const moveTaskStage = createAsyncThunk(
  "tasks/moveTaskStage",
  async ({ taskId, newStage, newIndex }, thunkAPI) => {
    try {
      const response = await api.put(`/tasks/${taskId}/move`, {
        stage: newStage,
        position: newIndex,
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`tasks/${id}`, data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const addComment = createAsyncThunk(
  "tasks/comments",
  async ({payload,taskId,stage}, thunkAPI) => {
    try {
      const response = await api.post(`comments`, payload);
      return {comment : response.data.data ,taskId ,stage};
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getComments = createAsyncThunk(
  "tasks/getComments/",
  async({payload,taskId,stage},thunkAPI) => {
    try{
      const response = await api.get(`comments`,{ params: payload })
       return {comments : response.data.data ,taskId ,stage};
    }catch(error){
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
)

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    task: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        },
      );
  },
});

export default tasksSlice.reducer;
