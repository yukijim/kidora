export const PRICE_CENTS = Object.freeze({ asas: 1990, lengkap: 2990, keluarga: 3990 });
export const AFFILIATE_PERCENT = 35;
export const AFFILIATE_FEE_CENTS = 100;
// Round half-up in integer sen, then deduct RM1 once per successful order.
export function commissionCents(amountCents) {
  if (!Number.isSafeInteger(amountCents) || amountCents < 0) throw new Error('Invalid amount');
  return Math.max(0, Math.floor((amountCents * AFFILIATE_PERCENT + 50) / 100) - AFFILIATE_FEE_CENTS);
}
export const money = (cents) => `RM ${(Number(cents || 0) / 100).toFixed(2)}`;
