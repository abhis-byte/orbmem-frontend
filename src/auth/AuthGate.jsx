import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

export default function AuthGate({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else if (!user.emailVerified) {
        navigate("/verify-email");
      }
      setLoading(false);
    });

    return () => unsub();
  }, [navigate]);

  if (loading) {
    return (
      <div className="verify-container">
        <div className="loader"></div>
      </div>
    );
  }

  return children;
}
