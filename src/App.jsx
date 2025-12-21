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

// ✅ 1. Reusable Security Wrapper
const ProtectedRoute = ({ user, children, requireVerification = true }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireVerification && !user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

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

  const isAuthed = !!user;

  return (
    <BrowserRouter>
      <Navbar user={user} />

      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route
          path="/"
          element={isAuthed ? <Navigate to="/dashboard" replace /> : <Landing />}
        />
        <Route
          path="/login"
          element={isAuthed ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        {/* ---------- VERIFICATION PAGE ---------- */}
        <Route
          path="/verify-email"
          element={
            !isAuthed ? (
              <Navigate to="/login" replace />
            ) : user.emailVerified ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <VerifyEmail />
            )
          }
        />

        {/* ---------- PROTECTED ROUTES (Full Security) ---------- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/api-keys"
          element={
            <ProtectedRoute user={user}>
              <ApiKeys />
            </ProtectedRoute>
          }
        />

        {/* Pricing/Payment usually only require login, not necessarily verification */}
        <Route
          path="/pricing"
          element={
            <ProtectedRoute user={user} requireVerification={false}>
              <Pricing />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/payment"
          element={
            <ProtectedRoute user={user} requireVerification={false}>
              <Payment />
            </ProtectedRoute>
          }
        />

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}