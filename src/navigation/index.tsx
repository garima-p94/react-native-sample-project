import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { ScreenNavigator } from './screenNavigator';
import { colors } from '@styles';
import { InitializeProcessProvider } from '@context';
import { useSelector } from 'react-redux';
import { getAppInitPhaseState } from '@store/App';
import { storePhases } from '@constants';
import { AppLoader } from '@components';
import { getIsUserAuthenticatedState } from '@store/User';
import { isExist } from '@helpers';

// reference: https://reactnavigation.org/docs/themes/
const defTheme = {
  ...DefaultTheme,
  colors: {
    primary: colors.appBlue,
    background: colors.white,
    card: colors.white,
    text: colors.darkGray,
    border: colors.mediumGray,
    notification: colors.red,
  },
};

export const RootNavigator = () => {
  const phase = useSelector(getAppInitPhaseState);
  const isAuthenticated = useSelector(getIsUserAuthenticatedState);
  return (
    <NavigationContainer theme={defTheme}>
      <InitializeProcessProvider isInitProcessStart={isAuthenticated}>
        {<AppLoader isShow={phase === storePhases.loading} />}
        <ScreenNavigator isLoggedIn={isAuthenticated} />
      </InitializeProcessProvider>
    </NavigationContainer>
  );
};

export { ScreenNavigator };
