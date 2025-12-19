import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth/firebase";
import orbmemLogo from "../assets/orbmem-dark.png";
import "../styles/main.css";

export default function Navbar({ user }) {
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();

  // 🚫 No user → no navbar
  if (!user) return null;

  const handleLogout = async () => {
    setConfirmLogout(false);
    setOpen(false);
    await auth.signOut();
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav className="nav">
        <div
          className="brand"
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >
          <img src={orbmemLogo} alt="Orbmem" className="logo" />
          <span className="brand-name">Orbmem</span>
        </div>

        <div className="nav-right">
          <div
            className="avatar"
            title={user.email}
            onClick={() => setOpen((v) => !v)}
          >
            {user.email[0].toUpperCase()}
          </div>
        </div>
      </nav>

      {/* ===== DROPDOWN ===== */}
      {open && (
        <div className="dropdown">
          <div className="dropdown-email">{user.email}</div>

          <button
            className="dropdown-btn"
            onClick={() => {
              setOpen(false);
              navigate("/api-keys");
            }}
          >
            API Keys
          </button>

          <button
            className="dropdown-btn danger"
            onClick={() => {
              setOpen(false);
              setConfirmLogout(true);
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* ===== LOGOUT CONFIRM MODAL ===== */}
      {confirmLogout && (
        <div className="modal-backdrop">
          <div className="modal-card slide-up">
            <h3>Log out?</h3>
            <p>
              Are you sure you want to log out of <b>Orbmem</b>?
            </p>

            <div className="modal-actions">
              <button
                className="btn-outline"
                onClick={() => setConfirmLogout(false)}
              >
                Cancel
              </button>

              <button className="btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}