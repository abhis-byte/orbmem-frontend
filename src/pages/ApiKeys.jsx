import { useEffect, useState } from "react";
import { getApiKey } from "../api/orbmem";
import ApiKeyCard from "../components/ApiKeyCard";
import "../styles/ApiKeys.css";

export default function ApiKeys() {
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState(null);
  const [newKey, setNewKey] = useState(null);
  // ✅ State for copy feedback
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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

  // ✅ Function to handle copy and show feedback
  const handleCopy = () => {
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    // Reset the "Copied" message after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="api-page">
        <div className="loader"></div>
      </div>
    );
  }

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

          <div className="button-group">
            <button
              className={`btn-primary ${copied ? "copied" : ""}`}
              onClick={handleCopy}
            >
              {copied ? "✅ Key Copied!" : "Copy API Key"}
            </button>

            <button
              className="btn-danger"
              onClick={() => window.location.reload()}
            >
              OK, I Understand
            </button>
          </div>
          
          {/* Optional: Floating toast message */}
          {copied && <div className="copy-toast">Copied to clipboard!</div>}
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
          <div className="sad-face">☹</div>
          <h3>No API keys found</h3>
        </div>
      )}
    </div>
  );
}