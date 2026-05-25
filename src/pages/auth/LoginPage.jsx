import { useDispatch } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../features/auth/components/LoginForm";
import { processPendingInvitation } from "@/utils/authHelper";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (creds) => {
    const result = await dispatch(loginUser(creds));
    if (loginUser.fulfilled.match(result)) {
      await processPendingInvitation();
      navigate("/dashboard", { replace: true });
    }
  };

  return <LoginForm onSubmit={handleSubmit} />;
};

export default LoginPage;
