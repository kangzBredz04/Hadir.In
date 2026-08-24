import { apiRequest } from './api.js';

function normalizeRole(role) {
  return String(role || '').toUpperCase();
}

function normalizeUser(user) {
  if (!user) return null;

  return {
    ...user,
    role: normalizeRole(user.role),
  };
}

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
  const payload = await apiRequest('/auth/me');
  const data = getResponseData(payload);
  return normalizeUser(data.user ?? data.profile ?? data);
}
