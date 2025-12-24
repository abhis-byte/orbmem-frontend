import { auth } from "../auth/firebase";

/**
 * 🔥 SINGLE SOURCE OF TRUTH
 * DO NOT use .env for v1
 */
const API_BASE = "https://orbmem.onrender.com/v1";

/**
 * Get Firebase ID token (auto-refreshing)
 */
async function getFirebaseToken() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not logged in");
  }
  return await user.getIdToken(true); // force refresh
}

/**
 * ================================
 * GET MY API KEY (MASKED)
 * ================================
 */
export async function getApiKey() {
  const token = await getFirebaseToken();

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

  // 🔐 one-time reveal storage
  sessionStorage.setItem("orbmem_new_api_key", data.api_key);

  return data;
}

/**
 * ================================
 * REVOKE API KEY
 * ================================
 */
export async function revokeApiKey() {
  const token = await getFirebaseToken();

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
