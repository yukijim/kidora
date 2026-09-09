# Admin notifications

Set runtime-only NOTIFICATIONS_ENABLED=true, NOTIFICATION_EMAIL_TO, SMTP_HOST, SMTP_PORT (465 or 587), SMTP_USER, SMTP_PASS, SMTP_FROM, TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID. Gmail uses an App Password, not the normal account password. Tokens never go in VITE_ variables or build arguments. Telegram's chat ID identifies the recipient; the bot username alone does not.

The application scans persisted successful payments (including whitelabel and manual confirmations) and affiliate accounts every 15 seconds. It does not send messages to buyers or affiliates. Messages link to the protected admin dashboard and omit passwords, access codes, buyer email and phone. Failed/unfinished payments do not notify.

First activation snapshots existing paid order IDs and affiliate IDs into notification-baseline.json. Those historical events are not sent. Existing pending orders that become paid later do notify. Future events are stored in notifications.json, each with independent email/Telegram delivery status. Include BOTH files in the same backup as orders.json and affiliates.json. Do not delete/reset the baseline or ledger when restarting, migrating or redeploying. Source re-scanning recovers events missed between source and outbox writes, including downtime after first activation.

Delivery retries from 30 seconds up to one hour indefinitely. Missing channels retain pending delivery. SMTP acceptance is not proof of inbox placement. A provider can accept a message before a crash prevents recording success, causing a duplicate on retry; exactly-once delivery is not guaranteed. Stable email Message-ID assists diagnosis, not guaranteed deduplication. There is no Telegram inbound-message handler; Start need not reply.

GET /api/admin/notifications uses the existing x-admin-key authentication and exposes only enabled/healthy and per-channel configured/sent/pending counts. Initialization failure is reported here and logged without secrets; sales processing continues. Fix configuration/storage and restart after initialization failure.

Single application process/replica only. Do not run concurrent workers sharing the JSON directory. Schedule enough exclusive restart time for an in-flight SMTP/Telegram request to end when deploying a future notification-enabled version. At scale, replace the JSON ledger with a transactional outbox and worker locks. Sent events are retained to preserve deduplication; review storage growth as the business expands.

Tests: node --test server/test/notification-outbox.test.js server/test/notification-service.test.js, plus the full server npm test suite and Docker build. Tests use fake senders and temporary directories, never production orders or real payments.

