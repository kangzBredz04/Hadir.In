import { apiRequest } from './api.js';

function normalizeRole(role) {
  return String(role || '').toUpperCase();
}

function normalizeUser(user) {
  return {
    id: user?.id ?? null,
    employeeId: user?.employeeId ?? user?.employee_id ?? null,
    name: user?.name ?? '',
    email: user?.email ?? '',
    role: String(user?.role ?? '').toUpperCase(),
    office: user?.office ?? null,
    isActive: user?.isActive ?? user?.is_active ?? true,
  };
}

let currentUserRequest = null;

function getResponseData(payload) {
  return payload?.data ?? payload ?? {};
}

export async function login(credentials) {
  const payload = await apiRequest('/auth/login', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(credentials),
  });
  const data = getResponseData(payload);

  return {
    token: data.token ?? data.accessToken ?? data.access_token,
    user: normalizeUser(data.user ?? data.profile),
  };
}

export async function getCurrentUser() {
  if (currentUserRequest) {
    return currentUserRequest;
  }

  currentUserRequest = apiRequest('/users/me')
    .then((payload) => {
      const data = getResponseData(payload);

      return normalizeUser(
        data.user ??
        data.profile ??
        data,
      );
    })
    .finally(() => {
      currentUserRequest = null;
    });

  return currentUserRequest;
}