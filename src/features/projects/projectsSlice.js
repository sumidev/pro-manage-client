import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import api from "../../services/api";
import {
  createTask,
  updateTask,
  addComment,
  getComments,
  deleteTask,
} from "../tasks/tasksSlice";

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async ({ page = 1, searchQuery = "", filters = {} }, thunkAPI) => {
    console.log("api",searchQuery);
    try {
      const response = await api.get(`/projects`, {
        params: {
          page: page,
          search: searchQuery,
          ...filters
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const createProject = createAsyncThunk(
  "projects/project",
  async (projectData, thunkAPI) => {
    try {
      const response = await api.post("/projects", projectData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const inviteMember = createAsyncThunk(
  "projects/invite",
  async (inviteData, thunkAPI) => {
    try {
      const response = await api.post("/projects/invite", inviteData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const searchProject = createAsyncThunk(
  "project/search",
  async (param, thunkAPI) => {
    try {
      const response = await api.post("/projects/search", param);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    project: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    moveTaskOptimistically: (state, action) => {
      const { taskId, fromStage, toStage, newIndex } = action.payload;
      if (!state.project || !state.project.tasks) return;

      const sourceList = state.project.tasks[fromStage];
      const destList = state.project.tasks[toStage];
      const taskIndex = sourceList.findIndex(
        (t) => t.id.toString() === taskId.toString(),
      );

      if (taskIndex !== -1) {
        const [movedTask] = sourceList.splice(taskIndex, 1);
        movedTask.stage = toStage;
        destList.splice(newIndex, 0, movedTask);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.data;
        ((state.pagination = {
          currentPage: action.payload.current_page,
          totalPages: action.payload.last_page,
          totalItems: action.payload.to,
        }),
          (state.error = null));
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload);
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
        state.error = null;
      })
      .addCase(searchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload;
        if (state.project && state.project.tasks) {
          const stage = updatedTask.stage;
          const taskId = updatedTask.id;
          const taskIndex = state.project.tasks[stage].findIndex(
            (t) => t.id === taskId,
          );
          Object.assign(
            state.project.tasks[stage][taskIndex],
            updatedTask.update,
          );
        }
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        const newTask = action.payload;
        if (state.project && state.project.tasks) {
          const stageName = newTask.stage || "todo";
          if (!state.project.tasks[stageName]) {
            state.project.tasks[stageName] = [];
          }
          state.project.tasks[stageName].unshift(newTask);
        }
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        const task = action.payload;
        if (state.project && state.project.tasks) {
          const stageName = task.stage;
          const taskId = task.id;
          state.project.tasks[stageName] = state.project.tasks[
            stageName
          ].filter(task => task.id !== taskId);
        }
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        const newComment = action.payload;
        if (state.project && state.project.tasks) {
          const stage = newComment.stage;
          const taskId = newComment.taskId;
          const taskIndex = state.project.tasks[stage].findIndex(
            (t) => t.id === taskId,
          );
          const task = state.project.tasks[stage][taskIndex];

          if (newComment.comment.parent_id !== null) {
            const commentIndex = task.comments.findIndex(
              (c) => c.id === newComment.comment.parent_id,
            );
            task.comments[commentIndex].replies.push(newComment.comment);
          } else {
            task.comments.push(newComment.comment);
          }
        }
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        const comments = action.payload;
        if (state.project && state.project.tasks) {
          const stage = comments.stage;
          const taskId = comments.taskId;
          const taskIndex = state.project.tasks[stage].findIndex(
            (t) => t.id === taskId,
          );
          const task = state.project.tasks[stage][taskIndex];
          task.comments = comments.comments;
        }
      })
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

export const { moveTaskOptimistically } = projectsSlice.actions;
export default projectsSlice.reducer;
