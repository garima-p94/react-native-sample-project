import { store } from '@store/index';
import {
  getActiveUserIdState,
  storeActiveUser,
  getActiveCustomerState,
  storeUserPaymentCards,
  storeUserAddresses,
  getActiveUserState,
  storeUserDefaultAccount,
  getIsSavedCardExistsState,
} from '@store/User';
import { apiRequest } from '@services';
import {
  isApiSuccess,
  isObject,
  isExist,
  isArray,
  isBoolean,
  toIntType,
} from '@helpers';
import { getObjectData } from './object';
import { ObjectType, ApiCallProps } from '@types';
import {
  AddFailed,
  AddSuccess,
  UpdateFailed,
  UpdateSuccess,
  DeleteSuccess,
  DeleteFailed,
} from '@components';
import { apiEndPoints, stripeKeys } from '@constants';
import { getStripeCardToken } from './stripe';

/* get user details - uses object api */
export const getUserDetails = async (options: ApiCallProps) => {
  const { userId, isRefresh } = options;
  isRefresh && store.dispatch(storeActiveUser({}));
  if (isObject(options) && isExist(userId)) {
    const res = await getObjectData({
      sourcetype: 'user',
      sourceid: userId,
    });
    if (isObject(res)) {
      store.dispatch(storeActiveUser(res));
      return res;
    }
  }
  return null;
};

// func to get just the active user id
export const getUserId = () => {
  const userId = getActiveUserIdState(store.getState());
  return isExist(userId) ? userId : '';
};

export const isAdminUser = () => {
  const user = getActiveUserState(store.getState());
  return isBoolean(user.role);
};
export const isExpertUser = () => {
  const user = getActiveUserState(store.getState());
  return isBoolean(user.is_expert);
};

export const isLaunchExpert = () => {
  // check 'featurable' key
  const user = getActiveUserState(store.getState());
  return isBoolean(user.featurable);
};

/// get user default account
export const getUserDefaultAccount = async (options: ApiCallProps) => {
  const { params, isRefresh } = options;
  if (params && isExist(params.userId)) {
    isRefresh && store.dispatch(storeUserDefaultAccount({}));
    try {
      const res = await apiRequest({
        endPoint: apiEndPoints.productServiceApi,
        body: {
          ptype: 'getdefaultaccount',
          user_id: params.userId,
        },
      });
      if (isApiSuccess(res) && isObject(res.default_account)) {
        store.dispatch(storeUserDefaultAccount(res.default_account));
        return res.default_account;
      }
      return null;
    } catch (err) {
      console.log('defAccount error ===>', err);
      return null;
    }
  }
  return null;
};

// get user's saved cards
export const getUserPaymentCards = async (options: ApiCallProps = {}) => {
  const { params, isRefresh } = options;
  const customer = getActiveCustomerState(store.getState());
  if (isExist(customer.cust_id)) {
    try {
      isRefresh && store.dispatch(storeUserPaymentCards({}));
      const res = await apiRequest({
        isWithAuth: true,
        endPoint: apiEndPoints.paymentCards,
        body: {
          ptype: 'getcards',
          customer_id: customer.cust_id || '',
          is_charity: customer.is_charity || '0',
          user_id: getUserId(),
          // user_id:
        },
      });
      if (isApiSuccess(res)) {
        store.dispatch(storeUserPaymentCards(res));
        return res.cards; // has charity_cards as well, check respsonse
      }
      return null;
    } catch (err) {
      console.log('customer cards error ===>', err);
      return null;
    }
  }
};

// add/edit payment cards
export const manageUserPaymentCard = async ({
  params,
  isEdit = false,
  cardId = '',
}: ApiCallProps) => {
  const user = getActiveUserState(store.getState());
  const customer = getActiveCustomerState(store.getState());
  if (isEdit && !isExist(cardId)) {
    return null;
  }
  if (params && isExist(customer.cust_id)) {
    try {
      const card = {
        ...params,
        expMonth: toIntType(params.expMonth),
        expYear: toIntType(params.expYear),
      };
      const nonCharity = await getStripeCardToken({
        card,
        type: 'contribution',
      });
      const charity = await getStripeCardToken({ card, type: 'donation' });
      const app = await getStripeCardToken({ card, type: 'App' });
      if (nonCharity.token && charity.token && app.token) {
        const body = {
          ptype: 'create_card',
          token: nonCharity.token,
          charity_token: charity.token,
          crypto_token: app.token,
          user_id: getUserId(),
          email: user.email,
          save_card: card.isSaved ? '1' : '0',
          customer_id: customer.cust_id,
        };
        const res = await apiRequest({
          isWithAuth: true,
          endPoint: apiEndPoints.paymentCards,
          body,
        });
        if (isApiSuccess(res) && isObject(res)) {
          const isCardExists = getIsSavedCardExistsState(store.getState());
          store.dispatch(storeUserPaymentCards(res));
          if (!isCardExists) {
            await getUserDetails({ userId: getUserId(), isRefresh: true });
            getUserPaymentCards({ isRefresh: true });
            getUserAddresses({ isRefresh: true });
          }
        }
        return res;
      }
      return nonCharity.error ? nonCharity : charity;
    } catch (err) {
      console.log('manage payment card error ===>', err);
      return null;
    }
  }
  return null;
};

// delete payment card
export const deleteUserPaymentCard = async (card: ObjectType) => {
  const customer = getActiveCustomerState(store.getState());
  if (isObject(card) && isObject(customer)) {
    try {
      const res = await apiRequest({
        isWithAuth: true,
        endPoint: apiEndPoints.paymentCards,
        body: {
          ptype: 'delete_card',
          is_charity: card.is_charity,
          card_id: card.id,
          customer_id: customer.cust_id,
        },
      });
      const isSuccess = isApiSuccess(res);
      if (isSuccess) {
        store.dispatch(storeUserPaymentCards(res));
        return res.cards; // has charity_cards as well, check respsonse
      }
    } catch (err) {
      console.log('delete cards error ===>', err);
      return null;
    }
  }
  return null;
};

// get user's saved addresses
export const getUserAddresses = async (options: ApiCallProps = {}) => {
  const { params, isRefresh } = options;
  const customer = getActiveCustomerState(store.getState());
  if (isObject(customer)) {
    try {
      isRefresh && store.dispatch(storeUserAddresses([]));
      const res = await apiRequest({
        isWithAuth: true,
        endPoint: apiEndPoints.userAddresses,
        body: {
          ptype: 'custaddr_list',
          customer_id: customer.cust_id || '',
          is_charity: customer.is_charity || '0',
          user_id: getUserId(),
        },
      });
      if (isApiSuccess(res)) {
        const addresses = isArray(res.addresses) ? res.addresses : [];
        store.dispatch(storeUserAddresses(addresses));
        return addresses;
      }
    } catch (err) {
      console.log('user addresses error ===>', err);
      return null;
    }
  }
  return null;
};

// add/edit user addresses
export const manageUserAddresses = async ({
  params,
  isEdit = false,
  addressId = '',
}: ApiCallProps) => {
  const user = getActiveUserState(store.getState());
  const customer = getActiveCustomerState(store.getState());
  if (isEdit && !isExist(addressId)) {
    return null;
  }
  if (params && isExist(customer.cust_id)) {
    try {
      const body = {
        ...params,
        ptype: isEdit ? 'custaddr_update' : 'custaddr_create',
        type: 'mailing',
        email: user.email,
        cust_id: customer.cust_id,
        user_id: user.id,
        is_default: '0',
        phone: '',
        id: isEdit ? addressId : '',
      };
      const res = await apiRequest({
        isWithAuth: true,
        body,
        endPoint: apiEndPoints.userAddresses,
      });
      const isSaved = isApiSuccess(res);
      if (isSaved) {
        isEdit
          ? UpdateSuccess({ type: 'Address' })
          : AddSuccess({ type: 'Address' });
      } else {
        isEdit
          ? UpdateFailed({ type: 'address' })
          : AddFailed({ type: 'address' });
      }
      if (isSaved) {
        const addresses = isArray(res.addresses) ? res.addresses : [];
        store.dispatch(storeUserAddresses(addresses));
        return res;
      }
    } catch (err) {
      console.log('manage user address error ===>', err);
      return null;
    }
  }
  return null;
};

// delete user address
export const deleteUserAddress = async (
  options: { id: string } = {
    id: '',
  },
) => {
  const { id } = options;
  const customer = getActiveCustomerState(store.getState());
  if (isExist(id) && isObject(customer)) {
    try {
      const res = await apiRequest({
        isWithAuth: true,
        endPoint: apiEndPoints.userAddresses,
        body: {
          ptype: 'custaddr_delete',
          customer_id: customer.cust_id || '',
          id,
        },
      });
      const isSuccess = isApiSuccess(res);
      if (isSuccess) {
        DeleteSuccess({ type: 'Address' });
        const list = isArray(res.addresses) ? res.addresses : [];
        store.dispatch(storeUserAddresses(list));
        return list;
      } else {
        DeleteFailed({ type: 'address' });
      }
    } catch (err) {
      console.log('address delete error ===>', err);
      return null;
    }
  }
  return null;
};
