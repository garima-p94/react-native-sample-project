export const AUTH_TOKEN = 'app/auth/AUTH_TOKEN';
export const APP_MODE = 'app/auth/APP_MODE_IN_LOCAL';
export const ALL_STORED_USER_LOGINS = 'app/auth/ALL_STORED_USER_LOGINS';
export const LAST_LOGGED_IN_USER = 'app/auth/LAST_LOGGED_IN_USER';
export const USERS_AUTH_STATUSES = 'app/auth/USERS_AUTH_STATUSES';

export interface Response {
  type: string;
  payload: any;
}

export const storePhases = {
  init: 'INIT',
  loading: 'LOADING',
  success: 'SUCCESS',
  error: 'ERROR',
};
