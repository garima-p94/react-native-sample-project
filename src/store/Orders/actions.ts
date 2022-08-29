import { STORE_USER_PURCHASES, GLOBAL_CRYPTO_ACTIVITY } from './index';

export const storeUserPurchases = (payload: any) => ({
  type: STORE_USER_PURCHASES,
  payload,
});

export const storeGlobalCryptoActivity = (payload: any) => ({
  type: GLOBAL_CRYPTO_ACTIVITY,
  payload,
});
