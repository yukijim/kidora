const live = typeof window !== 'undefined' && /(^|\.)kidora\.com\.my$/.test(window.location.hostname);
export const portalUrls = {
  home: live ? 'https://kidora.com.my' : '/',
  affiliate: live ? 'https://affiliate.kidora.com.my' : '/affiliate',
  admin: live ? 'https://admin.kidora.com.my' : '/admin-kidora',
};
export const portalHost = typeof window === 'undefined' ? '' : window.location.hostname.split('.')[0];
