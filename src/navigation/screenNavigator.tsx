import React, { useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { preLogInRoutes, screenRoutes } from '@constants';

const Stack = createStackNavigator();

export const ScreenNavigator = ({ isLoggedIn }: { isLoggedIn?: boolean }) => {
  // screenOptions={{ headerShown: false }}
  const routes = useMemo(() => {
    return isLoggedIn ? [...screenRoutes] : preLogInRoutes;
  }, [isLoggedIn]);

  return (
    <Stack.Navigator name="Main">
      {routes.map((e) => (
        <Stack.Screen {...e} />
      ))}
    </Stack.Navigator>
  );
};
