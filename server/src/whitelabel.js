import { WHITELABEL } from '../../shared/whitelabel.js';
import { getOrders } from './store.js';
export function whitelabelAvailability() {
  const orders = Object.values(getOrders()).filter(o => o.package === 'whitelabel' && o.whitelabelSlot);
  return { available: WHITELABEL.ready && orders.length < WHITELABEL.slotLimit, totalSlots: WHITELABEL.slotLimit, remainingSlots: Math.max(0, WHITELABEL.slotLimit - orders.length), confirmedSlots: orders.filter(o=>o.status==='paid').length };
}
export function existingWhitelabelOrder(email) {
  return Object.values(getOrders()).find(o=>o.package==='whitelabel' && o.whitelabelSlot && o.status==='pending' && o.payerEmail.toLowerCase()===email.toLowerCase());
}
