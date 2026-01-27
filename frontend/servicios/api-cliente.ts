export async function apiCliente<T = unknown>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  const url = `${base}${path}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init?.headers || {}),
  };
  const body =
    init?.json !== undefined ? JSON.stringify(init.json) : init?.body;
  const res = await fetch(url, { ...init, headers, body, cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error ${res.status} ${res.statusText} - ${text}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return (await res.json()) as T;
  return undefined as unknown as T;
}
