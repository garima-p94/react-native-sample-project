import {
  STORE_APP_INIT_PHASE,
  STORE_APP_MODE,
  STORE_ACTIVE_APP_DETAILS,
} from './index';

export const storeAppInitPhase = (payload: any) => ({
  type: STORE_APP_INIT_PHASE,
  payload,
});

export const storeAppMode = (payload: any) => ({
  type: STORE_APP_MODE,
  payload,
});

export const storeActiveApp = (payload: any) => ({
  type: STORE_ACTIVE_APP_DETAILS,
  payload,
});
