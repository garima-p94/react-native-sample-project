import axios from 'axios';
import CryptoJS from 'react-native-crypto-js';
import { apiEndPoints, urls, AUTH_TOKEN, cryptoSecretKey } from '@constants';
import { appName, appOS, buildNumber, device, deviceId, getLocalStorage, setLocalStorage } from '@utils';
import { ifExist } from '@helpers';
import { isTestMode } from './app';

const errorObj = { status: 'failed', message: 'Request failed' };
const { appUrl, devUrl } = urls;

const handelCatchError = (err) => {
  console.error(err);
  return { status: 'failed', error: err.message || 'catch error' };
};

const handleResponse = (response) => {
  const jsonPromise = response.clone().json();
  return jsonPromise
    .then((data) => data)
    .catch((err) =>
      response.text().then((text) => {
        console.error(err, text);
        return {
          statusCode: response.status || '',
          error: text,
          status: 'failed',
        };
      }),
    );
};

export const apiRequest = async ({
  body,
  endPoint,
  isDevMode = false,
  isWithAuth = false,
}: {
  body: any;
  endPoint?: typeof apiEndPoints;
  isDevMode?: boolean;
  isWithAuth?: boolean;
}) => {
  async function hitRequest() {
    const isTest = isTestMode();
    const path = ifExist(endPoint) || apiEndPoints.searchApi;
    const URL = isDevMode ? `${devUrl}${path}` : `${appUrl}${path}`;
    const params = {
      ...body,
      is_test: isTest ? '1' : '0',
      retdata: true,
      sgmobapi: true,
      app: appName,
      appbuild_no: buildNumber,
      device: device,
      device_id: deviceId,
      os: appOS,
    };
    const formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    };

    if (isWithAuth) {
      const authData = await getLocalStorage(AUTH_TOKEN);
      if (authData) {
        const accessToken = authData.split('-')[0];
        const cipherText = CryptoJS.AES.encrypt(
          accessToken,
          cryptoSecretKey,
        ).toString();
        headers['Auth-Token'] = cipherText;
      }
    }
    return fetch(URL, {
      method: 'POST',
      headers: headers,
      body: formData,
    }).then(handleResponse, handelCatchError);
  }
  const response = await hitRequest();

  if (isWithAuth) {
    if (
      response &&
      response.status === 'failed' &&
      response.access === 'token_expired'
    ) {
      const isSuccess = await refreshToken();
      if (isSuccess) {
        const data = await hitRequest();
        return data;
      }
      return errorObj;
    }
    if (
      response &&
      response.status === 'failed' &&
      response.access === 'not_authorized'
    ) {
      const isSuccess = await authLogin({ isNewToken: true });
      if (isSuccess) {
        const data = await hitRequest();
        return data;
      }
      return errorObj;
    }
  }
  return response;
};

const authLogin = ({ isNewToken }) =>
  new Promise(async (resolve) => {
    const authLoginApi = {
      type: 'login',
      token: '',
      secret: '',
    };
    const authData = await getLocalStorage(AUTH_TOKEN);
    if (!authData || !!isNewToken) {
      const response = await apiRequest({
        endPoint: apiEndPoints.auth,
        body: authLoginApi,
      });
      if (response.status === 'success' && response.data) {
        setLocalStorage(AUTH_TOKEN, response.data);
        resolve(true);
      }
    }
    resolve(false);
  });

const refreshToken = () =>
  new Promise(async (resolve) => {
    const authData = await getLocalStorage(AUTH_TOKEN);
    if (authData) {
      const refToken = authData.split('-')[1];
      const apiData = { type: 'refresh', refresh_token: refToken };
      const response = await apiRequest({
        endPoint: apiEndPoints.auth,
        body: apiData,
      });
      if (response.status === 'success' && response.data) {
        setLocalStorage(AUTH_TOKEN, response.data);
        resolve(true);
      } else {
        resolve(await authLogin({ isNewToken: true }));
      }
    } else {
      resolve(await authLogin({ isNewToken: true }));
    }
  });
