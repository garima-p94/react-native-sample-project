import { isObject, isArray, ifExist } from '@helpers';
import { portfolioInitState } from '.';

export const getUserAccountsListState = (state: any = portfolioInitState) =>
  isArray(state.portfolioReducer.userAccounts)
    ? state.portfolioReducer.userAccounts
    : [];

export const getPortfolioAccountState = (state: any = portfolioInitState) =>
  isObject(state.portfolioReducer.portfolioAccount)
    ? state.portfolioReducer.portfolioAccount
    : {};

export const getAccountPortfolioListState = (state: any = portfolioInitState) =>
  isObject(state.portfolioReducer.portfolio)
    ? state.portfolioReducer.portfolio
    : {};

export const getCryptoAssetsState = (state: any = portfolioInitState) =>
  isArray(state.portfolioReducer.cryptoAssets)
    ? state.portfolioReducer.cryptoAssets
    : [];

export const getPortfolioWorthState = (state: any = portfolioInitState) => {
  return {
    portfolioWorth: ifExist(state.portfolioReducer.portfolioWorth) || '$0.00',
    portfolioUpdatedAt:
      ifExist(state.portfolioReducer.portfolioUpdatedAt) || '',
  };
};

export const getUserWalletsState = (state: any = portfolioInitState) =>
  isArray(state.portfolioReducer.wallets)
    ? state.portfolioReducer.wallets
    : [];

export const getAllWalletAddressesState = (state: any = portfolioInitState) =>
  isArray(state.portfolioReducer.allWalletAddresses)
    ? state.portfolioReducer.allWalletAddresses
    : [];