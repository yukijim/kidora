// ============================================
// KIDORA — API helper (panggilan ke backend)
// ============================================

export async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || 'Ralat tidak dijangka. Sila cuba lagi.');
    error.status = res.status;
    throw error;
  }
  return data;
}
