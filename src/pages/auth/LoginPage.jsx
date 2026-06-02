import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../../features/auth/authSlice";
import { LoginForm } from "../../features/auth/components/LoginForm";
import { processPendingInvitation } from "@/utils/authHelper";
import { ROUTES } from "@/config/appConfig";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("session") === "expired") {
      toast.error("Your session has expired. Please log in again.");
    }
  }, [searchParams]);

  const handleSubmit = async (creds) => {
    const result = await dispatch(loginUser(creds));
    if (loginUser.fulfilled.match(result)) {
      await processPendingInvitation();
      const returnTo = searchParams.get("returnTo");
      const safeReturn =
        returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")
          ? decodeURIComponent(returnTo)
          : ROUTES.DASHBOARD;
      navigate(safeReturn, { replace: true });
    }
  };

  return <LoginForm onSubmit={handleSubmit} />;
};

export default LoginPage;
