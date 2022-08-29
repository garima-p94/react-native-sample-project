import {
  IS_USER_AUTHENTICATED,
  STORE_LOGGED_IN_USER,
  USER_LOG_OUT,
  STORE_ACTIVE_USER_DETAILS,
  STORE_USER_PAYMENT_CARDS,
  STORE_USER_ADDRESSES,
  STORE_USER_DEFAULT_ACCOUNT,
} from './index';


export const storeIsUserAuthenticated = (payload: boolean) => ({
  type: IS_USER_AUTHENTICATED,
  payload,
});
export const storeLoggedInUser = (payload: any) => ({
  type: STORE_LOGGED_IN_USER,
  payload,
});
export const logoutUser = () => ({
  type: USER_LOG_OUT,
});


export const storeActiveUser = (payload: any) => ({
  type: STORE_ACTIVE_USER_DETAILS,
  payload,
});
export const storeUserPaymentCards = (payload: any) => ({
  type: STORE_USER_PAYMENT_CARDS,
  payload,
});
export const storeUserAddresses = (payload: any) => ({
  type: STORE_USER_ADDRESSES,
  payload,
});


export const storeUserDefaultAccount = (payload: any) => ({
  type: STORE_USER_DEFAULT_ACCOUNT,
  payload,
});
