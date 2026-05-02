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
      navigate("/dashboard");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
        <p className="mt-2 text-sm text-gray-600">Join ProManage today</p>
      </div>
      <RegisterForm onSubmit={handleSubmit} />
    </div>
  );
};
