import React, { useMemo, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ActivityIndicatorProps,
  RefreshControl,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { isObject } from '@helpers';
import { ThemeContext } from '@context';
import { CustomText } from './text';
import * as Images from '@assets';
import { colors, globalStyles, hp, spacing, wp } from '@styles';
import { ObjectType } from '@types';
import { Overlay } from './modals';

/*
 *
 * Spinner to show in screen loading or load more
 *
 */
interface SpinnerProps extends ActivityIndicatorProps {
  isFullScreen?: boolean;
  isWhiteBg?: boolean;
  spinColor?: string;
  isAbsolute?: boolean;
}
export const Spinner = (props: SpinnerProps) => {
  const { isFullScreen, spinColor, isWhiteBg, isAbsolute } = props;
  const { ui, loader } = useMemo(() => {
    return {
      ui: isFullScreen ? styles.screenLoader : styles.loadMore,
      loader: isFullScreen ? { marginBottom: hp(20) } : {},
    };
  }, [isFullScreen]);
  return (
    <View
      style={[
        { ...ui },
        !isWhiteBg && { backgroundColor: 'transparent' },
        isAbsolute && styles.absoluteSpinner,
      ]}>
      <ActivityIndicator
        size="large"
        color={spinColor}
        style={loader}
        {...props}
      />
    </View>
  );
};
Spinner.defaultProps = {
  isFullScreen: true,
  isWhiteBg: true,
  spinColor: colors.red,
};

/*
 *
 *
 * Spinner to show on pull down refresh
 *
 *
 */
export const RefreshLoader = (props: any) => (
  <RefreshControl
    tintColor={colors.red}
    progressBackgroundColor={colors.red}
    {...props}
  />
);
RefreshLoader.defaultProps = {
  refreshing: false,
  onRefresh: () => {},
};

/*
 *
 *
 * Global Loading screen
 *
 *
 */
export const AppLoader = ({ isShow }: ObjectType) => {
  const { activeTheme } = useContext(ThemeContext);

  const { bgColor, fontColor } = useMemo(() => {
    const isData = isObject(activeTheme.primary);
    return {
      bgColor: isData ? activeTheme.primary.bgColor : colors.white,
      fontColor: isData ? activeTheme.primary.fontColor : colors.appBlue,
    };
  }, [activeTheme]);

  return (
    <Overlay
      isVisible={isShow}
      isHeader={false}
      modalProps={{ animationType: 'none' }}>
      <View style={[styles.appLoader, { backgroundColor: bgColor }]}>
        <View style={{ flex: 0.1 }}>
          <Spinner isFullScreen={false} spinColor={fontColor} />
        </View>
        <View style={{ flex: 0.2 }}>
          <FastImage
            source={Images.appLogo}
            style={{ width: 120, height: 40 }}
          />
        </View>
        <View
          style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
          <CustomText
            text="Setting up"
            size="l"
            extraStyles={{ color: fontColor }}
          />
          <CustomText
            isHeading
            text="App"
            size="l"
            extraStyles={{ color: fontColor, margin: spacing.xs }}
          />
          <CustomText
            text="for your account"
            size="l"
            extraStyles={{ color: fontColor }}
          />
        </View>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  screenLoader: {
    height: hp(95),
    width: wp(100),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMore: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  absoluteSpinner: {
    position: 'absolute',
    top: hp(43),
    right: wp(49),
    left: 0,
    zIndex: 99,
  },
  appLoader: {
    ...globalStyles.columnCenter,
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    zIndex: 99,
    ...StyleSheet.absoluteFill,
    height: hp(100),
  },
});
