import _ from 'lodash';
import { isArray, isObject, ifExist } from '@helpers';
import { Response } from '@constants';
import {
  orderInitState,
  STORE_USER_PURCHASES,
  GLOBAL_CRYPTO_ACTIVITY,
} from './index';

export const ordersReducer = (
  state: any = orderInitState,
  action: Response,
) => {
  switch (action.type) {
    case STORE_USER_PURCHASES: {
      if (isObject(action.payload)) {
        const { list, isRefresh } = action.payload;
        const newList = isArray(list) ? [...list] : [];
        return {
          ...state,
          purchases: isRefresh
            ? []
            : _.uniqBy([...state.purchases, ...newList], 'id'),
        };
      }
      return state;
    }
    case GLOBAL_CRYPTO_ACTIVITY: {
      if (isObject(action.payload)) {
        const { list, page, isRefresh } = action.payload;
        const newList = isArray(list) ? [...list] : [];
        return {
          ...state,
          activityPage: ifExist(page) || 1,
          globalCryptoActivity: isRefresh
            ? []
            : _.uniqBy([...state.globalCryptoActivity, ...newList], 'id'),
        };
      }
      return state;
    }
    default:
      return state;
  }
};
