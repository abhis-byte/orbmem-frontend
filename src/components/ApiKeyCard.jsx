import { useState, useEffect } from "react";
import "../styles/dashboard.css";

import {
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithRedirect,
  getRedirectResult,
} from "firebase/auth";

import { auth } from "../auth/firebase";

import googleIcon from "../assets/google.svg";
import eyeOpen from "../assets/eye-open.svg";
import eyeClose from "../assets/eye-closed.svg";

export default function ApiKeyCard({ apiKey, onRevoke, onRegenerate }) {
  /* ================= GUARD ================= */
  if (!apiKey || !apiKey.key) {
    return (
      <div className="api-card expired">
        <h3>API Key</h3>
        <p className="muted">No API key available 😔</p>
      </div>
    );
  }

  /* ================= STATE ================= */
  const masked = apiKey.key.slice(0, 8) + "...." + apiKey.key.slice(-4);

  const isExpired =
    apiKey.expires_at && new Date(apiKey.expires_at) < new Date();

  const [step, setStep] = useState(null); // null | confirm | reauth
  const [action, setAction] = useState(null); // revoke | regenerate
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  /* ================= HANDLE GOOGLE REDIRECT ================= */
  useEffect(() => {
    const handleRedirect = async () => {
      const pending = sessionStorage.getItem("pending_api_key_action");
      if (!pending) return;

      try {
        const user = auth.currentUser;
        if (!user) return;

        // 🔥 force fresh token
        await user.getIdToken(true);

        if (pending === "revoke") {
          await onRevoke();
        }

        if (pending === "regenerate") {
          await onRegenerate();
        }

        sessionStorage.removeItem("pending_api_key_action");
      } catch (err) {
        console.error("Post-Google action failed", err);
      }
    };

    handleRedirect();
  }, [onRevoke, onRegenerate]);

  /* ================= RE-AUTH METHODS ================= */
  const reauthWithPassword = async () => {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("No user");

    const credential = EmailAuthProvider.credential(user.email, password);

    await reauthenticateWithCredential(user, credential);
    await user.getIdToken(true);
  };

  const reauthWithGoogle = async () => {
    // 🔥 persist intent across redirect
    sessionStorage.setItem("pending_api_key_action", action);

    const provider = new GoogleAuthProvider();
    await reauthenticateWithRedirect(auth.currentUser, provider);
  };

  /* ================= CONFIRM FLOW ================= */
  const confirmAction = async () => {
    setLoading(true);
    setError(null);

    try {
      if (password) {
        await reauthWithPassword();

        if (action === "revoke") await onRevoke();
        if (action === "regenerate") await onRegenerate();

        setStep(null);
        setAction(null);
        setPassword("");
      } else {
        // Google uses redirect
        await reauthWithGoogle();
      }
    } catch (err) {
      console.error(err);
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      {/* API CARD */}
      <div className={`api-card ${isExpired ? "expired" : ""}`}>
        <h3>API Key</h3>
        <p className="key">{masked}</p>

        <p>
          Status: <strong>{isExpired ? "Expired" : "Active"}</strong>
        </p>

        <div className="action-row">
          <button
            className="btn-outline"
            onClick={() => {
              setAction("regenerate");
              setStep("confirm");
            }}
          >
            Regenerate
          </button>

          <button
            className="btn-danger-outline"
            onClick={() => {
              setAction("revoke");
              setStep("confirm");
            }}
          >
            Revoke
          </button>
        </div>
      </div>

      {/* 1. CONFIRM MODAL (ADDED BACK) */}
      {step === "confirm" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Are you sure?</h2>
            <p className="modal-text">
              {action === "revoke"
                ? "This will permanently disable your API key."
                : "Your current API key will be revoked and a new one will be generated."}
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setStep(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={() => setStep("reauth")}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. RE-AUTH MODAL (UNCHANGED) */}
      {step === "reauth" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Verification required</h2>

            {/* 1. Password Input */}
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="reauth-input"
              />
              <img
                src={showPassword ? eyeClose : eyeOpen}
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
                alt="toggle visibility"
              />
            </div>

            {/* 2. Visual Separator */}
            <div className="separator">
              <span className="separator-text">or</span>
            </div>

            {/* 3. Google Button */}
            <button
              className="google-btn"
              onClick={reauthWithGoogle}
              disabled={loading}
            >
              <img src={googleIcon} alt="Google" />
              Verify with Google
            </button>

            {error && <p className="error-text">{error}</p>}

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setStep(null);
                  setError(null);
                  setPassword("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={confirmAction}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}