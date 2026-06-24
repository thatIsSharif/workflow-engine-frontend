import type {
  User,
  UserCreate,
  NOC,
  NOCCreate,
  LOA,
  LOACreate,
  Finance,
  FinanceCreate,
  Rental,
  RentalCreate,
  Cancellation,
  CancellationCreate,
  WorkflowHistoryEntry,
  ApplicationStatus,
  WorkflowTransitionResponse,
  EntityType,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

// Users
export const usersApi = {
  list: () => request<User[]>("/api/v1/users/"),
  get: (id: number) => request<User>(`/api/v1/users/${id}`),
  create: (data: UserCreate) =>
    request<User>("/api/v1/users/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Generic API factory for domain entities
function createEntityApi<T, TCreate>(endpoint: string) {
  return {
    list: (userId: number) =>
      request<T[]>(`${endpoint}/?user_id=${userId}`),
    get: (id: string, userId: number) =>
      request<T>(`${endpoint}/${id}?user_id=${userId}`),
    create: (data: TCreate, userId: number) =>
      request<T>(`${endpoint}/?user_id=${userId}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    history: (id: string, userId: number) =>
      request<WorkflowHistoryEntry[]>(`${endpoint}/${id}/history?user_id=${userId}`),
    status: (id: string, userId: number) =>
      request<ApplicationStatus>(`${endpoint}/${id}/status?user_id=${userId}`),
    action: (id: string, action: string, userId: number, comment?: string) =>
      request<WorkflowTransitionResponse>(`${endpoint}/${id}/${action}?user_id=${userId}`, {
        method: "POST",
        body: comment ? JSON.stringify({ comment }) : undefined,
      }),
  };
}

export const nocApi = createEntityApi<NOC, NOCCreate>("/api/v1/noc");
export const loaApi = createEntityApi<LOA, LOACreate>("/api/v1/loa");
export const financeApi = createEntityApi<Finance, FinanceCreate>("/api/v1/finance");
export const rentalApi = createEntityApi<Rental, RentalCreate>("/api/v1/rental");
export const cancellationApi = createEntityApi<Cancellation, CancellationCreate>("/api/v1/cancellation");

export function getApiForEntity(entity: EntityType) {
  switch (entity) {
    case "NOC": return nocApi;
    case "LOA": return loaApi;
    case "FINANCE": return financeApi;
    case "RENTAL": return rentalApi;
    case "CANCELLATION": return cancellationApi;
  }
}

export const healthApi = {
  check: () => request<{ status: string }>("/health"),
};
