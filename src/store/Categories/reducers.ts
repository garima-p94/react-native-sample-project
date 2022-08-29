import { Response } from '@constants';
import { categoryInitState, STORE_CATEGORIES } from './index';

export const categoriesReducer = (
  state: any = categoryInitState,
  action: Response,
) => {
  switch (action.type) {
    case STORE_CATEGORIES: {
      return {
        ...state,
        categories: {
          ...state.categories,
          ...action.payload,
        },
      };
    }
    default:
      return state;
  }
};
