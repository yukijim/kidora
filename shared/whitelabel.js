export const WHITELABEL = Object.freeze({
  originalCents: 299000,
  priceCents: 89700,
  discountPercent: 70,
  ready: true,
  slotLimit: 10,
  renewalCents: 89700,
  guaranteeDays: 30,
  termsVersion: 'whitelabel-2026-09-v1',
});
export function salesProjection(priceCents, sales, costPerSaleCents = 0, fixedCostsCents = 0) {
  const contribution = priceCents - costPerSaleCents;
  const revenueCents = priceCents * sales;
  return {
    revenueCents,
    costsCents: WHITELABEL.priceCents + fixedCostsCents + costPerSaleCents * sales,
    balanceCents: revenueCents - WHITELABEL.priceCents - fixedCostsCents - costPerSaleCents * sales,
    breakEven: contribution > 0 ? Math.ceil((WHITELABEL.priceCents + fixedCostsCents) / contribution) : null,
  };
}
