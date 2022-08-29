import { store } from '@store/index';
import { getUserDefaultAccountState } from '@store/User';
import { getPortfolioAccountState, storeUserWallets } from '@store/AccountPortfolio';
import { isObject, isExist, isArray, isApiSuccess } from '@helpers';
import { apiRequest } from './request';
import { apiEndPoints } from '@constants';
import { getUserId } from './user';
import {
  AddFailed,
  AddSuccess,
  UpdateFailed,
  UpdateSuccess,
} from '@components';
import { ApiCallProps } from '@types';

export const getUserWallets = async ({ isRefresh }: ApiCallProps = {}) => {
  const portfolioAccount = getPortfolioAccountState(store.getState());
  let result = { addresses: [], wallets: [] };
  isRefresh && store.dispatch(storeUserWallets({ isRefresh }));
  if (isObject(portfolioAccount)) {
    const res = await apiRequest({
      endPoint: apiEndPoints.app,
      body: {
        ptype: 'getwalletaddresses',
        user_id: getUserId(),
        account_id: portfolioAccount.id || portfolioAccount.id,
      },
    });
    if (isApiSuccess(res)) {
      result.addresses = isArray(res.wallet_address) ? res.wallet_address : [];
      result.wallets = isArray(res.connected_wallets) ? res.connected_wallets : [];
      store.dispatch(storeUserWallets({ ...result }));
      return result;
    }
  }
  return result;
};

export const manageWalletAddress = async ({ params, isEdit }: ApiCallProps) => {
  const defAccount = getUserDefaultAccountState(store.getState());
  if (isObject(params) && isExist(params.wallet_type) && isObject(defAccount)) {
    const res = await apiRequest({
      endPoint: apiEndPoints.app,
      body: {
        ptype: 'createwallet',
        user_id: getUserId(),
        wallet_type: params.wallet_type,
        account_id: defAccount.id || defAccount.id,
        name: params.name,
      },
    });
    if (isApiSuccess(res)) {
      isEdit
        ? UpdateSuccess({ type: 'Address' })
        : AddSuccess({ type: 'Address' });
      return res;
    }
  }
  isEdit ? UpdateFailed({ type: 'address' }) : AddFailed({ type: 'address' });
  return null;
};
