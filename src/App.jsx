import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";
import Pricing from "./pages/Pricing";
import Payment from "./pages/Payment";
import ApiKeys from "./pages/ApiKeys";
import Navbar from "./components/Navbar";


export default function App() {
  const { user, ready } = useAuth();

  // ⏳ Wait until Firebase auth is fully resolved
  if (!ready) {
    return (
      <div className="verify-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* ✅ Navbar renders ONLY when user exists */}
      <Navbar user={user} />

      <Routes>
        {/* ---------- PUBLIC ---------- */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Landing />}
        />

        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        {/* ---------- VERIFY EMAIL ---------- */}
        <Route
          path="/verify-email"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : user.emailVerified ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <VerifyEmail />
            )
          }
        />

        {/* ---------- DASHBOARD ---------- */}
        <Route
          path="/dashboard"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : !user.emailVerified ? (
              <Navigate to="/verify-email" replace />
            ) : (
              <Dashboard />
            )
          }
        />

        {/* ---------- API KEYS ---------- */}
        <Route
          path="/api-keys"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : !user.emailVerified ? (
              <Navigate to="/verify-email" replace />
            ) : (
              <ApiKeys />
            )
          }
        />

        {/* ---------- BILLING ---------- */}
        <Route
          path="/pricing"
          element={!user ? <Navigate to="/login" replace /> : <Pricing />}
        />

        <Route
          path="/payment"
          element={!user ? <Navigate to="/login" replace /> : <Payment />}
        />

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}