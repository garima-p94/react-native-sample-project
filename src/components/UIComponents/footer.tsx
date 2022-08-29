import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { CustomText } from './text';
import { colors, globalStyles } from '@styles';
import { footerRoutes } from '@constants';

/*
 *
 * * * Tab Footer
 *
 */

export const Footer = (props: any) => {
  const { state, navigation } = props;

  const onNavigation = (e: any) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: e.key,
    });
    if (!e.isFocused && !event.defaultPrevented) {
      navigation.navigate(e.name);
    }
  };

  return (
    <View style={globalStyles.footerContainer}>
      {state.routes.map((item, index) => {
        const isFocused = state.index === index;
        const route = footerRoutes[item.name];
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => onNavigation({ ...item, ...route, isFocused })}
            style={styles.footerItem}>
            <FastImage
              style={styles.footerImage}
              source={isFocused ? route.activeImage : route.inactiveImage}
              resizeMode="contain"
            />
            <CustomText
              size="xs"
              text={route.label.toUpperCase()}
              extraStyles={{
                color: isFocused ? colors.red : colors.mediumGray,
                // bottom: spacing.xs,
              }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  footerItem: {
    flex: 0.17,
    alignItems: 'center',
  },
  footerImage: { width: '58%', height: '58%' },
});
