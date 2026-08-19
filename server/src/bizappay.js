// ============================================
// BizApp Pay V3 API client
// Docs: https://documenter.getpostman.com/view/6258355/SzmZdLp3
// ============================================

const BASE = process.env.BIZAPPAY_BASE_URL || 'https://bizappay.my';

async function postForm(path, fields, token) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === '') continue;
    fd.append(key, String(value));
  }
  const headers = {};
  if (token) headers.Authentication = token;
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: fd });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { status: 'error', msg: text.slice(0, 200) };
  }
}

/** Dapatkan token untuk setiap panggilan API. */
export async function generateToken(apiKey) {
  const data = await postForm('/api/v3/token', { apiKey });
  if (data.status !== 'ok') throw new Error(data.msg || 'Gagal jana token BizApp Pay');
  return data.token;
}

/** Senarai kategori bil akaun. */
export async function listCategories(apiKey, token) {
  const data = await postForm('/api/v3/category', { apiKey }, token);
  return (data.categories || []).map((c) => ({ code: c.code, name: c.name }));
}

/**
 * Cipta bil (payment link) BizApp Pay.
 * @returns {{ status: string, msg?: string, billCode?: string, url?: string }}
 */
export async function createBill({
  apiKey,
  token,
  category,
  name,
  amount,
  payerName,
  payerEmail,
  payerPhone,
  callbackUrl,
  returnUrl,
  extReference,
}) {
  return postForm(
    '/api/v3/bill/create',
    {
      apiKey,
      category,
      name,
      amount,
      payer_name: payerName,
      payer_email: payerEmail,
      payer_phone: payerPhone,
      webreturn_url: returnUrl,
      callback_url: callbackUrl,
      ext_reference: extReference,
    },
    token,
  );
}
