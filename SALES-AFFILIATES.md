# Kidora sales and affiliate operations

Public funnel: kidora.com.my -> package selection -> Bayarcash -> payment callback -> access codes on thank-you page -> games.
Affiliate funnel: affiliate.kidora.com.my -> register/login -> personal kidora.com.my/r/<code> link -> main checkout -> confirmed commission.
Admin: admin.kidora.com.my -> access key -> sales, buyers, affiliate performance, CSV exports and manual payout records.

## Prices and attribution
The shared/pricing.js file is the single source of package prices (1990, 2990, 3990 cents). Commission is rounded to the nearest cent, half up: 35% of the sale price minus 100 cents. Expected commissions are 597, 947, 1297 cents. Old orders retain their original amounts. Commission rules are captured when orders are created and credited once, only when payment succeeds.

Referral attribution lasts 30 days, uses the last valid link clicked in the same browser, and is signed with a persistent server key. Repeat clicks within 30 minutes count as one visit. New visitors are anonymous browser identifiers, not verified people. Cookies blocked or cleared, different browsers, and bots affect traffic accuracy. Affiliate dashboards do not expose buyer contact details or access codes.

## Hosting
Route kidora.com.my, www.kidora.com.my, admin.kidora.com.my and affiliate.kidora.com.my to this application on port 5000. Set BASE_URL=https://kidora.com.my. Add proxied A records for admin and affiliate to the VPS in Cloudflare. Admin and affiliate use host-only authentication cookies/storage.

Set ADMIN_KEY privately in Coolify (runtime only). No default key exists. Never put it in the repository or a URL. Affiliate passwords use scrypt; sessions expire after 7 days. Password assistance is through the existing support contact; automated reset email is not configured.

Keep /app/server/data mounted persistently. It contains orders.json, affiliates.json and referral-signing.key. Back up all three together and keep one application process/replica: JSON storage is atomic within a single Node process and is not designed for concurrent replicas. Restrict backup access because account and buyer data are private. Avoid overlapping old/new containers writing data during deployments at scale; migrate to a transactional database before scaling replicas.

## Admin workflow
Filter reports by order-creation date in Malaysia time; totals include successful orders only. Pending and failed orders never earn commission. CSV export follows the active filters. Verify an actual payment before using manual confirmation; this issues codes and credits eligible commission. For commission payments, transfer funds outside the dashboard, then use Rekod pembayaran and enter the transfer reference. This button records a completed transfer; it never sends money. Do not mark a payout until funds were transferred. Refunds/commission reversals require an audited manual reconciliation; no automated refund flow is provided.

## Validation
Run npm ci && npm test in server/. Tests use a temporary data directory and a mocked Bayarcash endpoint, never live purchases. Coverage includes prices, login, signed referral cookies, last-click attribution, duplicate visits, callback authenticity/amount/currency, callback replay, buyer privacy, report filters, more than 200 orders and payout audit idempotency. Docker builds run these tests before producing the application image. Run npm run build and npm run lint at repository root.

A live checkout creation verifies gateway routing, but does not prove a completed bank payment. Complete one user-authorized real purchase and verify the returned access code and affiliate commission before promoting the affiliate program widely.
