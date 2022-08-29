import { Response } from '@constants';
import { exploreInitState, STORE_APP_COLLECTIONS } from './index';
import { isObject } from '@helpers';

export const exploreReducer = (
  state: any = exploreInitState,
  action: Response,
) => {
  switch (action.type) {
    case STORE_APP_COLLECTIONS: {
      if (isObject(action.payload)) {
        const { list, isRefresh } = action.payload;
        return {
          ...state,
          appCollections: isRefresh ? [] : [...state.appCollections, ...list],
        };
      }
      return { ...state };
    }
    default:
      return state;
  }
};
