const API_BASE = '/api/v1';

function getUserId() {
  return localStorage.getItem('workflow_user_id') || '1';
}

async function request(path, options = {}) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (!url.searchParams.has('user_id')) {
    url.searchParams.set('user_id', getUserId());
  }
  const res = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Dashboard
  getDashboardSummary: () => request('/dashboard/summary'),
  getRecentActivity: (limit = 20) => request(`/dashboard/recent-activity?limit=${limit}`),

  // Entities
  list: (entity, skip = 0, limit = 20) =>
    request(`/${entity}/?skip=${skip}&limit=${limit}`),
  get: (entity, id) => request(`/${entity}/${id}`),
  create: (entity, data) =>
    request(`/${entity}/`, { method: 'POST', body: JSON.stringify(data) }),

  // Workflow
  getActions: (entity, id) => request(`/${entity}/${id}/actions`),
  getHistory: (entity, id) => request(`/${entity}/${id}/history`),
  getStatus: (entity, id) => request(`/${entity}/${id}/status`),
  doAction: (entity, id, action, comment) =>
    request(`/${entity}/${id}/${action.toLowerCase()}`, {
      method: 'POST',
      body: JSON.stringify(comment ? { comment } : {}),
    }),

  // Users
  listUsers: () => request('/users/?limit=50'),
};

export function setUserId(id) {
  localStorage.setItem('workflow_user_id', id);
}

export { getUserId };
