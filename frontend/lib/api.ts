export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

async function call<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      //!fixed: include credentials so cookie is sent to our Next routes if needed
      credentials: "include",
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) {
      return { ok: false, error: data?.error || res.statusText };
    }
    return { ok: true, data };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Network error" };
  }
}

export const api = {
  profile: () => call("/api/me/profile"),
  register: (body: any) =>
    call<{ token: string; user: any }>("/api/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: any) =>
    call<{ token: string; user: any }>("/api/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  logout: () => call("/api/logout", { method: "POST" }),
  dashboard: () => call("/api/me/dashboard"),
  referrals: () => call("/api/me/referrals"),
  referralLink: () => call("/api/me/referrals/link"),
  purchase: (amount: number) =>
    call("/api/me/purchases", {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
};
