import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
    try {
      const response = await api.get(`/projects`, {
        params: { page, search: searchQuery, ...filters },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/projects/${id}`);
      const data = response.data.data || response.data;
      if (data && data.project && data.tasks) {
        return { ...data.project, tasks: data.tasks };
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const createProject = createAsyncThunk(
  "projects/project",
  async (projectData, thunkAPI) => {
    try {
      const response = await api.post("/projects", projectData);
      const data = response.data.data || response.data;
      if (data && data.project && typeof data.tasks !== 'undefined') {
        return { ...data.project, tasks: data.tasks };
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`projects/${id}`, data);
      const resData = response.data.data || response.data;
      if (resData && resData.project && typeof resData.tasks !== 'undefined') {
        return { ...resData.project, tasks: resData.tasks };
      }
      return resData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`projects/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
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
      return thunkAPI.rejectWithValue(error.response?.data);
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
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    project: null,
    projectLoading: false,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearProjectDetails: (state) => {
      state.project = null;
      state.projectLoading = false;
    },
    moveTaskOptimistically: (state, action) => {
      const { taskId, fromStage, toStage, newIndex } = action.payload;
      if (!state.project?.tasks) return;
      const sourceList = state.project.tasks[fromStage];
      const destList = state.project.tasks[toStage];
      if (!sourceList || !destList) return;
      const taskIndex = sourceList.findIndex(
        (t) => t.id.toString() === taskId.toString(),
      );
      if (taskIndex !== -1) {
        const [movedTask] = sourceList.splice(taskIndex, 1);
        movedTask.stage = toStage;
        destList.splice(newIndex, 0, movedTask);
      }
    },
    syncTaskMovement: (state, action) => {
      const updatedTask = action.payload;
      const { id, stage: newStage } = updatedTask;
      if (!state.project?.tasks) return;
      Object.keys(state.project.tasks).forEach((stageName) => {
        state.project.tasks[stageName] = state.project.tasks[stageName].filter(
          (task) => task.id !== id,
        );
      });
      if (state.project.tasks[newStage]) {
        state.project.tasks[newStage].push(updatedTask);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchProjects ──────────────────────────────────────
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.data;
        state.pagination = {
          currentPage: action.payload.current_page,
          totalPages: action.payload.last_page,
          totalItems: action.payload.to,
        };
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Failed to fetch projects";
      })

      // ── fetchProjectById ───────────────────────────────────
      .addCase(fetchProjectById.pending, (state) => {
        state.projectLoading = true;
        state.project = null;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.projectLoading = false;
        state.project = action.payload;
        state.error = null;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.projectLoading = false;
        state.error = action.payload?.message ?? "Failed to load project";
      })

      // ── createProject ──────────────────────────────────────
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload);
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Failed to create project";
      })

      // ── updateProject ──────────────────────────────────────
      .addCase(updateProject.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        if (state.project?.id === action.payload.id) {
          state.project = { ...state.project, ...action.payload };
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.error = action.payload?.message ?? "Failed to update project";
      })

      // ── deleteProject ──────────────────────────────────────
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProject.fulfilled, (state) => {
        state.loading = false;
        state.project = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Failed to delete project";
      })

      // ── searchProject ──────────────────────────────────────
      .addCase(searchProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(searchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Search failed";
      })

      // ── inviteMember ───────────────────────────────────────
      .addCase(inviteMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(inviteMember.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(inviteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "Invite failed";
      })

      // ── Task actions (from tasksSlice) ─────────────────────
      .addCase(createTask.fulfilled, (state, action) => {
        const newTask = action.payload;
        if (state.project?.tasks) {
          const stageName = newTask.stage || "todo";
          if (!state.project.tasks[stageName]) {
            state.project.tasks[stageName] = [];
          }
          state.project.tasks[stageName].unshift(newTask);
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        if (state.project?.tasks) {
          const stage = updatedTask.stage;
          const taskIndex = state.project.tasks[stage]?.findIndex(
            (t) => t.id === updatedTask.id,
          );
          if (taskIndex !== undefined && taskIndex !== -1) {
            Object.assign(state.project.tasks[stage][taskIndex], updatedTask.update);
          }
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const { stage: stageName, id: taskId } = action.payload;
        if (state.project?.tasks?.[stageName]) {
          state.project.tasks[stageName] = state.project.tasks[stageName].filter(
            (t) => t.id !== taskId,
          );
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { comment: newComment, taskId, stage } = action.payload;
        if (state.project?.tasks?.[stage]) {
          const taskIndex = state.project.tasks[stage].findIndex(
            (t) => t.id === taskId,
          );
          if (taskIndex === -1) return;
          const task = state.project.tasks[stage][taskIndex];
          if (newComment.parent_id !== null) {
            const commentIndex = task.comments?.findIndex(
              (c) => c.id === newComment.parent_id,
            );
            if (commentIndex !== undefined && commentIndex !== -1) {
              task.comments[commentIndex].replies.push(newComment);
            }
          } else {
            if (!task.comments) task.comments = [];
            task.comments.push(newComment);
          }
        }
      })
      .addCase(getComments.fulfilled, (state, action) => {
        const { comments, taskId, stage } = action.payload;
        if (state.project?.tasks?.[stage]) {
          const taskIndex = state.project.tasks[stage].findIndex(
            (t) => t.id === taskId,
          );
          if (taskIndex !== -1) {
            state.project.tasks[stage][taskIndex].comments = comments;
          }
        }
      });
  },
});

export const { moveTaskOptimistically, syncTaskMovement, clearProjectDetails } =
  projectsSlice.actions;
export default projectsSlice.reducer;
