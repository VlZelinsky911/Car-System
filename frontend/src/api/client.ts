import type { User, Vehicle } from "../types";

const USER_API = import.meta.env.VITE_USER_API_URL ?? "http://localhost:3001";
const VEHICLE_API =
  import.meta.env.VITE_VEHICLE_API_URL ?? "http://localhost:3002";

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });

  if (res.ok) {
    // Handle empty/no-content responses gracefully
    if (res.status === 204) return undefined as unknown as T;
    const contentType = res.headers.get("content-type") || "";
    // If not JSON, assume empty/success
    if (!contentType.includes("application/json")) {
      return undefined as unknown as T;
    }
    // Some servers send content-type but empty body
    const text = await res.text();
    if (!text) return undefined as unknown as T;
    return JSON.parse(text) as T;
  }


  const bodyText = await res.text();
  let message = bodyText;
  let code: string | undefined;

  try {
    const data = JSON.parse(bodyText);
    message = data?.error?.message ?? data?.message ?? bodyText;
    code = data?.error?.code ?? data?.code;
  } catch {}

  const err = new Error(message) as Error & { status?: number; code?: string };
  err.status = res.status;
  if (code) err.code = code;
  throw err;
}

export const api = {
	listUsers: () => http<User[]>(`${USER_API}/users`),
	createUser: (payload: { email: string; name: string; password: string }) =>
		http<User>(`${USER_API}/users`, {
			method: "POST",
			body: JSON.stringify(payload),
		}),
  deleteUser: (id: number) =>
    http<void>(`${USER_API}/users/${id}`, { method: "DELETE" }),

  listVehicles: (userId?: number) =>
    http<Vehicle[]>(
      `${VEHICLE_API}/vehicles${userId ? `?userId=${userId}` : ""}`
    ),
  createVehicle: (payload: {
    make: string;
    model: string;
    year?: number;
    userId: number;
  }) =>
    http<Vehicle>(`${VEHICLE_API}/vehicles`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  deleteVehicle: (id: number) =>
    http<void>(`${VEHICLE_API}/vehicles/${id}`, { method: "DELETE" }),
};
