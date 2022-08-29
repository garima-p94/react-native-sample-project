import AsyncStorage from '@react-native-async-storage/async-storage';
import { LAST_LOGGED_IN_USER } from '@constants';

export const getLocalStorage = async (key: string) => {
  if (key) {
    const result = await AsyncStorage.getItem(key);
    if (result) {
      return JSON.parse(result);
    }
    return null;
  }
  return null;
};

export const setLocalStorage = async (key: string, data = '') => {
  if (key) {
    const result = AsyncStorage.setItem(key, JSON.stringify(data));
    return !!result;
  }
  return null;
};

export const clearAllLocalStorage = async () => {
  try {
    await AsyncStorage.removeItem(LAST_LOGGED_IN_USER);
  } catch (e) {
    // remove error
    console.log('asyncstorage error', e);
  }
};
