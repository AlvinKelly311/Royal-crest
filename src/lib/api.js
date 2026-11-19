import { clearToken, getToken } from "./token";

const API = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export async function api(path, options = {}) {
  const token = getToken();
  let res;
  try {
    res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(0, "Cannot reach the server. Check your connection and try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) clearToken(); // expired or invalid token
    const issue = data.issues?.[0];
    const detail = issue ? `${issue.path?.join(".") || "input"}: ${issue.message}` : null;
    throw new ApiError(res.status, detail ?? data.message ?? "Something went wrong");
  }
  return data;
}
