// ============================================
// KIDORA — API helper (panggilan ke backend)
// ============================================

export async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Ralat tidak dijangka. Sila cuba lagi.');
  }
  return data;
}
