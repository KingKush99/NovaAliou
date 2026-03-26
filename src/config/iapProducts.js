import { Capacitor } from '@capacitor/core';

// Map in-app store items to the underlying App Store / Play product identifiers.
// These identifiers must match what you create in App Store Connect and Google Play Console,
// and what you configure in RevenueCat.
//
// Recommendation: keep the same product IDs on iOS + Android when possible.
export const IAP_PRODUCT_IDS = {
  // Coins
  'coins:coins-1': 'com.noveltycams.coins_1000',
  'coins:coins-2': 'com.noveltycams.coins_2100',
  'coins:coins-3': 'com.noveltycams.coins_5600',
  'coins:coins-4': 'com.noveltycams.coins_11700',
  'coins:coins-5': 'com.noveltycams.coins_24500',
  'coins:coins-6': 'com.noveltycams.coins_38700',
  'coins:coins-7': 'com.noveltycams.coins_60200',
  'coins:coins-8': 'com.noveltycams.coins_71100',
  'coins:coins-9': 'com.noveltycams.coins_104500',
  'coins:coins-10': 'com.noveltycams.coins_156700',
  'coins:coins-11': 'com.noveltycams.coins_213900',

  // VIP subscriptions (monthly tiers)
  'sub:vip-gold-monthly': 'com.noveltycams.vip_monthly',
  'sub:vip-diamond-monthly': 'com.noveltycams.vip_diamond_monthly',
  'sub:vip-platinum-monthly': 'com.noveltycams.vip_platinum_monthly',

  // Diamonds (optional: if diamonds are also a paid currency)
  'diamonds:diamonds-100': 'com.noveltycams.diamonds_100',
  'diamonds:diamonds-500': 'com.noveltycams.diamonds_500',
  'diamonds:diamonds-1000': 'com.noveltycams.diamonds_1000',
  'diamonds:diamonds-2500': 'com.noveltycams.diamonds_2500',
  'diamonds:diamonds-5000': 'com.noveltycams.diamonds_5000'
};

export function getProductIdForStoreItem(type, id) {
  const key = `${type}:${id}`;
  return IAP_PRODUCT_IDS[key] || null;
}

export function getRevenueCatApiKey() {
  const platform = Capacitor.getPlatform();
  if (platform === 'ios') return import.meta.env.VITE_REVENUECAT_API_KEY_IOS || '';
  if (platform === 'android') return import.meta.env.VITE_REVENUECAT_API_KEY_ANDROID || '';
  return '';
}
