import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../features/auth/authSlice";
import { RegisterForm } from "../../features/auth/components/RegisterForm";
import { processPendingInvitation } from "@/utils/authHelper";

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) {
      await processPendingInvitation();
      navigate("/dashboard", { replace: true });
    }
  };

  return <RegisterForm onSubmit={handleSubmit} />;
};
