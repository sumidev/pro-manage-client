import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "@/features/auth/authSlice";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const handleSubmit = async ({ email }) => {
    const result = await dispatch(forgotPassword({ email }));
    if (forgotPassword.fulfilled.match(result)) {
      toast.success(result.payload?.message || "Reset link sent to your email.");
      return;
    }
    throw new Error("forgot-password-failed");
  };

  return <ForgotPasswordForm onSubmit={handleSubmit} error={error} />;
};

export default ForgotPasswordPage;
