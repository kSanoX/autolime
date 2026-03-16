const TOKEN_KEY = "device_jwt_token";

export async function ensureDeviceToken(): Promise<string | null> {
  const existing = localStorage.getItem(TOKEN_KEY);
  if (existing) return null;

  try {
    const res = await fetch("https://back.alacitus.com/app/device/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "android" }),
    });

    const data = await res.json();
    if (!res.ok || !data.token) throw new Error("Token fetch failed");

    localStorage.setItem(TOKEN_KEY, data.token);
    return data.token;
  } catch (err) {
    console.error("Device token error:", err);
    return null;
  }
}

export function getDeviceToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearDeviceToken() {
  localStorage.removeItem(TOKEN_KEY);
}
