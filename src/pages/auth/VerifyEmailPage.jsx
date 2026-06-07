import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resendVerificationEmail } from "../../features/auth/authSlice";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export const VerifyEmailPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const email = location.state?.email || user?.email || "";

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    setLoading(true);
    try {
      const resultAction = await dispatch(resendVerificationEmail({ email }));
      if (resendVerificationEmail.fulfilled.match(resultAction)) {
        toast.success("Verification email resent successfully!");
        setCountdown(60);
      } else {
        toast.error(resultAction.payload || "Failed to resend email.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ background: "rgba(99,102,241,0.1)", color: "var(--accent)" }}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        Check your email
      </h2>
      <p className="mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
        We have sent a verification link to your email address. Please click the link to verify your account.
      </p>

      <button
        onClick={handleResend}
        disabled={loading || countdown > 0}
        className="w-full py-2.5 rounded font-medium text-white mb-4 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        style={{ background: "var(--accent)" }}
      >
        {loading
          ? "Sending..."
          : countdown > 0
          ? `Resend in ${countdown}s`
          : "Resend Verification Email"}
      </button>

      <div className="text-sm">
        <span style={{ color: "var(--text-muted)" }}>Verified your email? </span>
        <Link to="/dashboard" className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
