import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

/**
 * Same split layout as GuestLayout — used for invitation accept (no auth redirect).
 */
export default function InvitationLayout({ children }) {
  return (
    <div
      className="h-dvh w-full max-w-[100vw] flex overflow-hidden"
      style={{ background: "var(--bg-app)" }}
    >
      <div
        className="hidden lg:flex flex-col justify-between w-[400px] shrink-0 p-10"
        style={{ background: "var(--sidebar-bg)" }}
      >
        <div className="flex items-center mb-6">
          <img src="/logo.png" alt="ProManage Logo" className="w-48 h-auto object-contain object-left" style={{ mixBlendMode: 'screen' }} />
        </div>

        <div>
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
            style={{ background: "rgba(99,102,241,0.2)" }}
          >
            <Mail size={22} style={{ color: "var(--accent)" }} />
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-3">
            You&apos;re invited<br />to collaborate.
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--sidebar-text)" }}>
            Accept the invitation to join the project team, access the kanban board, and work with your colleagues in real time.
          </p>
        </div>

        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} ProManage. All rights reserved.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto min-h-0">
        <div
          className="w-full max-w-[500px] rounded-lg border p-8"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow-md)" }}
        >
          {/* Mobile logo */}
          <div className="flex items-center mb-6 lg:hidden">
            <img src="/logo.png" alt="ProManage Logo" className="w-36 h-auto object-contain object-left" style={{ mixBlendMode: 'screen' }} />
          </div>

          {children}

          <p className="mt-6 pt-4 text-center text-sm" style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold" style={{ color: "var(--accent)" }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
