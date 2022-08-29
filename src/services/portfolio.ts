import moment from 'moment';
import { apiRequest, getUserId } from '@services';
import {
  isApiSuccess,
  isExist,
  isObject,
  ifExist,
  isArray,
  toFloatType,
  toCurrencyFormat,
} from '@helpers';
import { apiEndPoints } from '@constants';
import { store } from '@store/index';
import {
  storeAccountPortfolioList,
  storeCryptoAssets,
  storeUserAccounts,
  getPortfolioAccountState,
  getAccountPortfolioListState,
  getCryptoAssetsState,
  storePortfolioWorth,
} from '@store/AccountPortfolio';
import { ObjectType } from '@types';

interface ServiceOptions {
  params?: ObjectType;
  isRefresh?: boolean;
  isHardRefresh?: boolean;
}

export const getUserAccounts = async (options: ServiceOptions = {}) => {
  const { params } = options; // isRefresh
  try {
    const res = await apiRequest({
      body: {
        ptype: 'useraccounts',
        user_id: getUserId(),
        only_with_coins: '1',
        ...params,
      },
      endPoint: apiEndPoints.productServiceApi,
    });
    if (isApiSuccess(res) && isArray(res.user_accounts)) {
      store.dispatch(storeUserAccounts(res.user_accounts));
      return res.user_accounts;
    }
  } catch (err) {
    console.log('accounts list error ===>', err);
    return null;
  }
};

export const getAccountPortfolioList = async (options: ServiceOptions = {}) => {
  const { params, isRefresh } = options;
  const account = getPortfolioAccountState(store.getState());
  const id = ifExist(account.id) || '';
  if (isExist(id)) {
    isRefresh && store.dispatch(storeAccountPortfolioList({}));
    try {
      const res = await apiRequest({
        endPoint: apiEndPoints.accountPortlolio,
        body: {
          user_id: getUserId(),
          token_id: '',
          account_id: id,
          // hard_refresh: isRefresh ? '1' : '0',
          ...params,
        },
      });
      if (isApiSuccess(res) && isObject(res.data)) {
        const keys = Object.keys(res.data);
        const accId = isArray(keys) ? keys[0] : '';
        store.dispatch(storeAccountPortfolioList(res.data[accId]));
        return res.data[accId];
      }
    } catch (err) {
      console.log('portfolio error ===>', err);
      return null;
    }
  } else {
    console.log('no account id for portfolio');
  }
  return null;
};

export const getCryptoAssetsList = async (options: ServiceOptions = {}) => {
  try {
    const res = await apiRequest({
      endPoint: apiEndPoints.globalAssets,
      body: {
        ptype: 'token_list',
        user_id: getUserId(),
        hard_refresh: options.isHardRefresh ? '1' : '0',
      },
    });
    const list = isApiSuccess(res) && isArray(res.data) ? res.data : [];
    store.dispatch(storeCryptoAssets(list));
    return list;
  } catch (err) {
    console.log('global Crypto Assets error ===>', err);
    return null;
  }
};

export const getCrytoTokenDetails = async (options: ServiceOptions = {}) => {
  const { params } = options;
  if (params && isExist(params.id)) {
    try {
      const res = await apiRequest({
        endPoint: apiEndPoints.globalAssets,
        body: {
          ...params,
          ptype: 'token_details',
          user_id: getUserId(),
        },
      });
      return isApiSuccess(res) && isObject(res.data) ? res.data : null;
    } catch (err) {
      console.log('tokenDetails error ===>', err);
      return null;
    }
  }
  return null;
};

export const getTokenTransactions = async (options: ServiceOptions = {}) => {
  const { params } = options;
  if (params && isExist(params.id)) {
    try {
      const res = await apiRequest({
        endPoint: apiEndPoints.globalAssets,
        body: {
          ...params,
          ptype: 'transactions',
          user_id: getUserId(),
          limit: 10,
        },
      });
      return isApiSuccess(res) && isArray(res.transactions)
        ? res.transactions
        : [];
    } catch (err) {
      console.log('token transactions error ===>', err);
      return null;
    }
  }
  return [];
};

export const getPortfolioWorth = () => {
  const portfolio = getAccountPortfolioListState(store.getState());
  const globalAssets = getCryptoAssetsState(store.getState());
  let total = '$0.00';
  if (isArray(globalAssets) && isObject(portfolio) && isArray(portfolio.list)) {
    let worth = 0;
    portfolio.list.map((e): any => {
      const asset = globalAssets.find((f: any) => f.token_id === e.token_id);
      if (isObject(asset)) {
        const val =
          toFloatType(e.user_number_of_tokens) *
          toFloatType(asset.exchange_rate);
        worth += val;
      }
    });
    total = toCurrencyFormat({ value: worth });
  }
  const updatedAt = moment().format('hh:mm:ss');
  store.dispatch(storePortfolioWorth({ balance: total, updatedAt }));
  return total;
};
