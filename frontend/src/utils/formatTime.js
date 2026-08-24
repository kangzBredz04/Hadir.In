export function formatTime(value, fallback = '--:--') {
  if (!value) return fallback;

  if (/^\d{2}:\d{2}/.test(String(value))) {
    return String(value).slice(0, 5);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  }).format(date);
}
