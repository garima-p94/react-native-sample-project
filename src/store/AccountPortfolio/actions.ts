import {
  STORE_ACCOUNT_PORTFOLIO_LIST,
  STORE_CRYPTO_ASSETS,
  STORE_ACCOUNT_LIST,
  STORE_PORTFOLIO_ACCOUNT,
  STORE_PORTFOLIO_WORTH,
  STORE_USER_WALLETS,
} from './index';

export const storeUserAccounts = (payload: any) => ({
  type: STORE_ACCOUNT_LIST,
  payload,
});
export const storPortfolioAccount = (payload: any) => ({
  type: STORE_PORTFOLIO_ACCOUNT,
  payload,
});

export const storeAccountPortfolioList = (payload: any) => ({
  type: STORE_ACCOUNT_PORTFOLIO_LIST,
  payload,
});

export const storeCryptoAssets = (payload: any) => ({
  type: STORE_CRYPTO_ASSETS,
  payload,
});

export const storePortfolioWorth = (payload: any) => ({
  type: STORE_PORTFOLIO_WORTH,
  payload,
});

export const storeUserWallets = (payload: any) => ({
  type: STORE_USER_WALLETS,
  payload,
})