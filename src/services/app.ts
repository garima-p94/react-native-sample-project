import { isObject, isExist, isBoolean, ifExist } from '@helpers';
import { getObjectData } from './object';
import { getUserDetails, getUserId } from './user';
import { setPortfolioAccount } from './login';
import { store } from '@store/index';
import { storeAppMode, storeActiveApp, getAppModeState } from '@store/App';
import { storeUserWallets } from '@store/AccountPortfolio';
import { colors } from '@styles';
import { ObjectType } from '@types';

/* store app mode - is test or live mode */
export const appModeHandler = (isTestMode: string) => {
  if (isExist(isTestMode)) {
    store.dispatch(storeAppMode(isTestMode));
  }
  return null;
};

export const isTestMode = () => {
  const existingMode = getAppModeState(store.getState()); // will be 0 or 1;
  return isBoolean(existingMode); // return true if 1
};

interface getApiProps {
  params?: ObjectType;
  inStore?: boolean;
  isRefresh?: boolean;
}
/* store active app details - get data using object api */
export const getActiveAppDetails = async (
  options: getApiProps = {
    inStore: true,
  },
) => {
  const { params, inStore } = options;
  if (params && isExist(params.id)) {
    const res = await getObjectData({
      sourceid: params.id,
    });
    if (isObject(res)) {
      res.primary = {};
      res.secondary = {};
      res.primary.chatbg_color = ifExist(res.chatbg_color) || colors.white;
      res.secondary.chatbg_color = ifExist(res.chatbg_color) || colors.white;
      Object.keys(res).map((key) => {
        if (key.includes('thm_')) {
          res.primary[key] = res[key];
        }
        if (key.includes('thm2_')) {
          const newKey = key.replace('thm2_', 'thm_');
          res.secondary[newKey] = res[key];
        }
      });
      inStore && store.dispatch(storeActiveApp(res));
      return res;
    }
  }
  return null;
};

export const onAppModeChange = async () => {
  store.dispatch(storeUserWallets({ isRefresh: true }))
  const res = await getUserDetails({ userId: getUserId() });
  await setPortfolioAccount();
};
