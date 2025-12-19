import "../styles/dashboard.css";

export default function ApiKeyCard({ apiKey }) {
  // 1. Guard clause is correct
  if (!apiKey || !apiKey.key) {
    return (
      <div className="api-card expired">
        <h3>API Key</h3>
        <p className="muted">No API key available 😔</p>
      </div>
    );
  }

  // 2. Added dots for better masking clarity
  const masked = apiKey.key.slice(0, 8) + "...." + apiKey.key.slice(-4);

  const isExpired =
    apiKey.expires_at &&
    new Date(apiKey.expires_at) < new Date();

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey.key);
      alert("API key copied");
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    // 3. Fixed Template Literal Syntax (added backticks)
    <div className={`api-card ${isExpired ? "expired" : ""}`}>
      <h3>API Key</h3>

      <p className="key">{masked}</p>

      <p>
        Status:{" "}
        <strong>{isExpired ? "Expired" : "Active"}</strong>
      </p>

      {apiKey.expires_at && (
        <p>
          Expires on:{" "}
          {new Date(apiKey.expires_at).toLocaleDateString()}
        </p>
      )}

      {isExpired && (
        <button className="renew-btn">
          Renew (Coming Soon)
        </button>
      )}
    </div>
  );
}
