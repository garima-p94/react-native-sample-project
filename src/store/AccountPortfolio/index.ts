export * from './actions';
export * from './reducers';
export * from './selectors';

export const STORE_ACCOUNT_LIST = 'app/accountPortfolio/STORE_ACCOUNT_LIST';
export const STORE_PORTFOLIO_ACCOUNT =
  'app/accountPortfolio/STORE_PORTFOLIO_ACCOUNT';
export const STORE_ACCOUNT_PORTFOLIO_LIST =
  'app/accountPortfolio/STORE_ACCOUNT_PORTFOLIO_LIST';
export const STORE_PORTFOLIO_WORTH =
  'app/accountPortfolio/STORE_PORTFOLIO_WORTH';

export const STORE_CRYPTO_ASSETS = 'app/accountPortfolio/STORE_CRYPTO_ASSETS';
export const STORE_USER_WALLETS = 'app/accountPortfolio/STORE_USER_WALLETS';

export const portfolioInitState = {
  userAccounts: [],
  portfolio: {},
  portfolioAccount: {},
  portfolioWorth: '$0.00',
  portfolioUpdatedAt: '',

  cryptoAssets: [],

  wallets: [],
  allWalletAddresses: [],
};
