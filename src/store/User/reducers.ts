import { Response } from '@constants';
import {
  userInitState,
  IS_USER_AUTHENTICATED,
  STORE_LOGGED_IN_USER,
  USER_LOG_OUT,
  STORE_ACTIVE_USER_DETAILS,
  STORE_USER_PAYMENT_CARDS,
  STORE_USER_ADDRESSES,
  STORE_USER_DEFAULT_ACCOUNT,
} from './index';

export const userReducer = (state: any = userInitState, action: Response) => {
  switch (action.type) {
    case IS_USER_AUTHENTICATED: {
      return { ...state, isAuthenticated: action.payload };
    }
    case STORE_LOGGED_IN_USER: {
      return { ...state, loginResponse: action.payload };
    }
    case USER_LOG_OUT: {
      return { ...state, loginResponse: {} };
    }
    case STORE_ACTIVE_USER_DETAILS: {
      return { ...state, activeUser: action.payload };
    }
    case STORE_USER_PAYMENT_CARDS: {
      return { ...state, paymentCards: action.payload };
    }
    case STORE_USER_ADDRESSES: {
      return { ...state, userAddresses: action.payload };
    }
    case STORE_USER_DEFAULT_ACCOUNT: {
      return { ...state, userDefaultAccuont: action.payload };
    }
    default:
      return state;
  }
};
