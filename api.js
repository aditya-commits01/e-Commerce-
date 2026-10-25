// Small fetch wrapper: adds the JWT and throws readable errors.
export async function api(path, { method = "GET", body } = {}) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const rupees = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
