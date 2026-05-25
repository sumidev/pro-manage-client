import { useState } from "react";
import { UserPlus } from "lucide-react";
import InviteMemberModal from "@/features/projects/components/InviteMemberModal";

/**
 * Compact CTA to invite members when a project has none (or assignee list is empty).
 */
const InviteMemberButton = ({
  projectId,
  label = "Invite team member",
  className = "",
  variant = "button", // "button" | "link"
}) => {
  const [open, setOpen] = useState(false);

  if (!projectId) return null;

  return (
    <>
      {variant === "link" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-all ${className}`}
          style={{ color: "var(--accent)" }}
        >
          <UserPlus size={13} />
          {label}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-semibold transition-all ${className}`}
          style={{
            background: "var(--accent-light)",
            color: "var(--accent-text)",
            border: "1px solid rgba(99,102,241,0.25)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent-light)"; e.currentTarget.style.color = "var(--accent-text)"; }}
        >
          <UserPlus size={13} />
          {label}
        </button>
      )}

      <InviteMemberModal
        isOpen={open}
        onClose={() => setOpen(false)}
        projectId={projectId}
      />
    </>
  );
};

export default InviteMemberButton;
