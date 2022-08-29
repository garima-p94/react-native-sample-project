import { createSelector } from 'reselect';
import { isObject, isArray, isBoolean } from '@helpers';
import { userInitState } from '.';
import { getAppModeState } from '@store/App';

export const getLoggedInUserState = (state: any = userInitState) => {
  return isObject(state.userReducer.loginResponse)
    ? state.userReducer.loginResponse
    : {};
};

export const getUserObjectState = (state: any = userInitState) => {
  return isObject(state.userReducer.activeUser)
    ? state.userReducer.activeUser
    : {};
};

export const getIsUserAuthenticatedState = (state: any = userInitState) => {
  return state.userReducer.isAuthenticated;
};

export const getActiveUserState = createSelector(
  getLoggedInUserState,
  getUserObjectState,
  (login, user) => {
    return { ...login, ...user };
  },
);

export const getActiveUserIdState = createSelector(getActiveUserState, (user) =>
  isObject(user) ? user.id : '',
);

export const getActiveCustomerState = createSelector(
  getActiveUserState,
  (user) =>
    isObject(user) && isObject(user.cust_data) ? { ...user.cust_data } : {},
);

export const getUserPaymentCardsState = (state: any = userInitState) => {
  return isObject(state.userReducer.paymentCards)
    ? state.userReducer.paymentCards
    : {};
};
export const getIsSavedCardExistsState = createSelector(
  getUserPaymentCardsState,
  (allCards) => isObject(allCards) && isArray(allCards.crypto_cards),
);

export const getUserAddressesState = (state: any = userInitState) => {
  return isArray(state.userReducer.userAddresses)
    ? state.userReducer.userAddresses
    : [];
};

export const getUserDefaultAccountState = createSelector(
  getActiveUserState,
  getAppModeState,
  (user, isTestMode) => {
    if (isObject(user)) {
      const key = isBoolean(isTestMode)
        ? 'test_def_account_data'
        : 'def_account_data';
      return isObject(user[key]) ? { ...user[key] } : {};
    }
    return {};
  },
);
