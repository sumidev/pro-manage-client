import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./components/layouts/AppLayout";
import GuestLayout from "./components/layouts/GuestLayout";
import LoginPage from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import ProjectListPage from "./pages/project/ProjectListPage";
import ProjectBoardPage from "./pages/project/ProjectBoardPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [token, dispatch]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public Routes (Login/Register) */}
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<Navigate to="/login" />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Private Routes (Dashboard/Projects) */}
        <Route path="/" element={<AppLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectListPage />} />
          <Route path="projects/:id" element={<ProjectBoardPage />} />
          {/* Future routes: /projects/:id */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
