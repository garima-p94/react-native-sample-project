export * from './actions';
export * from './reducers';
export * from './selectors';

export const STORE_USER_PURCHASES = 'app/purchases/STORE_USER_PURCHASES';
export const GLOBAL_CRYPTO_ACTIVITY = 'app/purchases/GLOBAL_CRYPTO_ACTIVITY';

export const orderInitState = {
  purchases: [],
  activityPage: 1,
  globalCryptoActivity: [],
};
