import { Response } from '@constants';
import { isObject, isArray } from '@helpers';
import {
  portfolioInitState,
  STORE_ACCOUNT_LIST,
  STORE_PORTFOLIO_ACCOUNT,
  STORE_ACCOUNT_PORTFOLIO_LIST,
  STORE_CRYPTO_ASSETS,
  STORE_PORTFOLIO_WORTH,
  STORE_USER_WALLETS,
} from './index';

export const portfolioReducer = (
  state: any = portfolioInitState,
  action: Response,
) => {
  switch (action.type) {
    case STORE_ACCOUNT_LIST: {
      return { ...state, userAccounts: action.payload };
    }
    case STORE_PORTFOLIO_ACCOUNT: {
      return { ...state, portfolioAccount: action.payload };
    }
    case STORE_ACCOUNT_PORTFOLIO_LIST: {
      return { ...state, portfolio: action.payload };
    }
    case STORE_CRYPTO_ASSETS: {
      return { ...state, cryptoAssets: action.payload };
    }
    case STORE_PORTFOLIO_WORTH: {
      if (isObject(action.payload)) {
        const { balance, updatedAt } = action.payload;
        return {
          ...state,
          portfolioWorth: balance,
          portfolioUpdatedAt: updatedAt,
        };
      }
      return { ...state };
    }
    case STORE_USER_WALLETS: {
      if (isObject(action.payload)) {
        const { wallets, addresses, isRefresh } = action.payload;
        return {
          ...state,
          wallets: isRefresh ? [] : isArray(wallets) ? [...wallets] : state.wallets,
          allWalletAddresses: isRefresh ? [] : isArray(addresses) ? [...addresses] : state.addresses,
        };
      }
      return { ...state };
    }
    default:
      return state;
  }
};
