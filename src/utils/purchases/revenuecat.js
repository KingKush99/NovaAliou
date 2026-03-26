import { Capacitor } from '@capacitor/core';
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { getRevenueCatApiKey } from '../../config/iapProducts';

let configuredUserId = null;

export const PurchasesController = {
  async isSupported() {
    const platform = Capacitor.getPlatform();
    return platform === 'ios' || platform === 'android';
  },

  async configure({ appUserId }) {
    if (!(await this.isSupported())) return;
    const apiKey = getRevenueCatApiKey();
    if (!apiKey) throw new Error('Missing RevenueCat API key env var for this platform.');
    if (!appUserId) throw new Error('Missing appUserId for IAP configuration.');

    const id = String(appUserId);
    if (configuredUserId === id) return;

    Purchases.setLogLevel({ level: LOG_LEVEL.INFO });
    await Purchases.configure({ apiKey, appUserID: id });
    configuredUserId = id;
  },

  async purchaseProductId(productId) {
    if (!(await this.isSupported())) {
      throw new Error('In-app purchases are only available on iOS/Android.');
    }
    if (!productId) throw new Error('Missing productId for purchase.');

    const offerings = await Purchases.getOfferings();
    const available = offerings?.current?.availablePackages || [];
    const match = available.find((p) => p?.product?.identifier === productId);
    if (!match) {
      throw new Error(`Product not found in RevenueCat current offering: ${productId}`);
    }

    return Purchases.purchasePackage({ aPackage: match });
  },

  async restore() {
    if (!(await this.isSupported())) return null;
    return Purchases.restorePurchases();
  },

  async getVirtualCurrencies() {
    if (!(await this.isSupported())) return null;
    try {
      return await Purchases.getVirtualCurrencies();
    } catch {
      return null;
    }
  }
};

