import { APP_MODE, Response } from '@constants';
import { setLocalStorage } from '@utils';
import {
  appInitState,
  STORE_APP_INIT_PHASE,
  STORE_APP_MODE,
  STORE_ACTIVE_APP_DETAILS,
} from './index';

export const appReducer = (state: any = appInitState, action: Response) => {
  switch (action.type) {
    case STORE_APP_INIT_PHASE: {
      return { ...state, appInitalizePhase: action.payload };
    }
    case STORE_APP_MODE: {
      setLocalStorage(APP_MODE, action.payload);
      return { ...state, isTestMode: action.payload };
    }
    case STORE_ACTIVE_APP_DETAILS: {
      return { ...state, activeAppObject: action.payload };
    }
    default:
      return state;
  }
};
