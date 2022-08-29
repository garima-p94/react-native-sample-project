import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Footer, TabHeader } from '@components';
import { footerRoutes } from '@constants';

const Tab = createBottomTabNavigator();

/*
 *
 * * * Footer Navigator
 *
 */

export const AppNavigator = () => (
  <Tab.Navigator
    // backBehavior
    // initialRouteName={screens.portfolio}
    screenOptions={{
      // title: 'App',
      header: () => <TabHeader />,
    }}
    tabBar={(props) => <Footer {...props} />}>
    {Object.keys(footerRoutes).map((key) => {
      const route = footerRoutes[key];
      return <Tab.Screen key={key} name={key} component={route.component} />;
    })}
  </Tab.Navigator>
);
