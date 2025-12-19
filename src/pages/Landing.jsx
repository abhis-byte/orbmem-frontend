import { useNavigate } from "react-router-dom";
import "../styles/main.css";
import orbmemLogo from "../assets/orbmem-dark.png";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <section className="hero fade-in">
        <h1>Orbmem</h1>
        <h2 className="tagline">
          The Memory & Reasoning Backend for AI
        </h2>

        <ul className="features">
          <li>🧠 Long-term per-user memory</li>
          <li>🔍 Vector (semantic) search</li>
          <li>🕸 Graph reasoning</li>
          <li>🛡 Built-in safety scanning</li>
          <li>🔐 Strict user isolation</li>
        </ul>

        <button
          className="btn-primary"
          onClick={() => navigate("/login")}
        >
          Get API Key
        </button>

      </section>
    </div>
  );
}

