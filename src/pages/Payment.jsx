import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import "../styles/Payment.css";

const API_BASE = "http://127.0.0.1:8000";

export default function Payment() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, ready } = useAuth();

  const plan = params.get("plan") || "basic";

  // Load Razorpay script once
  useEffect(() => {
    if (window.Razorpay) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!ready) return;

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // 1️⃣ Firebase token
      const token = await user.getIdToken(true);

      // 2️⃣ Create Razorpay order
      // FIX: Added backticks (``) to the fetch URL
      const res = await fetch(`${API_BASE}/v1/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Firebase-Token": token,
        },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) throw new Error("Order creation failed");

      const order = await res.json();

      // 3️⃣ Razorpay checkout
      const options = {
        key: order.razorpay_key,
        amount: order.amount,
        currency: "INR",
        name: "Orbmem",
        description: "API Key Subscription",
        order_id: order.order_id,

        handler: async function (response) {
          // 4️⃣ Verify payment
          // FIX: Added backticks (``) to the verification URL
          const verifyRes = await fetch(
            `${API_BASE}/v1/payments/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Firebase-Token": token,
              },
              body: JSON.stringify(response),
            }
          );

          if (!verifyRes.ok) {
            alert("Payment verification failed");
            return;
          }

          const data = await verifyRes.json();

          // 🔐 STORE FULL KEY (ONE TIME)
          sessionStorage.setItem(
            "orbmem_new_api_key",
            data.api_key
          );

          navigate("/api-keys");
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

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
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
        disabled={!ready}
      >
        Pay &amp; Generate API Key
      </button>
    </div>
  );
}
