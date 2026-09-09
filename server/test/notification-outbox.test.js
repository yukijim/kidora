import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createNotificationOutbox, purchaseNotification, affiliateNotification } from '../src/notification-outbox.js';

test('deduplicates events, retries channels independently and survives restart', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'kidora-notify-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  let time = 1000, email = 0, telegram = 0;
  const senders = { email: async () => { email++; }, telegram: async () => { telegram++; throw new Error('secret-token'); } };
  const box = createNotificationOutbox({ directory, senders, now: () => time });
  assert.equal(box.enqueue('paid:order1', { subject: 'Test', text: 'Test' }), true);
  assert.equal(box.enqueue('paid:order1', { subject: 'Replay', text: 'Replay' }), false);
  await Promise.all([box.flush(), box.flush()]);
  assert.deepEqual([email, telegram], [1, 1]);
  await box.flush();
  assert.deepEqual([email, telegram], [1, 1]);
  assert.equal(fs.readFileSync(path.join(directory, 'notifications.json'), 'utf8').includes('secret-token'), false);
  time += 30000;
  const restarted = createNotificationOutbox({ directory, senders: { ...senders, telegram: async () => { telegram++; } }, now: () => time });
  await restarted.flush();
  assert.deepEqual([email, telegram], [1, 2]);
  assert.equal(restarted.status().telegram.pending, 0);
});

test('preserves new events added during delivery and queues unconfigured channels', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'kidora-notify-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const box = createNotificationOutbox({ directory, senders: { email: async () => {
    box.enqueue('affiliate:two', { subject: 'Second', text: 'Second' });
  } } });
  box.enqueue('paid:one', { subject: 'First', text: 'First' });
  await box.flush();
  assert.equal(box.status().email.pending, 1);
  assert.equal(box.status().telegram.pending, 2);
  await box.flush();
  assert.equal(box.status().email.sent, 2);
});

test('corrupt store fails closed and messages omit access codes and passwords', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'kidora-notify-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  fs.writeFileSync(path.join(directory, 'notifications.json'), '{broken');
  const box = createNotificationOutbox({ directory, senders: {} });
  assert.throws(() => box.enqueue('paid:one', { subject: 'Test', text: 'Test' }));
  assert.equal(purchaseNotification({ status: 'pending' }), null);
  const message = purchaseNotification({ status: 'paid', orderId: 'one', package: 'whitelabel', amount: 897, codes: ['SECRET'] });
  assert.match(message.text, /RM897.00/);
  assert.equal(message.text.includes('SECRET'), false);
  assert.equal(affiliateNotification({ id: 'id', name: 'Name', passwordHash: 'SECRET' }).text.includes('SECRET'), false);
});

