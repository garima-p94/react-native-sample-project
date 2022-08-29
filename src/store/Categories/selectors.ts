import { isExist, isObject } from '@helpers';
import { categoryInitState } from '.';

export const getCategoriesState = (
  state: any = categoryInitState,
  key: string,
) => {
  if (isObject(state.categoriesReducer.categories)) {
    return isExist(key)
      ? state.categoriesReducer.categories[key]
      : state.categoriesReducer.categories;
  }
  return {};
};
