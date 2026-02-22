import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";

export default function GuestLayout() {
  const isAuth = useSelector(isAuthenticated);

  if (isAuth) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <Outlet />
      </div>
    </div>
  );
}
