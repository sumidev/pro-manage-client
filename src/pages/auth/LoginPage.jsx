import { useDispatch } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../features/auth/components/LoginForm";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (creds) => {
    const result = await dispatch(loginUser(creds));
    if (loginUser.fulfilled.match(result)) {
      console.log("wroking");
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Welcome Back
      </h2>
      <LoginForm onSubmit={handleSubmit} />
    </div>
  );
};

export default LoginPage;
