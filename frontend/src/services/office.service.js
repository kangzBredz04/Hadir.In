import { apiRequest } from './api.js';
import { createQuery, getCollection, getPayloadData, normalizePagination } from './service.utils.js';

function asNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function normalizeOffice(record) {
  return {
    id: record?.id ?? null,
    name: record?.name ?? '-',
    address: record?.address ?? '-',
    latitude: asNumber(record?.latitude),
    longitude: asNumber(record?.longitude),
    radiusMeter: asNumber(record?.radiusMeter ?? record?.radius_meter ?? record?.radiusMeters ?? record?.radius_meters),
    isActive: record?.isActive ?? record?.is_active ?? record?.status !== 'INACTIVE',
    createdAt: record?.createdAt ?? record?.created_at ?? null,
    updatedAt: record?.updatedAt ?? record?.updated_at ?? null,
  };
}

export async function getOffices({ page = 1, limit = 10, search = '', status = '' } = {}) {
  const query = createQuery({ page, limit, search, is_active: status });
  const payload = await apiRequest(`/admin/offices?${query}`);
  const data = getPayloadData(payload);
  const records = getCollection(data, ['items', 'rows', 'offices']);
  return {
    items: records.map(normalizeOffice),
    pagination: normalizePagination(data, { page, limit, total: records.length }),
  };
}

export async function getOfficeById(id) {
  const payload = await apiRequest(`/admin/offices/${id}`);
  const data = getPayloadData(payload);
  return normalizeOffice(data.office ?? data);
}

export function createOffice(input) {
  return apiRequest('/admin/offices', { method: 'POST', body: JSON.stringify(input) });
}

export function updateOffice(id, input) {
  return apiRequest(`/admin/offices/${id}`, { method: 'PUT', body: JSON.stringify(input) });
}

export function deactivateOffice(id) {
  return apiRequest(`/admin/offices/${id}`, { method: 'DELETE' });
}
