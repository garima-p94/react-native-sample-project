import { storePhases } from '@constants';

export * from './actions';
export * from './reducers';
export * from './selectors';

export const STORE_APP_INIT_PHASE = 'app/app/STORE_APP_INIT_PHASE';
export const STORE_APP_MODE = 'app/app/STORE_APP_MODE';
export const STORE_ACTIVE_APP_DETAILS = 'app/app/STORE_ACTIVE_APP_DETAILS';

export const appInitState = {
  appInitalizePhase: storePhases.init,
  isTestMode: '0',
  activeAppObject: {},
};
