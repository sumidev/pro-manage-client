import { X, Mail, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { inviteMember, fetchProjectById } from "../projectsSlice";
import toast from "react-hot-toast";
import ModalPortal from "@/components/ui/ModalPortal";

const InviteMemberModal = ({ isOpen, onClose, projectId }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await toast.promise(dispatch(inviteMember({ email, projectId })).unwrap(), {
        loading: "Sending invite...",
        success: "Invitation sent!",
        error: (err) => err?.message || "Failed to send invite",
      });
      dispatch(fetchProjectById(projectId));
      setEmail("");
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal isOpen={isOpen}>
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(9,30,66,0.54)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded shadow-2xl mx-4 fade-in"
        style={{ background: "#fff", border: "1px solid #dfe1e6" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: "1px solid #dfe1e6" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded flex items-center justify-center"
              style={{ background: "#e8f0fe" }}
            >
              <UserPlus size={14} style={{ color: "#0052cc" }} />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "#172b4d" }}>
                Invite to project
              </h3>
              <p className="text-xs" style={{ color: "#6b778c" }}>
                Add a team member by email
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded transition-all"
            style={{ color: "#6b778c" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f5f7"; e.currentTarget.style.color = "#172b4d"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#6b778c"; }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleInvite} className="px-5 py-4">
          <div className="mb-4">
            <label className="pm-label block mb-1.5">
              Email address <span style={{ color: "#de350b" }}>*</span>
            </label>
            <div className="relative">
              <Mail
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#97a0af" }}
              />
              <input
                type="email"
                required
                autoFocus
                placeholder="colleague@company.com"
                className="pm-input pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <p className="text-xs mt-1.5" style={{ color: "#97a0af" }}>
              They'll receive an email invitation to join this project.
            </p>
          </div>

          <div
            className="flex justify-end gap-2 pt-3"
            style={{ borderTop: "1px solid #dfe1e6" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded text-sm font-medium transition-all"
              style={{ background: "#f4f5f7", color: "#172b4d", border: "1px solid #dfe1e6" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#ebecf0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#f4f5f7"; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "#0052cc" }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#0065ff"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#0052cc"; }}
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              {loading ? "Sending..." : "Send invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </ModalPortal>
  );
};

export default InviteMemberModal;
