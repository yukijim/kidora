// ============================================
// KIDORA — Klien Bayarcash Payment Gateway API v3
// Docs: https://docs.bayarcash.com/  (SDK rujukan: webimpian/bayarcash-php-sdk)
// ============================================
import crypto from 'node:crypto';

const BASE_URL_SANDBOX = 'https://api.console.bayarcash-sandbox.com/v3/';
const BASE_URL_PRODUCTION = 'https://api.console.bayar.cash/v3/';

function baseUrl(sandbox) {
  return sandbox ? BASE_URL_SANDBOX : BASE_URL_PRODUCTION;
}

function sortedPipeString(payload) {
  const keys = Object.keys(payload).sort();
  return keys.map((k) => payload[k]).join('|');
}

/** Checksum untuk create payment intent — ikut ChecksumGenerator::createPaymentIntentChecksumValue */
export function createPaymentIntentChecksum(secretKey, data) {
  let paymentChannel = data.payment_channel ?? [];
  if (!Array.isArray(paymentChannel)) paymentChannel = [paymentChannel];
  const payload = {
    payment_channel: paymentChannel.join(','),
    order_number: data.order_number,
    amount: data.amount,
    payer_name: data.payer_name,
    payer_email: data.payer_email,
  };
  return crypto.createHmac('sha256', secretKey).update(sortedPipeString(payload)).digest('hex');
}

/** Sahkan checksum callback transaksi (server-to-server) — ikut CallbackVerifications::verifyTransactionCallbackData */
export function verifyTransactionCallbackData(callbackData, secretKey) {
  const payload = {
    record_type: callbackData.record_type,
    transaction_id: callbackData.transaction_id,
    exchange_reference_number: callbackData.exchange_reference_number,
    exchange_transaction_id: callbackData.exchange_transaction_id,
    order_number: callbackData.order_number,
    currency: callbackData.currency,
    amount: callbackData.amount,
    payer_name: callbackData.payer_name,
    payer_email: callbackData.payer_email,
    payer_bank_name: callbackData.payer_bank_name,
    status: callbackData.status,
    status_description: callbackData.status_description,
    datetime: callbackData.datetime,
  };
  const expected = crypto.createHmac('sha256', secretKey).update(sortedPipeString(payload)).digest('hex');
  return expected === callbackData.checksum;
}

/** Sahkan checksum return URL (redirect browser, GET) — ikut CallbackVerifications::verifyReturnUrlCallbackData */
export function verifyReturnUrlCallbackData(callbackData, secretKey) {
  const payload = {
    transaction_id: callbackData.transaction_id,
    exchange_reference_number: callbackData.exchange_reference_number,
    exchange_transaction_id: callbackData.exchange_transaction_id,
    order_number: callbackData.order_number,
    currency: callbackData.currency,
    amount: callbackData.amount,
    payer_bank_name: callbackData.payer_bank_name,
    status: callbackData.status,
    status_description: callbackData.status_description,
  };
  const expected = crypto.createHmac('sha256', secretKey).update(sortedPipeString(payload)).digest('hex');
  return expected === callbackData.checksum;
}

/**
 * Cipta payment intent → dapat URL checkout Bayarcash untuk redirect pembayar.
 * @param {object} opts
 * @param {string} opts.token          Personal Access Token (Bearer)
 * @param {string} opts.secretKey      API Secret Key (untuk checksum)
 * @param {string} opts.portalKey      Portal Key dari console Bayarcash
 * @param {boolean} opts.sandbox       true = guna sandbox environment
 * @param {string} opts.orderNumber    Rujukan pesanan kami (order_number)
 * @param {string|number} opts.amount  Jumlah dalam RM, cth "9.90"
 * @param {string} opts.payerName
 * @param {string} opts.payerEmail
 * @param {string} [opts.payerPhone]
 * @param {string} [opts.callbackUrl]  Server-to-server (POST)
 * @param {string} [opts.returnUrl]    Redirect browser (GET)
 * @param {number[]} [opts.paymentChannels] Default: FPX dan DuitNow QR (saluran aktif portal Kidora)
 */
export async function createPaymentIntent({
  token,
  secretKey,
  portalKey,
  sandbox,
  orderNumber,
  amount,
  payerName,
  payerEmail,
  payerPhone,
  callbackUrl,
  returnUrl,
  paymentChannels = [1, 6],
}) {
  const data = {
    payment_channel: paymentChannels,
    portal_key: portalKey,
    order_number: orderNumber,
    amount: String(amount),
    payer_name: payerName,
    payer_email: payerEmail,
  };
  if (payerPhone) data.payer_telephone_number = payerPhone;
  if (callbackUrl) data.callback_url = callbackUrl;
  if (returnUrl) data.return_url = returnUrl;
  data.checksum = createPaymentIntentChecksum(secretKey, data);

  const res = await fetch(`${baseUrl(sandbox)}payment-intents`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.message || (body?.errors && JSON.stringify(body.errors)) || `Bayarcash HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body; // { id, url, order_number, amount, ... }
}

