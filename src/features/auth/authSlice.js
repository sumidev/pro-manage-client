import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await api.post("/register", userData);
      localStorage.setItem("token", response.data.data.token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post("/login", credentials);
      localStorage.setItem("token", response.data.data.token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/user");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      return;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/user/update",
  async (data, thunkAPI) => {
    try {
      const response = await api.post('/user/updateProfile', data,{
        headers: {
          'Content-Type': 'multipart/form-data' // Ye lagana safe side ke liye acha hai
        }});
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const updatePassword = createAsyncThunk(
  "auth/user/updatePassword",
  async (data, thunkAPI) => {
    try {
      const response = await api.post('/user/updatePassword', data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, thunkAPI) => {
    try {
      const response = await api.post("/forgot-password", { email });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, email, password, password_confirmation }, thunkAPI) => {
    try {
      const response = await api.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

const getAuthErrorMessage = (payload) => {
  if (!payload) return "Something went wrong.";
  if (typeof payload.message === "string") return payload.message;
  if (payload.error) return payload.error;
  const errors = payload.errors;
  if (errors && typeof errors === "object") {
    const first = Object.values(errors)[0];
    return Array.isArray(first) ? first[0] : String(first);
  }
  return "Something went wrong.";
};

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,      // login/register spinner
  initializing: !!localStorage.getItem("token"), // app boot me loadUser chal raha hai
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = getAuthErrorMessage(action.payload);
        localStorage.removeItem("token");
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.user = action.payload.user;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = getAuthErrorMessage(action.payload);
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = getAuthErrorMessage(action.payload);
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = getAuthErrorMessage(action.payload);
      })
      .addCase(loadUser.pending, (state) => {
        state.initializing = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.initializing = false;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.initializing = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      });
  },
});

export const { logout } = authSlice.actions;
export const isAuthenticated = (state) => !!state.auth.token;
export default authSlice.reducer;
