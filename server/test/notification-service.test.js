import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createCollector, createSenders } from '../src/notification-service.js';
import { createNotificationOutbox } from '../src/notification-outbox.js';

test('baseline excludes historical events but captures later payments, signups and downtime', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'kidora-collector-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const orders = { old: { orderId: 'old', status: 'paid' }, pending: { orderId: 'pending', status: 'pending', amount: 19.9, package: 'asas' } };
  const accounts = { old: { id: 'old' } };
  const outbox = createNotificationOutbox({ directory, senders: {} });
  const options = { directory, getOrders: () => orders, getAccounts: () => accounts, outbox };
  const collect = createCollector(options);
  collect(); assert.equal(outbox.status().email.pending, 0);
  orders.pending.status = 'paid'; accounts.new = { id: 'new', name: 'New' };
  collect(); collect(); assert.equal(outbox.status().email.pending, 2);
  orders.white = { orderId: 'white', status: 'paid', package: 'whitelabel', amount: 897 };
  createCollector(options)(); assert.equal(outbox.status().email.pending, 3);
});

test('SMTP is TLS-only with stable message ID, and Telegram rejects unsuccessful API results', async () => {
  let config, message, telegramRequest;
  const env = { SMTP_HOST: 'smtp.gmail.com', SMTP_PORT: '465', SMTP_USER: 'test@example.com', SMTP_PASS: 'fake', SMTP_FROM: 'test@example.com', NOTIFICATION_EMAIL_TO: 'test@example.com', TELEGRAM_BOT_TOKEN: 'fake', TELEGRAM_CHAT_ID: '123' };
  const senders = await createSenders(env, {
    createTransport: options => { config = options; return { sendMail: async value => { message = value; return { accepted: ['test@example.com'], rejected: [] }; } }; },
    fetcher: async (url, options) => { telegramRequest = { url, options }; return { ok: true, json: async () => ({ ok: false }) }; },
  });
  await senders.email({ id: 'paid:one', subject: 'Paid', text: 'Test' });
  assert.equal(config.secure, true); assert.equal(config.requireTLS, true); assert.equal(config.logger, false);
  assert.match(message.messageId, /^<[a-f0-9]{64}@kidora.com.my>$/);
  await assert.rejects(senders.telegram({ text: '<raw>&text' }));
  assert.equal(JSON.parse(telegramRequest.options.body).text, '<raw>&text');
  assert.equal(telegramRequest.options.redirect, 'error');
  assert.deepEqual(await createSenders({}), {});
  await assert.rejects(createSenders({ ...env, SMTP_PORT: '25' }, { createTransport: () => {} }));
});

