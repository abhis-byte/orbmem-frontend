import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import "../styles/Payment.css";

const API_BASE = import.meta.env.VITE_ORBMEM_API_BASE;

export default function Payment() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, ready } = useAuth();

  const [firebaseToken, setFirebaseToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const plan = params.get("plan") || "monthly";

  // --------------------------------------------------
  // LOAD RAZORPAY SCRIPT (ONCE)
  // --------------------------------------------------
  useEffect(() => {
    if (window.Razorpay) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // --------------------------------------------------
  // FETCH FIREBASE TOKEN ONCE (CRITICAL FIX)
  // --------------------------------------------------
  useEffect(() => {
    if (!user) return;

    user
      .getIdToken(false) // ❌ DO NOT FORCE REFRESH
      .then(setFirebaseToken)
      .catch(() => {
        alert("Authentication expired. Please login again.");
        navigate("/login");
      });
  }, [user, navigate]);

  // --------------------------------------------------
  // HANDLE PAYMENT
  // --------------------------------------------------
  const handlePayment = async () => {
    if (!ready || !user || !firebaseToken) return;

    setLoading(true);

    try {
      // 1️⃣ CREATE ORDER
      const res = await fetch(`${API_BASE}/v1/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Firebase-Token": firebaseToken, // ✅ SAME TOKEN
        },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) throw new Error("Order creation failed");

      const order = await res.json();

      // 2️⃣ OPEN RAZORPAY
      const options = {
        key: order.razorpay_key,
        amount: order.amount,
        currency: "INR",
        name: "Orbmem",
        description: "API Key Subscription",
        order_id: order.order_id,

        handler: async (response) => {
          // 3️⃣ VERIFY PAYMENT (SAME TOKEN)
          const verifyRes = await fetch(
            `${API_BASE}/v1/payments/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Firebase-Token": firebaseToken,
              },
              body: JSON.stringify(response),
            }
          );

          if (!verifyRes.ok) {
            alert("Payment verification failed");
            return;
          }

          const data = await verifyRes.json();

          // 🔐 STORE RAW KEY (ONE TIME)
          sessionStorage.setItem("orbmem_new_api_key", data.api_key);

          navigate("/api-keys", { replace: true });
        },

        prefill: {
          email: user.email,
        },

        method: {
          upi: true,
          card: false,
          netbanking: false,
          wallet: false,
        },

        theme: {
          color: "#4fc3f7",
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page fade-in">
      <h1>Complete Payment</h1>
      <p className="subtitle">
        Secure payment required to activate your API key.
      </p>

      <button
        className="btn-primary"
        onClick={handlePayment}
        disabled={!ready || !firebaseToken || loading}
      >
        {loading ? "Processing…" : "Pay & Generate API Key"}
      </button>
    </div>
  );
}