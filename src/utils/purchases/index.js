import { Capacitor } from '@capacitor/core';

function isNative() {
  const platform = Capacitor.getPlatform();
  return platform === 'ios' || platform === 'android';
}

export async function getPurchasesController() {
  if (!isNative()) {
    return {
      isSupported: async () => false
    };
  }

  // This is a build-time switch. If VITE_IAP_PROVIDER is not set to "revenuecat",
  // the RevenueCat module won't be bundled (and the app can still build/run).
  if (typeof __IAP_PROVIDER__ === 'string' && __IAP_PROVIDER__ === 'revenuecat') {
    const mod = await import('./revenuecat');
    return mod.PurchasesController;
  }

  return {
    isSupported: async () => true,
    configure: async () => {
      throw new Error('IAP provider not configured. Set VITE_IAP_PROVIDER=revenuecat and configure keys.');
    },
    purchaseProductId: async () => {
      throw new Error('IAP provider not configured. Set VITE_IAP_PROVIDER=revenuecat and configure keys.');
    },
    restore: async () => null,
    getVirtualCurrencies: async () => null
  };
}
