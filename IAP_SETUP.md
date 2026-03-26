# In-App Purchases (iOS + Android)

NoveltyCams sells digital goods (coins/diamonds) and VIP subscriptions. For App Store and Google Play releases, these purchases must use **Apple In-App Purchase** and **Google Play Billing**.

This repo is wired to use **RevenueCat** via `@revenuecat/purchases-capacitor`.

## 1) Create Products In The Stores

### Apple (App Store Connect)
- Create **Consumables** for coin packs (and diamonds if you sell them).
- Create **Auto-Renewable Subscriptions** for VIP.
- Record the **Product IDs** (e.g. `com.noveltycams.coins_1000`).

### Android (Google Play Console)
- Create **In-app products** for consumables.
- Create **Subscriptions** for VIP (base plan/offer).
- Use the same product IDs as iOS when possible.

## 2) Configure RevenueCat

1. Create a RevenueCat project for NoveltyCams.
2. Add the iOS app + Android app and connect each store.
3. Add all product IDs in RevenueCat.
4. Create a current Offering and attach packages for your products.
5. (Recommended) Configure **Virtual Currencies** in RevenueCat:
- Create a virtual currency named `coins` and have coin products grant it.

## 3) Put Keys In `.env`

Copy `.env.example` to `.env` and fill:
- `VITE_REVENUECAT_API_KEY_IOS` (RevenueCat public SDK key)
- `VITE_REVENUECAT_API_KEY_ANDROID` (RevenueCat public SDK key)

## 4) Map Store Items -> Product IDs

Edit `src/config/iapProducts.js` and set `IAP_PRODUCT_IDS[...]` to the real store product identifiers you created.

## 5) Install + Sync Native Plugins

From `M:\NoveltyCams`:
```powershell
npm i
npx cap sync
```

## 5.1) Enable RevenueCat Build Flag

Set this env var when you build for device:
- `VITE_IAP_PROVIDER=revenuecat`

## 6) Android Launch Mode

RevenueCat requires a compatible `launchMode`. This repo sets it to `singleTop`:
- `android/app/src/main/AndroidManifest.xml`

## Notes
- Stripe/Coinbase can still be used for web or non-digital goods, but **not** for coins/subscriptions in App Store / Play Store builds.
- For a production economy you should persist balances server-side; RevenueCat Virtual Currencies helps avoid trusting the client.
