/**
 * API client for authenticated requests.
 * Credentials are included for cookie-based auth (Supabase).
 */

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(
      (err as { error?: string }).error ?? err.message ?? "Request failed",
    );
  }

  return res.json() as Promise<T>;
}
