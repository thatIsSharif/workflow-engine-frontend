import type {
  User, DashboardSummary, RecentActivityEntry, WorkflowHistoryEntry,
  ApplicationStatus, WorkflowTransitionResponse, PaginatedResponse,
  NOC, LOA, Finance, Rental, Cancellation,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8011/api/v1";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

function qs(params: Record<string, string | number | undefined>): string {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) p.set(k, String(v));
  });
  const s = p.toString();
  return s ? `?${s}` : "";
}

// Users
export const usersApi = {
  list: () => request<User[]>(`/users`),
  get: (id: number) => request<User>(`/users/${id}`),
};

// Dashboard
export const dashboardApi = {
  summary: () => request<DashboardSummary>("/dashboard/summary"),
  recentActivity: (limit = 20) => request<RecentActivityEntry[]>(`/dashboard/recent-activity${qs({ limit })}`),
};

// Generic domain CRUD
function domainApi<T>(module: string) {
  const base = `/${module}`;
  return {
    list: (skip = 0, limit = 20) =>
      request<PaginatedResponse<T>>(`${base}/${qs({ skip, limit })}`),
    get: (id: string) => request<T>(`${base}/${id}`),
    create: (data: Record<string, unknown>, userId: number) =>
      request<T>(`${base}/${qs({ user_id: userId })}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getHistory: (id: string) => request<WorkflowHistoryEntry[]>(`${base}/${id}/history`),
    getStatus: (id: string) => request<ApplicationStatus>(`${base}/${id}/status`),
    getActions: (id: string, userId: number) =>
      request<string[]>(`${base}/${id}/actions${qs({ user_id: userId })}`),
    doAction: (id: string, action: string, userId: number, comment?: string) =>
      request<WorkflowTransitionResponse>(`${base}/${id}/${action.toLowerCase()}${qs({ user_id: userId })}`, {
        method: "POST",
        body: JSON.stringify(comment ? { comment } : {}),
      }),
  };
}

export const nocApi = domainApi<NOC>("noc");
export const loaApi = domainApi<LOA>("loa");
export const financeApi = domainApi<Finance>("finance");
export const rentalApi = domainApi<Rental>("rental");
export const cancellationApi = domainApi<Cancellation>("cancellation");

export function getApi(module: string) {
  const apis: Record<string, ReturnType<typeof domainApi>> = {
    noc: nocApi, loa: loaApi, finance: financeApi,
    rental: rentalApi, cancellation: cancellationApi,
  };
  return apis[module];
}
