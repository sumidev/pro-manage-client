import { X, Mail, Loader2, UserPlus, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { inviteMember } from "../projectsSlice";
import toast from "react-hot-toast";

const InviteMemberModal = ({ isOpen, onClose, projectId }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await toast.promise(dispatch(inviteMember({ email, projectId })).unwrap, {
        loading: "Inviting Member...",
        success: "Member Invited!",
        error: (err) => `${err.message}`,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setEmail("");
      setMessage("testing");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Click inside shouldn't close
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Invite Member</h3>
              <p className="text-xs text-gray-500">
                Add user to this project by email
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message Alert (Success/Error) */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={14} />
            ) : (
              <X size={14} />
            )}
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleInvite}>
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-3 top-3 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                size={18}
              />
              <input
                type="email"
                required
                autoFocus
                className="w-full border border-gray-200 bg-gray-50 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 text-gray-700"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm transition-all"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;
