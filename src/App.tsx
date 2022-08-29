import React, { useEffect, useState, useMemo } from 'react';
import { StatusBar, LogBox } from 'react-native';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import * as Sentry from '@sentry/react-native';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { RootNavigator } from './navigation';
import { configureStore } from './store';
import { ScreenWrapper, AppLoader, FlashMessageWrapper } from '@components';
import { useCallback } from 'react';
import { getLocalStorage } from '@utils';
import {
  APP_MODE,
  appInfo,
  LAST_LOGGED_IN_USER,
  USERS_AUTH_STATUSES,
} from '@constants';
import {
  getActiveAppDetails,
  userEmailLogin,
  isAuthenticatedStatus,
} from '@services';
import { ThemeProvider } from '@context';
import { isObject, isExist, sentryMessage } from '@helpers';
import { ObjectType } from '@types';
import { storePhases } from '@constants';

LogBox.ignoreAllLogs();

if (!__DEV__) {
  Sentry.init({ dsn: '' });
}

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [isNotReady, setNotReady] = useState(false);
  const [preLoadedState, setPreLoaded] = useState({
    activeAppObject: { ...appInfo },
    isTestMode: '0',
  });

  useEffect(() => {
    preInitProcesses();
  }, []);

  const preInitProcesses = useCallback(async () => {
    let pre: ObjectType = {};
    pre.isTestMode = await getLocalStorage(APP_MODE);
    pre.activeAppObject = await getActiveAppDetails({
      params: { id: '5628' },
      inStore: false,
    });
    SplashScreen.hide();
    setPreLoaded({ ...pre });
    const last = (await getLocalStorage(LAST_LOGGED_IN_USER)) || {};
    if (isObject(last)) {
      setNotReady(true);
      const verifiedUsers = (await getLocalStorage(USERS_AUTH_STATUSES)) || {};
      if (isExist(last.id) && verifiedUsers[last.id]) {
        const postLogin = await userEmailLogin({
          params: { email: last.email, password: last.pwd },
          isNoStore: true,
        });
        if (postLogin) {
          if (
            isObject(postLogin.lastLoggedIn) &&
            isExist(postLogin.lastLoggedIn.id)
          ) {
            sentryMessage(
              `Last Login user success ${postLogin.lastLoggedIn.id}`,
            );
          }
          pre = {
            ...pre,
            ...postLogin,
            isAuthenticated: true,
            appInitalizePhase: storePhases.loading,
          };
          await isAuthenticatedStatus(true);
          setPreLoaded({ ...pre });
        }
      }
    } else {
      sentryMessage('no last logged in user');
    }
    setNotReady(false);
    setLoading(false);
  }, []);

  const configuredStore = useMemo(() => {
    return configureStore({ ...preLoadedState });
  }, [preLoadedState]);

  return (
    <Provider store={configuredStore}>
      <ThemeProvider {...preLoadedState}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <StatusBar barStyle={'dark-content'} />
          {!isLoading && (
            <ScreenWrapper>
              <RootNavigator />
            </ScreenWrapper>
          )}
          {isNotReady && <AppLoader isShow={isNotReady} />}
        </SafeAreaProvider>
        <FlashMessageWrapper />
      </ThemeProvider>
    </Provider>
  );
};

export default Sentry.wrap(App);
