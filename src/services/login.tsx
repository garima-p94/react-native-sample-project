import _ from 'lodash';
import moment from 'moment';
import { store } from '@store/index';
import {
  storeLoggedInUser,
  storeIsUserAuthenticated,
  getUserDefaultAccountState,
  getActiveUserState,
} from '@store/User';
import { isApiSuccess, isObject, isExist } from '@helpers';
import { ObjectType, ApiCallProps } from '@types';
import {
  ALL_STORED_USER_LOGINS,
  LAST_LOGGED_IN_USER,
  USERS_AUTH_STATUSES,
} from '@constants';
import { apiRequest } from '@services';
import { getLocalStorage, setLocalStorage } from '@utils';
import { getUserDetails, getUserDefaultAccount, getUserId } from './user';
import { showMessage } from '@components';
import { storPortfolioAccount } from '@store/AccountPortfolio';

interface EmailLogin extends ApiCallProps {
  params: {
    email: string;
    password: string;
  };
}

/* email login */
export const userEmailLogin = async (
  opt: EmailLogin = {
    params: {
      email: '',
      password: '',
    },
  },
) => {
  const { params } = opt;
  if (isObject(params) && isExist(params.email) && isExist(params.password)) {
    try {
      const login = {
        type: 'sglogin',
        logintype: 'email',
        name: params.email,
        pwd: params.password,
      };
      const res = await apiRequest({ body: login });
      if (isApiSuccess(res) && isObject(res.data)) {
        const activeUser = await getUserDetails({ userId: res.data.id });
        const userDefaultAccount = await setPortfolioAccount(activeUser);
        store.dispatch(storeLoggedInUser({ ...res.data }));
        await storeLoggedInAccounts({ login, user: { ...res.data } });
        return { lastLoggedIn: res.data, activeUser, userDefaultAccount };
      } else {
        showMessage({ message: 'Login Failed', type: 'danger' });
        return null;
      }
    } catch (err) {
      showMessage({ message: 'Login Failed', type: 'danger' });
      console.log('login error ===>', err);
      return null;
    }
  }
  return null;
};

export const isAuthenticatedStatus = async (value: boolean) => {
  const userId = getUserId();
  let existing = (await getLocalStorage(USERS_AUTH_STATUSES)) || {};
  existing[userId] = value;
  await setLocalStorage(USERS_AUTH_STATUSES, existing);
  store.dispatch(storeIsUserAuthenticated(value));
};

export const setPortfolioAccount = async (user?: ObjectType) => {
  let userDefaultAccount = {};
  const activeUser = isObject(user)
    ? user
    : getActiveUserState(store.getState());
  if (isObject(activeUser)) {
    userDefaultAccount = getUserDefaultAccountState(store.getState());
  }
  if (!isObject(userDefaultAccount)) {
    userDefaultAccount = await getUserDefaultAccount({
      params: { userId: activeUser.id },
    });
  }
  isObject(userDefaultAccount) &&
    store.dispatch(storPortfolioAccount(userDefaultAccount));
  return userDefaultAccount;
};

// save all user accounts logged in on this device
export const storeLoggedInAccounts = async ({ login, user }: ObjectType) => {
  if (isObject(login) && isObject(user)) {
    let existing = (await getLocalStorage(ALL_STORED_USER_LOGINS)) || {
      savedLogins: [],
    };
    const obj = {
      ...login,
      ...user,
      lastLogin: moment().format('YY-MM-DD hh:mm:ss'),
    };
    if (!isObject(existing)) {
      existing = { savedLogins: [{ ...obj }] };
    } else {
      const isSavedIndex = existing.savedLogins.findIndex(
        (e: { id: string }) => e.id === user.id,
      );
      if (isSavedIndex !== -1) {
        // is saved
        existing.savedLogins[isSavedIndex] = { ...obj };
      } else {
        // not saved
        existing.savedLogins.push({ ...obj });
      }
    }
    existing.activeUserId = user.id;
    existing.savedLogins = _.sortBy(existing.savedLogins, 'lastLogin', 'desc');
    await setLocalStorage(ALL_STORED_USER_LOGINS, existing);
    await setLocalStorage(LAST_LOGGED_IN_USER, obj);
  }
};
