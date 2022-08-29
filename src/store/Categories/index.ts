export * from './actions';
export * from './reducers';
export * from './selectors';

export const STORE_CATEGORIES = 'app/category/STORE_CATEGORIES';

export const categoryInitState = {
  categories: {
    walletProviders: [],
    collections: [],
    walletAddrTypes: [],
  },
};
