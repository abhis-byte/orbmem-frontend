import { auth } from "../auth/firebase";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * Get Firebase ID token (auto-refreshing)
 */
async function getFirebaseToken() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not logged in");
  }
  return await user.getIdToken(true);
}

/**
 * ================================
 * GET MY API KEY (MASKED)
 * ================================
 */
export async function getApiKey() {
  const token = await getFirebaseToken();

  // FIX: Wrapped URL in backticks (``) to use template literal variables
  const res = await fetch(`${API_BASE}/api-keys/me`, {
    headers: {
      "X-Firebase-Token": token,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch API keys");
  }

  const data = await res.json();

  // backend returns { keys: [...] }
  return Array.isArray(data.keys) && data.keys.length > 0
  ? data.keys[0]
  : null;
}

/**
 * ================================
 * REGENERATE API KEY
 * ================================
 */
export async function regenerateApiKey(plan = "basic") {
  const token = await getFirebaseToken();

  // FIX: Wrapped URL in backticks (``)
  const res = await fetch(`${API_BASE}/api-keys/regenerate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Firebase-Token": token,
    },
    body: JSON.stringify({ plan }),
  });

  if (!res.ok) {
    throw new Error("Failed to regenerate API key");
  }

  const data = await res.json();

  // 🔐 ONE-TIME STORAGE (used by ApiKeys.jsx)
  sessionStorage.setItem("orbmem_new_api_key", data.api_key);

  return data;
}

/**
 * ================================
 * OPTIONAL: DELETE / REVOKE KEY
 * ================================
 */
export async function revokeApiKey() {
  const token = await getFirebaseToken();

  // FIX: Wrapped URL in backticks (``)
  const res = await fetch(`${API_BASE}/api-keys/revoke`, {
    method: "POST",
    headers: {
      "X-Firebase-Token": token,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to revoke API key");
  }

  return true;
}
