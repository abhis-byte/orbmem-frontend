import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../auth/firebase";

import googleLogo from "../assets/google.svg";
import eyeOpen from "../assets/eye-open.svg";
import eyeClosed from "../assets/eye-closed.svg";
import "../styles/main.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 RESET PASSWORD STATE
  const [resetMsg, setResetMsg] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  /* =========================
     EMAIL / PASSWORD AUTH
  ========================= */
  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await sendEmailVerification(cred.user);
        navigate("/verify-email", { replace: true });
        return;
      }

      const cred = await signInWithEmailAndPassword(auth, email, password);

      if (!cred.user.emailVerified) {
        navigate("/verify-email", { replace: true });
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FORGOT PASSWORD
  ========================= */
  const handleForgotPassword = async () => {
    if (!email) {
      setResetError("Enter your email to reset password");
      return;
    }

    try {
      setResetLoading(true);
      setResetError("");
      setResetMsg("");

      await sendPasswordResetEmail(auth, email);

      setResetMsg(
        "Password reset email sent. Check your inbox (and spam)."
      );
    } catch (err) {
      setResetError(err.message.replace("Firebase:", ""));
    } finally {
      setResetLoading(false);
    }
  };

  /* =========================
     GOOGLE AUTH
  ========================= */
  const handleGoogle = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card slide-up">
        <h2>{isSignup ? "Create your account" : "Welcome back"}</h2>
        <p className="subtext">Orbmem — AI Memory Backend</p>

        {error && <div className="error-box">{error}</div>}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email address"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword((v) => !v)}
            aria-label="Toggle password visibility"
          >
            <img src={showPassword ? eyeOpen : eyeClosed} alt="" />
          </button>
        </div>

        {/* 🔑 FORGOT PASSWORD */}
        {!isSignup && (
          <div className="forgot-row">
            <button
              type="button"
              className="forgot-btn"
              onClick={handleForgotPassword}
              disabled={resetLoading}
            >
              {resetLoading ? "Sending…" : "Forgot password?"}
            </button>
          </div>
        )}

        {resetMsg && <p className="reset-success">{resetMsg}</p>}
        {resetError && <p className="reset-error">{resetError}</p>}

        {/* PRIMARY */}
        <button
          className="btn-auth"
          onClick={handleEmailAuth}
          disabled={loading}
        >
          {loading
            ? "Please wait…"
            : isSignup
            ? "Create account"
            : "Login"}
        </button>

        <div className="divider">OR</div>

        {/* GOOGLE */}
        <button
          className="btn-google"
          onClick={handleGoogle}
          disabled={loading}
        >
          <img src={googleLogo} alt="Google" />
          Continue with Google
        </button>

        {/* TOGGLE */}
        <p className="link" onClick={() => setIsSignup((v) => !v)}>
          {isSignup
            ? "Already have an account? Login"
            : "New user? Sign up"}
        </p>
      </div>
    </div>
  );
}