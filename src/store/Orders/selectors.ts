import { isArray } from '@helpers';
import { orderInitState } from '.';

export const getUserPurchasesState = (state: any = orderInitState) => {
  return isArray(state.ordersReducer.purchases)
    ? state.ordersReducer.purchases
    : [];
};

export const getGlobalCryptoActivityPageState = (
  state: any = orderInitState,
) => {
  return state.ordersReducer.activityPage;
};

export const getGlobalCryptoActivityState = (state: any = orderInitState) => {
  return isArray(state.ordersReducer.globalCryptoActivity)
    ? state.ordersReducer.globalCryptoActivity
    : [];
};
