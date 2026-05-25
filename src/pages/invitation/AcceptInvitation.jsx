import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AlertCircle,
  CheckCircle2,
  FolderKanban,
  Loader2,
  UserPlus,
  X,
} from "lucide-react";
import { invitationService } from "@/services/invitationService";
import { isAuthenticated } from "@/features/auth/authSlice";
import api from "@/services/api";
import InvitationSkeleton from "@/components/skeletons/InvitationSkeleton";
import InvitationLayout from "@/components/layouts/InvitationLayout";
import toast from "react-hot-toast";

const inviterDisplayName = (inviter) => {
  if (!inviter) return "A team member";
  const name = `${inviter.first_name || ""} ${inviter.last_name || ""}`.trim();
  return name || inviter.email || "A team member";
};

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const auth = useSelector(isAuthenticated);
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [invitationData, setInvitationData] = useState(null);
  const [error, setError] = useState("");
  const [processingAction, setProcessingAction] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
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
    setError("");

    if (action === "reject") {
      if (!auth) {
        navigate("/login", { replace: true });
        return;
      }
      try {
        await api.post(`/invitations/${token}/respond`, { action: "reject" });
        toast.success("Invitation declined.");
        navigate("/dashboard", { replace: true });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to decline invitation.");
        setProcessingAction(null);
      }
      return;
    }

    if (action === "accept") {
      if (auth) {
        try {
          const res = await api.post(`/invitations/${token}/respond`, { action: "accept" });
          toast.success(res.data?.message || "You joined the project!");
          const projectId = invitationData?.project?.id || invitationData?.project_id;
          navigate(projectId ? `/projects/${projectId}` : "/dashboard", { replace: true });
        } catch (err) {
          setError(
            err.response?.data?.message || "Failed to accept the invitation.",
          );
          setProcessingAction(null);
        }
      } else {
        invitationService.saveToken(token);
        navigate("/register", {
          state: {
            message: "Create an account or log in to join the project.",
          },
          replace: true,
        });
      }
    }
  };

  if (loading) {
    return (
      <InvitationLayout>
        <InvitationSkeleton embedded />
      </InvitationLayout>
    );
  }

  if (error && !invitationData) {
    return (
      <InvitationLayout>
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--red-light)" }}
          >
            <AlertCircle size={22} style={{ color: "var(--red-text)" }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Invalid invitation
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            {error}
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full py-2 px-4 rounded text-sm font-semibold text-white"
            style={{ background: "var(--accent)" }}
          >
            Go to login
          </Link>
        </div>
      </InvitationLayout>
    );
  }

  const project = invitationData?.project;
  const projectInitial = (project?.name?.charAt(0) || "P").toUpperCase();

  return (
    <InvitationLayout>
      <div className="text-center mb-6">
        <div
          className="w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4 text-xl font-bold"
          style={{ background: "var(--accent-light)", color: "var(--accent-text)", border: "1px solid #c7d2fe" }}
        >
          {projectInitial}
        </div>
        <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          Project invitation
        </h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--text-primary)" }}>
            {inviterDisplayName(invitationData?.inviter)}
          </strong>{" "}
          invited you to collaborate
        </p>
      </div>

      {error && (
        <div
          className="flex items-start gap-2.5 px-3 py-2.5 rounded mb-4 text-sm"
          style={{ background: "var(--red-light)", border: "1px solid #fca5a5", color: "var(--red-text)" }}
        >
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div
        className="rounded-lg p-4 mb-6"
        style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
          Project details
        </p>
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded flex items-center justify-center shrink-0"
            style={{ background: "var(--accent-light)", color: "var(--accent)" }}
          >
            <FolderKanban size={16} />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              {project?.name || "Untitled project"}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {project?.description || "No description provided for this project."}
            </p>
          </div>
        </div>
      </div>

      {!auth && (
        <p
          className="flex items-center gap-2 text-xs mb-4 px-3 py-2 rounded"
          style={{ background: "var(--accent-light)", color: "var(--accent-text)" }}
        >
          <UserPlus size={14} className="shrink-0" />
          Sign in or register to accept this invitation.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => handleAction("accept")}
          disabled={processingAction !== null}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded text-sm font-semibold text-white transition-all disabled:opacity-70"
          style={{ background: "var(--accent)" }}
        >
          {processingAction === "accept" ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <CheckCircle2 size={15} />
          )}
          {processingAction === "accept" ? "Accepting…" : "Accept invitation"}
        </button>

        <button
          type="button"
          onClick={() => handleAction("reject")}
          disabled={processingAction !== null}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded text-sm font-semibold transition-all disabled:opacity-70"
          style={{
            background: "var(--bg-card)",
            border: "1.5px solid var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          {processingAction === "reject" ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <X size={15} />
          )}
          {processingAction === "reject" ? "Declining…" : "Decline"}
        </button>
      </div>
    </InvitationLayout>
  );
};

export default AcceptInvitation;
