import React, { useState, useContext } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { ThemeContext } from '@context';
import FlashMessage from '../FlashAlert';
import { colors, globalStyles, spacing } from '@styles';
import { CustomStyles } from '@types';
import * as Images from '@assets';
import { isIOS } from '@utils';
import { BackButton } from '@components';

/*
 *
 * Contains components applicable globally on all screens
 *
 */

/*
 * Screen wrapper with safeare for handling notches & all
 * disabled handling notch (top, bottom) - done manually
 */
export const ScreenWrapper = (props: any) => {
  const { children } = props;
  const { activeTheme } = useContext(ThemeContext);
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: activeTheme.header.bgColor },
      ]}
      edges={['left', 'right']}>
      {children}
    </SafeAreaView>
  );
};
ScreenWrapper.defaultProps = {
  isHorizontalPadding: true,
};
/* <KeyboardAvoidingView
      behavior={isAndroid ? 'height' : 'padding'}
      style={{ flex: 1 }}
      enabled> </KeyboardAvoidingView> */

export const FlashMessageWrapper = ({}) => {
  const [isInitComplete, setInitComplete] = useState(false);
  // const netInfo = useNetInfo();
  // useEffect(() => {
  //   if (!isInitComplete) {
  //     NetInfo.fetch().then((state) => {
  //       if (!state.isConnected) {
  //         showNetworkAlert();
  //       }
  //     });
  //     setInitComplete(true);
  //   } else if (!netInfo.isConnected) {
  //     showNetworkAlert();
  //   }
  // }, [netInfo]);

  // const showNetworkAlert = () => {
  //   showMessage({
  //     message: 'Could not connect to the Internet. Please check your network',
  //     type: 'danger',
  //     icon: 'danger',
  //     duration: 3000,
  //   });
  // };
  return <FlashMessage position="top" />;
};

export const InitLogo = ({ isBack }: { isBack?: boolean }) => (
  <View style={styles.initLogo}>
    {isBack && <BackButton iconColor={colors.white} />}
    <FastImage
      source={Images.appWhiteLogo}
      style={{ width: 120, height: 70 }}
    />
    <View />
  </View>
);

/* Line as separator between elements */
export const Line = (e: CustomStyles) => (
  <View style={[styles.line, e.extraStyles]} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  initLogo: {
    ...globalStyles.rowSpacing,
    paddingHorizontal: spacing.m,
    flex: 0.22,
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: colors.lightGray,
  },
});
