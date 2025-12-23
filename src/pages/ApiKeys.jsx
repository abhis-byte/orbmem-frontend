import { useEffect, useState } from "react";
import ApiKeyCard from "../components/ApiKeyCard";
import "../styles/ApiKeys.css";
import {
  getApiKey,
  revokeApiKey,
  regenerateApiKey,
} from "../api/orbmem";

export default function ApiKeys() {
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState(null);
  const [newKey, setNewKey] = useState(null);
  const [copied, setCopied] = useState(false);

  /* ------------------------------------
     INITIAL LOAD / ONE-TIME KEY CHECK
  ------------------------------------ */
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
      } catch (err) {
        console.error("Failed to load API key", err);
        setApiKey(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ------------------------------------
     HELPERS
  ------------------------------------ */
  const refreshKeys = async () => {
    setLoading(true);
    try {
      const res = await getApiKey();
      setApiKey(res);
    } catch {
      setApiKey(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    try {
      await revokeApiKey();
      setApiKey(null); // immediate UI feedback
    } catch (err) {
      console.error("Revoke failed", err);
      alert("Failed to revoke API key. Please try again.");
    }
  };

  const handleRegenerate = async () => {
    try {
      await regenerateApiKey();
      // new key is already stored in sessionStorage
      window.location.reload(); // intentional + safe here
    } catch (err) {
      console.error("Regenerate failed", err);
      alert("Failed to regenerate API key. Please try again.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ------------------------------------
     LOADING
  ------------------------------------ */
  if (loading) {
    return (
      <div className="api-page">
        <div className="loader"></div>
      </div>
    );
  }

  /* ------------------------------------
     ONE-TIME KEY SCREEN
  ------------------------------------ */
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
              {copied ? "Key Copied!" : "Copy API Key"}
            </button>

            <button
              className="btn-danger"
              onClick={() => window.location.reload()}
            >
              OK, I Understand
            </button>
          </div>

          {copied && <div className="copy-toast"></div>}
        </div>
      </div>
    );
  }

  /* ------------------------------------
     MAIN PAGE
  ------------------------------------ */
  return (
    <div className="api-page fade-in">
      <h1>Your API Keys</h1>
      <p className="subtitle">
        For security reasons, API keys are masked.
      </p>

      {apiKey ? (
        <ApiKeyCard
          apiKey={apiKey}
          onRevoke={handleRevoke}
          onRegenerate={handleRegenerate}
        />
      ) : (
        <div className="empty-api animate-sad">
          <div className="sad-face">☹</div>
          <h3>No API keys found</h3>
        </div>
      )}
    </div>
  );
}