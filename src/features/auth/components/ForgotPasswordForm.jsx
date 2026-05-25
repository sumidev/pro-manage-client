import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";

export const ForgotPasswordForm = ({ onSubmit, error }) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ email });
      setSent(true);
    } catch {
      /* error from parent */
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "var(--green-light)" }}
        >
          <CheckCircle2 size={22} style={{ color: "var(--green-text)" }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Check your email
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          If an account exists for <strong>{email}</strong>, we sent a password reset link.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: "var(--accent)" }}
        >
          <ArrowLeft size={14} /> Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
        Forgot password?
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {error && (
        <div
          className="flex items-start gap-2.5 px-3 py-2.5 rounded mb-4 text-sm"
          style={{ background: "var(--red-light)", border: "1px solid #fca5a5", color: "var(--red-text)" }}
        >
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
            Email address
          </label>
          <div className="relative">
            <Mail
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="pm-input pl-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded text-sm font-semibold text-white transition-all disabled:opacity-70"
          style={{ background: "var(--accent)" }}
        >
          {submitting && <Loader2 size={15} className="animate-spin" />}
          {submitting ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <div className="mt-5 pt-4 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: "var(--accent)" }}
        >
          <ArrowLeft size={14} /> Back to login
        </Link>
      </div>
    </div>
  );
};
