import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createNotificationOutbox, purchaseNotification, affiliateNotification } from './notification-outbox.js';

export function createCollector({ directory, getOrders, getAccounts, outbox }) {
  const baselineFile = path.join(directory, 'notification-baseline.json');
  // Exclude only events already completed at first activation. An existing pending
  // order becoming paid later must still notify. Persist baseline across restarts.
  if (!fs.existsSync(baselineFile)) {
    const ids = [
      ...Object.values(getOrders()).filter(o => o.status === 'paid').map(o => `paid:${o.orderId}`),
      ...Object.values(getAccounts()).map(a => `affiliate:${a.id}`),
    ];
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(`${baselineFile}.tmp`, JSON.stringify(ids), { mode: 0o600 });
    fs.renameSync(`${baselineFile}.tmp`, baselineFile);
  }
  const existing = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));
  if (!Array.isArray(existing) || existing.some(id => typeof id !== 'string')) throw new Error('Invalid notification baseline');
  const skipped = new Set(existing);
  return () => {
    for (const order of Object.values(getOrders())) {
      const id = `paid:${order.orderId}`;
      if (order.status === 'paid' && !skipped.has(id)) outbox.enqueue(id, purchaseNotification(order));
    }
    for (const account of Object.values(getAccounts())) {
      const id = `affiliate:${account.id}`;
      if (!skipped.has(id)) outbox.enqueue(id, affiliateNotification(account));
    }
  };
}

export async function createSenders(env = process.env, { fetcher = fetch, createTransport } = {}) {
  const senders = {};
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.NOTIFICATION_EMAIL_TO && env.SMTP_FROM) {
    createTransport ||= (await import('nodemailer')).default.createTransport;
    const port = Number(env.SMTP_PORT || 465);
    if (![465, 587].includes(port)) throw new Error('Use TLS SMTP port 465 or 587');
    const transport = createTransport({
      host: env.SMTP_HOST, port, secure: port === 465, requireTLS: true,
      auth: { user: env.SMTP_USER, pass: env.SMTP_HOST === 'smtp.gmail.com' ? env.SMTP_PASS.replace(/\s/g, '') : env.SMTP_PASS },
      connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000,
      logger: false, debug: false, disableFileAccess: true, disableUrlAccess: true,
    });
    senders.email = async ({ id, subject, text }) => {
      const result = await transport.sendMail({
        from: env.SMTP_FROM, to: env.NOTIFICATION_EMAIL_TO, subject, text,
        messageId: `<${crypto.createHash('sha256').update(id).digest('hex')}@kidora.com.my>`,
      });
      if (!result.accepted?.length || result.rejected?.length) throw new Error('Email not accepted');
    };
  }
  if (env.TELEGRAM_BOT_TOKEN && /^-?\d+$/.test(env.TELEGRAM_CHAT_ID || '')) {
    senders.telegram = async ({ text }) => {
      const response = await fetcher(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN.trim()}/sendMessage`, {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, link_preview_options: { is_disabled: true } }),
      });
      const body = await response.json();
      if (!response.ok || body.ok !== true) throw new Error('Telegram not accepted');
    };
  }
  return senders;
}

export async function startNotifications({ directory, getOrders, getAccounts, env = process.env }) {
  if (env.NOTIFICATIONS_ENABLED !== 'true') return { status: () => ({ enabled: false }) };
  const senders = await createSenders(env);
  const outbox = createNotificationOutbox({ directory, senders });
  const collect = createCollector({ directory, getOrders, getAccounts, outbox });
  let busy = false, healthy = true;
  async function tick() {
    if (busy) return;
    busy = true;
    try { collect(); await outbox.flush(); healthy = true; }
    catch { healthy = false; console.error('[notifications] Storage or collection failed; retrying.'); }
    finally { busy = false; }
  }
  // Delivery does not block registration or payment processing. Source records
  // are scanned again after failures, closing the source/outbox dual-write gap.
  const timer = setInterval(tick, 15000);
  timer.unref();
  void tick();
  return { status: () => ({ enabled: true, healthy, channels: outbox.status() }), stop: () => clearInterval(timer) };
}

