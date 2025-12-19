import { useEffect, useState } from "react";
import { auth } from "../auth/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import "../styles/main.css";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [verified, setVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [resending, setResending] = useState(false);

  // 🔒 SAFETY
  if (!user) return null;

  /* =========================
     MASK EMAIL (a***@gmail.com)
  ========================= */
  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    return `${name[0]}***@${domain}`;
  };

  /* =========================
     AUTO-CHECK VERIFICATION
  ========================= */
  useEffect(() => {
    const interval = setInterval(async () => {
      await user.reload();
      if (user.emailVerified) {
        setVerified(true);
        clearInterval(interval);

        // 🎉 CONFETTI
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1800);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate, user]);

  /* =========================
     RESEND EMAIL
  ========================= */
  const handleResend = async () => {
    setResending(true);
    await sendEmailVerification(user);
    setResending(false);
    setResendCooldown(30);
  };

  /* =========================
     COOLDOWN TIMER
  ========================= */
  useEffect(() => {
    if (resendCooldown === 0) return;
    const timer = setTimeout(
      () => setResendCooldown((v) => v - 1),
      1000
    );
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  return (
    <div className="verify-container fade-in">
      {!verified ? (
        <div className="verify-card slide-up">
          <h2>Verify your email</h2>

          <p className="verify-text">
            We sent a verification link to
            <br />
            <strong>{maskEmail(user.email)}</strong>
          </p>

          <div className="loader" />

          <p className="verify-sub">
            Waiting for verification…
          </p>

          <button
            className="btn-resend"
            onClick={handleResend}
            disabled={resendCooldown > 0 || resending}
          >
            {resending
              ? "Resending…"
              : resendCooldown > 0
              ? `Resend email (${resendCooldown}s)`
              : "Resend verification email"}
          </button>
        </div>
      ) : (
        <div className="verify-card success slide-up">
          <div className="checkmark-glow">✓</div>
          <h2>Email verified</h2>
          <p>Redirecting to dashboard…</p>
        </div>
      )}
    </div>
  );
}
