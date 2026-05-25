import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export const RegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  return (
    <div>
      <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
        Create your account
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        Start managing projects with your team
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
              First name
            </label>
            <input type="text" required placeholder="John" className="pm-input" onChange={set("firstName")} disabled={submitting} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
              Last name
            </label>
            <input type="text" required placeholder="Doe" className="pm-input" onChange={set("lastName")} disabled={submitting} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
            Email address
          </label>
          <input type="email" required placeholder="you@example.com" className="pm-input" onChange={set("email")} disabled={submitting} />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="Min. 8 characters"
              className="pm-input pr-10"
              onChange={set("password")}
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
            type="password"
            required
            minLength={8}
            placeholder="Re-enter password"
            className="pm-input"
            onChange={set("passwordConfirmation")}
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded text-sm font-semibold text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ background: "var(--accent)" }}
          onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = "var(--accent-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)"; }}
        >
          {submitting && <Loader2 size={15} className="animate-spin" />}
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="mt-5 pt-4 text-center text-sm" style={{ borderTop: "1px solid var(--border)" }}>
        <span style={{ color: "var(--text-secondary)" }}>Already have an account? </span>
        <Link to="/login" className="font-semibold" style={{ color: "var(--accent)" }}>
          Log in
        </Link>
      </div>
    </div>
  );
};
