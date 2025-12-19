import { useEffect, useState } from "react";
import { getApiKey } from "../api/orbmem";
import ApiKeyCard from "../components/ApiKeyCard";
import "../styles/ApiKeys.css";

export default function ApiKeys() {
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState(null);
  const [newKey, setNewKey] = useState(null);

  useEffect(() => {
    // 🔥 CHECK ONE-TIME KEY
    const raw = sessionStorage.getItem("orbmem_new_api_key");
    if (raw) {
      setNewKey(raw);
      sessionStorage.removeItem("orbmem_new_api_key");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await getApiKey();
        setApiKey(res);
      } catch {
        setApiKey(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="api-page">
        <div className="loader"></div>
      </div>
    );
  }

  /* 🔴 FULL SCREEN SECURITY WARNING */
  if (newKey) {
    return (
      <div className="key-once-screen">
        <div className="key-once-box">
          <h1>⚠ SECURITY WARNING</h1>
          <p>
            This API key will be shown <b>ONLY ONCE</b>.
            <br />
            Copy it now and store it securely.
          </p>

          <code className="full-key">{newKey}</code>

          <button
            className="btn-primary"
            onClick={() => navigator.clipboard.writeText(newKey)}
          >
            Copy API Key
          </button>

          <button
            className="btn-danger"
            onClick={() => window.location.reload()}
          >
            OK, I Understand
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="api-page fade-in">
      <h1>Your API Keys</h1>
      <p className="subtitle">
        For security reasons, API keys are masked.
      </p>

      {apiKey ? (
        <ApiKeyCard apiKey={apiKey} />
      ) : (
        <div className="empty-api animate-sad">
          <div className="sad-face">:(</div>
          <h3>No API keys found</h3>
        </div>
      )}
    </div>
  );
}