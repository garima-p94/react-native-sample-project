import { apiRequest } from '@services';
import {
  isObject,
  isApiSuccess,
  isExist,
  isArray,
  ifExist,
  getOrderFilteredData,
} from '@helpers';
import { store } from '@store/index';
import { storeUserPurchases, storeGlobalCryptoActivity } from '@store/Orders';
import { getPortfolioAccountState } from '@store/AccountPortfolio';
import { getActiveCustomerState } from '@store/User';
import { apiEndPoints } from '@constants';

/* contains services related to orders, purchases, subscription etc */

export const getOrders = async (options = { params: {} }) => {
  const { params } = options;
  if (isObject(params)) {
    const body = {
      ptype: 'getorders',
      page: params.page || 1,
      limit: params.limit || 12,
      ...params,
    };
    try {
      const res = await apiRequest({
        endPoint: apiEndPoints.transactions,
        body,
      });
      if (isApiSuccess(res) && isObject(res.orders)) {
        return res.orders;
      }
      return null;
    } catch (err) {
      console.log('orders error ===>', err);
      return null;
    }
  }
};

export const getGlobalCryptoActivity = async (options: any = {}) => {
  const { params, isRefresh } = options;
  const account = getPortfolioAccountState(store.getState());
  if (isObject(account)) {
    isRefresh && store.dispatch(storeGlobalCryptoActivity({ isRefresh }));
    const body = params ? { ...params } : {};
    try {
      const res = await getOrders({
        params: {
          account_id: account.id,
          page: ifExist(body.page) || 1,
          ...body,
        },
      });
      if (isObject(res)) {
        store.dispatch(
          storeGlobalCryptoActivity({
            list: res,
            page: params && ifExist(params.page) ? params.page : 1,
          }),
        );
        return res;
      }
      return null;
    } catch (err) {
      console.log('getGlobalCryptoActivity error ===>', err);
      return null;
    }
  }
  return null;
};

export const getMyPurchases = async (options: any) => {
  const { params, isRefresh } = options;
  const customer = getActiveCustomerState(store.getState());
  if (isExist(customer.cust_id)) {
    isRefresh && store.dispatch(storeUserPurchases({ isRefresh: true }));
    const orders = await getOrders({
      params: { ...params, customer_id: customer.cust_id },
    });
    if (isArray(orders)) {
      store.dispatch(storeUserPurchases({ list: [...orders] }));
      return orders;
    }
  } else {
    store.dispatch(storeUserPurchases({ isRefresh: true }));
  }
  return null;
};

export const getOrderDetails = async (options: any) => {
  const { params, tokenId } = options;
  if (isExist(params.id)) {
    try {
      const res = await apiRequest({
        endPoint: apiEndPoints.transactions,
        body: {
          ptype: 'order_detail',
          ...params,
        },
      });
      if (isApiSuccess(res) && isObject(res.data)) {
        const details = getOrderFilteredData({ order: res.data, tokenId });
        return details;
      }
    } catch (err) {
      console.log('order details error ===>', err);
      return null;
    }
  }
  return null;
};
