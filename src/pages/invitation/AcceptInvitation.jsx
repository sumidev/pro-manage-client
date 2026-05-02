import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { invitationService } from "@/services/invitationService";
import { isAuthenticated } from "@/features/auth/authSlice";
import api from "@/services/api";

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = useSelector(isAuthenticated);
  const token = searchParams.get("token");

  // States for handling the UI and data
  const [loading, setLoading] = useState(true);
  const [invitationData, setInvitationData] = useState(null);
  const [error, setError] = useState("");
  const [processingAction, setProcessingAction] = useState(null); // 'accept' or 'reject'

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchInvitationDetails = async () => {
      try {
        const response = await api.get(`/invitations/${token}`);
        setInvitationData(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "This invitation link is invalid or has expired.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvitationDetails();
  }, [token, navigate]);

  const handleAction = async (action) => {
    setProcessingAction(action);

    if (action === "reject") {
      try {
        await api.post(`/invitations/${token}/respond`, { action: "reject" });
        navigate("/", { replace: true });
      } catch (err) {
        console.error(err);
        setError("Failed to reject invitation.");
        setProcessingAction(null);
      }
      return;
    }

    if (action === "accept") {
      if (auth) {
        try {
          await api.post(`/invitations/${token}/respond`, { action: "accept" });
          navigate("/dashboard", { replace: true });
        } catch (err) {
          console.error(err);
          setError(
            err.response?.data?.message || "Failed to accept the invitation.",
          );
          setProcessingAction(null);
        }
      } else {
        invitationService.saveToken(token);
        navigate("/register", {
          state: {
            message: "Please create an account or log in to join the project.",
          },
          replace: true,
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-indigo-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-sm font-medium text-gray-500 animate-pulse">
            Loading invitation details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-700 font-bold text-2xl rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-indigo-200">
            {invitationData.project?.name?.charAt(0) || "P"}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Project Invitation
          </h2>
          <p className="text-gray-600 text-sm">
            <span className="font-semibold text-gray-800">
              {invitationData.inviter?.name}
            </span>{" "}
            has invited you to collaborate.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Project Details
          </h3>
          <p className="text-lg font-semibold text-gray-800 mb-1">
            {invitationData.project?.name}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {invitationData.project?.description ||
              "No description provided for this project."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleAction("accept")}
            disabled={processingAction !== null}
            className="flex-1 bg-indigo-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20"
          >
            {processingAction === "accept"
              ? "Accepting..."
              : "Accept Invitation"}
          </button>

          <button
            onClick={() => handleAction("reject")}
            disabled={processingAction !== null}
            className="flex-1 bg-white border-2 border-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processingAction === "reject" ? "Declining..." : "Decline"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
