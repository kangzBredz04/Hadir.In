import { apiRequest } from './api.js';
import { createQuery, getCollection, getPayloadData, normalizePagination } from './service.utils.js';

function getData(payload) {
  return payload?.data ?? payload ?? null;
}

function asNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function normalizeTodayAttendance(payload) {
  const data = getData(payload);
  const attendance = data?.attendance ?? data?.record ?? data;

  if (!attendance || Array.isArray(attendance)) {
    return {
      id: null,
      status: 'BELUM_ABSEN',
      checkIn: null,
      checkOut: null,
      distance: null,
      allowedRadius: asNumber(data?.allowedRadius ?? data?.allowed_radius),
      isWithinRadius: null,
      office: data?.office ?? null,
    };
  }

  const distance = asNumber(
    attendance.distanceIn ??
      attendance.distance_in ??
      attendance.distance ??
      data?.distance,
  );
  const allowedRadius = asNumber(
    attendance.allowedRadius ??
      attendance.allowed_radius ??
      attendance.office?.radiusMeters ??
      attendance.office?.radius_meters ??
      data?.allowedRadius ??
      data?.allowed_radius,
  );

  return {
    id: attendance.id ?? null,
    status: attendance.status ?? attendance.attendanceStatus ?? attendance.attendance_status ?? 'BELUM_ABSEN',
    checkIn: attendance.checkIn ?? attendance.check_in ?? attendance.clockIn ?? attendance.clock_in ?? null,
    checkOut: attendance.checkOut ?? attendance.check_out ?? attendance.clockOut ?? attendance.clock_out ?? null,
    distance,
    allowedRadius,
    isWithinRadius:
      attendance.isWithinRadius ??
      attendance.is_within_radius ??
      (distance !== null && allowedRadius !== null ? distance <= allowedRadius : null),
    office: attendance.office ?? data?.office ?? null,
  };
}

export async function getTodayAttendance() {
  const payload = await apiRequest('/attendance/today');
  return normalizeTodayAttendance(payload);
}

function createAttendanceForm({ photo, latitude, longitude }) {
  const formData = new FormData();
  formData.append('photo', photo);
  formData.append('latitude', String(latitude));
  formData.append('longitude', String(longitude));
  return formData;
}

async function submitAttendance(endpoint, input) {
  const payload = await apiRequest(endpoint, {
    method: 'POST',
    body: createAttendanceForm(input),
  });

  return {
    message: payload?.message ?? 'Absensi berhasil dicatat.',
    data: payload?.data ?? null,
    payload,
  };
}

export function checkIn(input) {
  return submitAttendance('/attendance/check-in', input);
}

export function checkOut(input) {
  return submitAttendance('/attendance/check-out', input);
}

function normalizePhoto(photo) {
  return {
    id: photo?.id ?? null,
    type: String(photo?.type ?? photo?.photoType ?? photo?.photo_type ?? '').toUpperCase(),
    url: photo?.photoUrl ?? photo?.photo_url ?? photo?.signedUrl ?? photo?.signed_url ?? photo?.url ?? null,
    createdAt: photo?.createdAt ?? photo?.created_at ?? null,
  };
}

export function normalizeAttendanceRecord(record) {
  const photos = Array.isArray(record?.photos) ? record.photos.map(normalizePhoto) : [];
  const checkInPhoto = photos.find((photo) => photo.type.includes('CHECK_IN') || photo.type === 'IN');
  const checkOutPhoto = photos.find((photo) => photo.type.includes('CHECK_OUT') || photo.type === 'OUT');

  return {
    id: record?.id ?? null,
    userId: record?.userId ?? record?.user_id ?? null,
    officeId: record?.officeId ?? record?.office_id ?? null,
    date: record?.attendanceDate ?? record?.attendance_date ?? record?.date ?? null,
    status: record?.status ?? 'PRESENT',
    checkInTime: record?.checkInTime ?? record?.check_in_time ?? record?.checkIn ?? record?.check_in ?? null,
    checkOutTime: record?.checkOutTime ?? record?.check_out_time ?? record?.checkOut ?? record?.check_out ?? null,
    checkInLatitude: asNumber(record?.checkInLatitude ?? record?.check_in_latitude),
    checkInLongitude: asNumber(record?.checkInLongitude ?? record?.check_in_longitude),
    checkInDistance: asNumber(record?.checkInDistance ?? record?.check_in_distance),
    checkOutLatitude: asNumber(record?.checkOutLatitude ?? record?.check_out_latitude),
    checkOutLongitude: asNumber(record?.checkOutLongitude ?? record?.check_out_longitude),
    checkOutDistance: asNumber(record?.checkOutDistance ?? record?.check_out_distance),
    checkInPhotoUrl:
      record?.checkInPhotoUrl ?? record?.check_in_photo_url ?? checkInPhoto?.url ?? null,
    checkOutPhotoUrl:
      record?.checkOutPhotoUrl ?? record?.check_out_photo_url ?? checkOutPhoto?.url ?? null,
    office: record?.office ?? null,
    photos,
  };
}

export async function getAttendanceHistory({
  page = 1,
  limit = 10,
  startDate = '',
  endDate = '',
} = {}) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (startDate) query.set('start_date', startDate);
  if (endDate) query.set('end_date', endDate);

  const payload = await apiRequest(`/attendance/history?${query.toString()}`);
  const data = payload?.data ?? {};
  const rawItems = data.items ?? data.rows ?? data.attendances ?? [];
  const pagination = data.pagination ?? {};

  return {
    items: Array.isArray(rawItems) ? rawItems.map(normalizeAttendanceRecord) : [],
    pagination: {
      page: Number(pagination.page ?? page),
      limit: Number(pagination.limit ?? limit),
      total: Number(pagination.total ?? rawItems.length ?? 0),
      totalPages: Math.max(1, Number(pagination.totalPages ?? pagination.total_pages ?? 1)),
    },
  };
}

function normalizeAdminAttendance(record) {
  const attendance = normalizeAttendanceRecord(record);
  const user = record?.user ?? record?.employee ?? null;
  return {
    ...attendance,
    user: user ? {
      id: user.id ?? attendance.userId,
      employeeId: user.employeeId ?? user.employee_id ?? '-',
      name: user.name ?? user.fullName ?? user.full_name ?? '-',
      email: user.email ?? '-',
    } : null,
  };
}

export async function getAdminAttendance({ page = 1, limit = 10, startDate = '', endDate = '', userId = '', officeId = '', status = '' } = {}) {
  const query = createQuery({ page, limit, start_date: startDate, end_date: endDate, user_id: userId, office_id: officeId, status });
  const payload = await apiRequest(`/admin/attendance?${query}`);
  const data = getPayloadData(payload);
  const records = getCollection(data, ['items', 'rows', 'attendances']);
  return {
    items: records.map(normalizeAdminAttendance),
    pagination: normalizePagination(data, { page, limit, total: records.length }),
  };
}

export async function getAdminAttendanceDetail(id) {
  const payload = await apiRequest(`/admin/attendance/${id}`);
  const data = getPayloadData(payload);
  return normalizeAdminAttendance(data.attendance ?? data);
}

export async function getAdminAttendanceSummary() {
  const payload = await apiRequest('/admin/attendance/summary');
  const data = getPayloadData(payload);
  const summary = data.summary ?? data;
  return {
    totalEmployee: Number(summary.totalEmployee ?? summary.total_employee ?? summary.totalEmployees ?? 0),
    present: Number(summary.present ?? summary.hadir ?? summary.presentToday ?? summary.present_today ?? 0),
    late: Number(summary.late ?? summary.terlambat ?? summary.lateToday ?? summary.late_today ?? 0),
    notCheckedIn: Number(summary.notCheckedIn ?? summary.not_checked_in ?? summary.absent ?? summary.belumAbsen ?? summary.belum_absen ?? 0),
  };
}
