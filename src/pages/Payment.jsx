import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import "../styles/Payment.css";

/**
 * 🔥 SINGLE SOURCE OF TRUTH
 * NO env vars, NO duplication
 */
const API_BASE = "https://orbmem.onrender.com/v1";

export default function Payment() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, ready } = useAuth();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("PAY & GENERATE API KEY");

  const plan = params.get("plan") || "monthly";

  /* --------------------------------------------------
     Load Razorpay Script (once)
  -------------------------------------------------- */
  useEffect(() => {
    if (window.Razorpay) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  /* --------------------------------------------------
     Helper: Always get a FRESH Firebase token
  -------------------------------------------------- */
  const getFreshToken = async () => {
    if (!user) {
      navigate("/login");
      throw new Error("User not authenticated");
    }
    return await user.getIdToken(true);
  };

  /* --------------------------------------------------
     Main Payment Flow
  -------------------------------------------------- */
  const handlePayment = async () => {
    if (!ready || !user || loading) return;

    setLoading(true);
    setStatus("INITIALIZING GATEWAY...");

    let order = null;
    let attempts = 0;
    const maxAttempts = 10;

    /* ---------- CREATE ORDER ---------- */
    while (attempts < maxAttempts) {
      try {
        const token = await getFreshToken();

        const res = await fetch(
          `${API_BASE}/payments/create-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Firebase-Token": token,
            },
            body: JSON.stringify({ plan }),
          }
        );

        if (res.ok) {
          order = await res.json();
          break;
        }
      } catch (err) {
        console.log("RETRY_CREATE_ORDER", attempts + 1);
      }

      attempts++;
      await new Promise((r) => setTimeout(r, 4000));
    }

    if (!order) {
      alert("Gateway initialization failed. Please retry.");
      setLoading(false);
      setStatus("PAY & GENERATE API KEY");
      return;
    }

    setStatus("REDIRECTING TO TERMINAL...");

    /* ---------- RAZORPAY ---------- */
    const options = {
      key: order.razorpay_key,
      amount: order.amount,
      currency: "INR",
      name: "ORBMEM",
      description: "Secure API Key Provisioning",
      order_id: order.order_id,

      handler: async (response) => {
        setStatus("VERIFYING TRANSACTION...");

        try {
          const token = await getFreshToken();

          const verifyRes = await fetch(
            `${API_BASE}/payments/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Firebase-Token": token,
              },
              body: JSON.stringify(response),
            }
          );

          if (!verifyRes.ok) throw new Error();

          const data = await verifyRes.json();

          // 🔐 one-time reveal
          sessionStorage.setItem(
            "orbmem_new_api_key",
            data.api_key
          );

          navigate("/api-keys", { replace: true });
        } catch {
          alert(
            "Payment successful.\n" +
            "Verification completing in background.\n" +
            "Your API key will appear shortly."
          );
          navigate("/api-keys", { replace: true });
        }
      },

      modal: {
        ondismiss: () => {
          setLoading(false);
          setStatus("PAY & GENERATE API KEY");
        },
      },

      prefill: { email: user.email },
      theme: { color: "#4fc3f7" },
    };

    new window.Razorpay(options).open();
  };

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */
  return (
    <div className="payment-page">
      <h1>SECURE CHECKOUT</h1>
      <p className="subtitle">
        Encrypted transaction & key provisioning
      </p>

      <button
        className="btn-primary"
        onClick={handlePayment}
        disabled={loading}
      >
        {status}
      </button>
    </div>
  );
}
