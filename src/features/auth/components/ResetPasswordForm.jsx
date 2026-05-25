import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

export const ResetPasswordForm = ({ email, token, onSubmit, error }) => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) return;
    setSubmitting(true);
    try {
      await onSubmit({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const mismatch = passwordConfirmation && password !== passwordConfirmation;

  return (
    <div>
      <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
        Set new password
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        Choose a strong password for <strong>{email}</strong>
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
            New password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="At least 8 characters"
              className="pm-input pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
            Confirm password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            placeholder="Repeat password"
            className="pm-input"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            disabled={submitting}
          />
          {mismatch && (
            <p className="text-xs mt-1" style={{ color: "var(--red-text)" }}>
              Passwords do not match
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || mismatch}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded text-sm font-semibold text-white transition-all disabled:opacity-70"
          style={{ background: "var(--accent)" }}
        >
          {submitting && <Loader2 size={15} className="animate-spin" />}
          {submitting ? "Resetting..." : "Reset password"}
        </button>
      </form>

      <div className="mt-5 pt-4 text-center text-sm">
        <Link to="/login" className="font-semibold" style={{ color: "var(--accent)" }}>
          Back to login
        </Link>
      </div>
    </div>
  );
};
