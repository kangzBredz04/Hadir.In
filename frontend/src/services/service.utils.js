export function getPayloadData(payload) {
  return payload?.data ?? payload ?? {};
}

export function getCollection(data, keys = []) {
  if (Array.isArray(data)) return data;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
}

export function normalizePagination(data, fallback = {}) {
  const pagination = data?.pagination ?? data?.meta ?? {};
  const page = Number(pagination.page ?? pagination.currentPage ?? fallback.page ?? 1);
  const limit = Number(pagination.limit ?? pagination.pageSize ?? fallback.limit ?? 10);
  const total = Number(pagination.total ?? pagination.totalItems ?? fallback.total ?? 0);
  const calculatedPages = limit > 0 ? Math.ceil(total / limit) : 1;
  const totalPages = Number(
    pagination.totalPages ?? pagination.total_pages ?? pagination.lastPage ?? calculatedPages,
  );

  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Number.isFinite(totalPages) ? totalPages : 1),
  };
}

export function createQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) query.set(key, String(value));
  });
  return query.toString();
}
