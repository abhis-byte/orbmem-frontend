import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth/firebase";
import { sendEmailVerification } from "firebase/auth";
import confetti from "canvas-confetti";
import "../styles/main.css";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [verified, setVerified] = useState(!!user?.emailVerified);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [resending, setResending] = useState(false);

  if (!user) return null;

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    return `${name[0]}***@${domain}`;
  };

  // Poll for verification
  useEffect(() => {
    if (verified) return;

    const interval = setInterval(async () => {
      await user.reload();

      if (user.emailVerified) {
        setVerified(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user, verified]);

  // After verified, redirect
  useEffect(() => {
    if (!verified) return;
    const timer = setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 2000);
    return () => clearTimeout(timer);
  }, [verified, navigate]);

  const handleResend = async () => {
    try {
      setResending(true);
      await sendEmailVerification(user);
      setResendCooldown(30);
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (resendCooldown === 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((v) => v - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  return (
    <div className="verify-container fade-in">
      {!verified ? (
        <div className="verify-card slide-up">
          <div className="verify-icon">✉️</div>
          <h2>Confirm your email address</h2>

          <p className="verify-text">
            A verification link has been sent to:
            <br />
            <strong>{maskEmail(user.email)}</strong>
          </p>

          <div className="loader" />

          {/* Professional Spam Hint */}
          <div className="spam-notice">
            <p>
              Can't find the email? Please check your <strong>spam or junk folder</strong>. 
              Sometimes automated messages are filtered there by mistake.
            </p>
          </div>

          <p className="verify-sub">Waiting for verification status...</p>

          <div className="action-area">
            <button
              className="btn-resend"
              onClick={handleResend}
              disabled={resendCooldown > 0 || resending}
            >
              {resending
                ? "Resending..."
                : resendCooldown > 0
                ? `Resend available in ${resendCooldown}s`
                : "Resend verification email"}
            </button>
          </div>
        </div>
      ) : (
        <div className="verify-card success slide-up">
          <div className="checkmark-glow">✓</div>
          <h2>Account Verified</h2>
          <p>Welcome! We're taking you to your dashboard now.</p>
        </div>
      )}
    </div>
  );
}