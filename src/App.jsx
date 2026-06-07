import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./components/layouts/AppLayout";
import GuestLayout from "./components/layouts/GuestLayout";
import LoginPage from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ProjectListPage from "./pages/project/ProjectListPage";
import ProjectBoardPage from "./pages/project/ProjectBoardPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./features/auth/authSlice";
import AcceptInvitation from "./pages/invitation/AcceptInvitation";
import UsersPage from "./pages/user-management/UsersPage";
import ProtectedRoute from "./components/layouts/ProtectedRoute";
import SettingsPage from "./pages/settings/SettingsPage";
import AppInitSkeleton from "./components/skeletons/AppInitSkeleton";

function App() {
  const dispatch = useDispatch();
  const { token, initializing } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [token, dispatch]);

  // Block render until loadUser finishes (only when token exists)
  if (initializing) return <AppInitSkeleton />;

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "13px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<Navigate to="/login" />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
        </Route>

        <Route path="/invitations/accept" element={<AcceptInvitation />} />

        {/* Private Routes */}
        <Route element={<AppLayout />}>
          <Route element={<ProtectedRoute allowedRoles={["admin", "employee", "client"]} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectListPage />} />
            <Route path="/projects/:id" element={<ProjectBoardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="user-management" element={<UsersPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
