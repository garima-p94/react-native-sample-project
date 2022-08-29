import { STORE_APP_COLLECTIONS } from './index';

export const storeAppCollections = (payload: any) => ({
  type: STORE_APP_COLLECTIONS,
  payload,
});
