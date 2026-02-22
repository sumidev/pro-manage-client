import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { createTask } from "../tasks/tasksSlice";

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (params, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/projects?page=${params}`);
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
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        const newTask = action.payload;

        // 2. Hum check kar rahe hain: "Kya project load ho chuka hai?"
        // Tumhara variable 'project' hai, to hum 'state.project' check karenge
        if (state.project && state.project.tasks) {
          // 3. Stage nikalo (e.g., 'todo')
          const stageName = newTask.stage || "todo";

          // 4. Safety Check: Agar 'todo' naam ka array nahi mila to bana do
          if (!state.project.tasks[stageName]) {
            state.project.tasks[stageName] = [];
          }

          // 5. PUSH: Naya task list mein add kar do
          state.project.tasks[stageName].unshift(newTask);
        }
        state.error = null;
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
