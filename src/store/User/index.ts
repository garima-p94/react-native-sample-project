export * from './actions';
export * from './reducers';
export * from './selectors';

export const IS_USER_AUTHENTICATED = 'app/user/IS_USER_AUTHENTICATED';
export const STORE_LOGGED_IN_USER = 'app/user/STORE_LOGGED_IN_USER';
export const USER_LOG_OUT = 'app/user/USER_LOG_OUT';

export const STORE_ACTIVE_USER_DETAILS = 'app/user/STORE_ACTIVE_USER_DETAILS';
export const STORE_USER_PAYMENT_CARDS = 'app/user/STORE_USER_PAYMENT_CARDS';
export const STORE_USER_ADDRESSES = 'app/user/STORE_USER_ADDRESSES';

export const STORE_USER_DEFAULT_ACCOUNT =
  'app/user/STORE_USER_DEFAULT_ACCOUNT';

export const userInitState = {
  isAuthenticated: false,
  loginResponse: {},
  activeUser: {},
  paymentCards: {},
  userAddresses: [],
  userDefaultAccuont: {},
};
