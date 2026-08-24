import { apiRequest } from './api.js';
import { createQuery, getCollection, getPayloadData, normalizePagination } from './service.utils.js';

export function normalizeUser(record) {
  return {
    id: record?.id ?? null,
    employeeId: record?.employeeId ?? record?.employee_id ?? '-',
    name: record?.name ?? record?.fullName ?? record?.full_name ?? '-',
    email: record?.email ?? '-',
    role: String(record?.role ?? 'EMPLOYEE').toUpperCase(),
    officeId: record?.officeId ?? record?.office_id ?? record?.office?.id ?? '',
    office: record?.office ?? null,
    isActive: record?.isActive ?? record?.is_active ?? record?.status !== 'INACTIVE',
    createdAt: record?.createdAt ?? record?.created_at ?? null,
    updatedAt: record?.updatedAt ?? record?.updated_at ?? null,
  };
}

export async function getUsers({ page = 1, limit = 10, search = '', role = '', officeId = '', status = '' } = {}) {
  const query = createQuery({ page, limit, search, role, office_id: officeId, is_active: status });
  const payload = await apiRequest(`/admin/users?${query}`);
  const data = getPayloadData(payload);
  const records = getCollection(data, ['items', 'rows', 'users']);
  return {
    items: records.map(normalizeUser),
    pagination: normalizePagination(data, { page, limit, total: records.length }),
  };
}

export async function getUserById(id) {
  const payload = await apiRequest(`/admin/users/${id}`);
  const data = getPayloadData(payload);
  return normalizeUser(data.user ?? data);
}

export function createUser(input) {
  return apiRequest('/admin/users', { method: 'POST', body: JSON.stringify(input) });
}

export function updateUser(id, input) {
  return apiRequest(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(input) });
}

export function deactivateUser(id) {
  return apiRequest(`/admin/users/${id}`, { method: 'DELETE' });
}
