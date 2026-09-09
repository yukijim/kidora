import fs from 'node:fs';
import path from 'node:path';

// Single-process persistent outbox. Each transport succeeds/retries independently.
// Transport timeouts must be bounded by the adapter. Do not log provider errors:
// they may include credentials or message contents.
export function createNotificationOutbox({ directory, senders, now = Date.now }) {
  const file = path.join(directory, 'notifications.json');
  let busy = false;
  function read() {
    if (!fs.existsSync(file)) return { version: 1, events: {} };
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (data.version !== 1 || !data.events || typeof data.events !== 'object' || Array.isArray(data.events)) {
      throw new Error('Invalid notification store');
    }
    return data;
  }
  function write(data) {
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(`${file}.tmp`, JSON.stringify(data), { mode: 0o600 });
    fs.renameSync(`${file}.tmp`, file);
  }
  function enqueue(id, { subject, text }) {
    if (!/^[a-z]+:[a-zA-Z0-9_-]+$/.test(id)) throw new Error('Invalid event ID');
    const data = read();
    if (Object.hasOwn(data.events, id)) return false;
    data.events[id] = {
      subject, text, createdAt: now(),
      channels: Object.fromEntries(['email', 'telegram'].map(channel => [channel, { attempts: 0, nextAt: 0, sentAt: null }])),
    };
    write(data);
    return true;
  }
  async function flush() {
    if (busy) return;
    busy = true;
    try {
      // Snapshot IDs only; always re-read before writes so enqueues during I/O survive.
      for (const id of Object.keys(read().events)) {
        for (const channel of ['email', 'telegram']) {
          const event = read().events[id];
          const state = event.channels[channel];
          if (state.sentAt !== null || state.nextAt > now() || !senders[channel]) continue;
          let success = false;
          try {
            await senders[channel]({ id, subject: event.subject, text: event.text });
            success = true;
          } catch { /* Retry without persisting provider error text. */ }
          const latest = read();
          const delivery = latest.events[id].channels[channel];
          delivery.attempts += 1;
          if (success) delivery.sentAt = now();
          else delivery.nextAt = now() + Math.min(3600000, 30000 * 2 ** Math.min(delivery.attempts - 1, 7));
          write(latest);
        }
      }
    } finally { busy = false; }
  }
  function status() {
    const events = Object.values(read().events);
    return Object.fromEntries(['email', 'telegram'].map(channel => [channel, {
      configured: Boolean(senders[channel]),
      sent: events.filter(event => event.channels[channel].sentAt !== null).length,
      pending: events.filter(event => event.channels[channel].sentAt === null).length,
    }]));
  }
  return { enqueue, flush, status };
}

const line = value => String(value ?? '').replace(/[\r\n\u0000-\u001f]/g, ' ').slice(0, 120);
export function purchaseNotification(order) {
  if (order.status !== 'paid') return null;
  return {
    subject: 'KIDORA — Pembayaran berjaya',
    text: [
      'Pembayaran berjaya', `Pesanan: ${line(order.orderId)}`,
      `Pakej: ${line(order.package)}`, `Jumlah: RM${Number(order.amount).toFixed(2)}`,
      order.manuallyConfirmedAt || order.manual ? 'Disahkan secara manual oleh admin.' : 'Bayaran disahkan melalui gateway.',
      'Semak butiran: https://admin.kidora.com.my',
    ].join('\n'),
  };
}
export function affiliateNotification(account) {
  return {
    subject: 'KIDORA — Affiliate baharu',
    text: ['Pendaftaran affiliate baharu', `Nama: ${line(account.name)}`, `ID: ${line(account.id)}`,
      'Semak butiran: https://admin.kidora.com.my'].join('\n'),
  };
}

