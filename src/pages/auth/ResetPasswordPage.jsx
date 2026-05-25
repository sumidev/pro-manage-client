import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "@/features/auth/authSlice";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  if (!token || !email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = async (payload) => {
    const result = await dispatch(resetPassword(payload));
    if (resetPassword.fulfilled.match(result)) {
      toast.success(result.payload?.message || "Password reset successfully.");
      navigate("/login", { replace: true });
    }
  };

  return (
    <ResetPasswordForm
      email={email}
      token={token}
      onSubmit={handleSubmit}
      error={error}
    />
  );
};

export default ResetPasswordPage;
