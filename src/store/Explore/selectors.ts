import { isArray } from '@helpers';
import { exploreInitState } from '.';

export const getAppCollectionsState = (state: any = exploreInitState) => {
  return isArray(state.exploreReducer.appCollections)
    ? state.exploreReducer.appCollections
    : [];
};
