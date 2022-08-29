import React, { useMemo, useCallback, useContext } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { isObject, isExist } from '@helpers';
import { ThemeContext } from '@context';
import { isTestMode } from '@services';
import { VerticalDots } from './icons';
import { ButtonText, BackButton } from './buttons';
import { CustomText } from './text';
import * as Images from '@assets';
import {
  globalStyles,
  headerHeight,
  smallSlop,
  spacing,
  colors,
  hp,
} from '@styles';
import { ObjectType } from '@types';

/*
 *
 * header for tab (footer) screens
 *
 */

export const TabHeader = ({
  isShowBack,
  text,
}: {
  isShowBack?: boolean;
  text?: string;
}) => {
  const { activeTheme }: ObjectType = useContext(ThemeContext);
  const { bgColor } = useMemo(() => {
    const isData = isObject(activeTheme.header);
    return {
      bgColor: isData ? activeTheme.header.bgColor : colors.white,
      // fontColor: isData ? activeTheme.header.textColor : colors.darkGray,
    };
  }, [activeTheme]);

  return (
    <>
      <View style={[styles.tabHeader, { backgroundColor: bgColor }]}>
        {isShowBack ? <BackButton /> : <View />}
        <Pressable
          onPress={() => {}}
          disabled
          style={[globalStyles.rowSpacing, { flex: 0 }]}>
          {isExist(text) ? (
            <CustomText
              isHeading
              text={text}
              size="l1"
              extraStyles={{ bottom: 4, right: 4 }}
            />
          ) : (
            <FastImage
              source={Images.appLogo}
              style={{ width: 75, height: 40 }}
            />
          )}
        </Pressable>
        <View />
      </View>
      <TestBanner />
    </>
  );
};
TabHeader.isShowBack = {
  isShowBack: false,
  text: '',
};

/*
 *
 * header for forms, overlays etc
 *
 */
interface BaseHeaderProps {
  onClose?: () => void;
  onSubmit?: () => void;
  showClose?: boolean;
  showSubmit?: boolean;
  text?: string;
  isSubmitDisabled?: boolean;
}
export const BaseHeader = ({
  onClose,
  onSubmit,
  showClose,
  showSubmit,
  text,
  isSubmitDisabled,
}: BaseHeaderProps) => {
  const { goBack } = useNavigation();

  const onBack = useCallback(() => {
    onClose ? onClose() : goBack();
  }, [goBack, onClose]);

  const onDone = useCallback(() => {
    onSubmit && onSubmit();
    // onBack();
  }, [onSubmit, onBack]);

  return (
    <>
      <View style={[styles.tabHeader, styles.baseHeader]}>
        {showClose ? (
          <CustomText
            text="Cancel"
            onPress={() => onBack()}
            extraStyles={{ bottom: 2 }}
          />
        ) : (
          <View />
        )}
        {isExist(text) && (
          <CustomText
            text={text}
            isHeading
            size="l"
            extraStyles={{ textAlign: 'center', left: 12 }}
          />
        )}
        <View style={{ width: '18%' }}>
          {showSubmit && (
            <ButtonText
              isInactive={isSubmitDisabled}
              disabled={isSubmitDisabled}
              text="Done"
              size="s"
              onPress={() => onDone()}
              extraStyles={{ width: '100%' }}
            />
          )}
        </View>
      </View>
      <TestBanner />
    </>
  );
};
BaseHeader.defaultProps = {
  onClose: null,
  onSubmit: null,
  showClose: true,
  showSubmit: true,
  text: '',
  isSubmitDisabled: false,
};

/*
 *
 * Animated Header for all card screens
 *
 */

export const CardHeader = ({ scrollY, isAccessible, title }: any) => {
  const { goBack } = useNavigation();

  const backgroundColor = scrollY.interpolate({
    inputRange: [0, hp(30)],
    outputRange: ['transparent', colors.white],
  });
  const iconColor = scrollY.interpolate({
    inputRange: [0, hp(30)],
    outputRange: ['white', colors.darkGray],
  });

  return (
    <>
      <Animated.View style={[styles.cardHeader, { backgroundColor }]}>
        <BackButton iconColor={iconColor} />
        <View />
        <CustomText
          text={title}
          isHeading
          size="l"
          extraStyles={{ color: iconColor }}
        />
        <View style={styles.rightContainer}>
          {isAccessible && <ButtonText text="Save" size="s" />}
          <Pressable hitSlop={smallSlop}>
            <VerticalDots disabled style={{ color: iconColor }} />
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
};
CardHeader.defaultProps = {
  isAccessible: false,
  title: '',
};

/*
 *
 * Test Mode banner for headers
 *
 */

export const TestBanner = () => {
  const isTest = isTestMode();
  return isTest ? (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerTextView}>
        <CustomText
          text="TEST DATA"
          size="s"
          extraStyles={{ color: colors.white }}
        />
      </View>
    </View>
  ) : (
    <View />
  );
};

/*
 *
 * Test Mode banner for card screens
 * not used anywhere right now
 *
 */

export const CardTestBanner = () => (
  <View style={styles.previewContainer}>
    <View style={styles.preview}>
      <CustomText
        text="TEST DATA"
        isHeading={true}
        size="m"
        extraStyles={styles.previewText}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  tabHeader: {
    ...globalStyles.rowSpacing,
    flex: 0,
    width: '100%',
    height: headerHeight,
    alignItems: 'flex-end',
    paddingBottom: spacing.xs,
    paddingHorizontal: spacing.s,
    borderBottomWidth: 0.2,
    borderBottomColor: colors.mediumGray,
  },
  baseHeader: {
    paddingBottom: spacing.s,
    // paddingHorizontal: spacing.m,
    justifyContent: 'space-between',
  },
  cardHeader: {
    ...globalStyles.rowSpacing,
    top: 0,
    zIndex: 1,
    width: '100%',
    height: headerHeight,
    position: 'absolute',
    alignItems: 'flex-end',
    paddingBottom: spacing.s,
    paddingHorizontal: spacing.s,
  },
  rightContainer: {
    ...globalStyles.rowSpacing,
    flex: 0,
    width: '22%',
    justifyContent: 'flex-end',
  },
  bannerContainer: {
    position: 'relative',
    backgroundColor: 'transparent',
    zIndex: 9,
    width: 70,
    alignSelf: 'center',
  },
  bannerTextView: {
    backgroundColor: colors.appBlue,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    position: 'absolute',
    padding: 3,
    width: '100%',
  },
  previewContainer: {
    position: 'absolute',
    // top: 10,
    // right: -5,
    // paddingVertical: 20,
    width: '100%',
    zIndex: 9,
  },
  preview: {
    // top: 20,
    // right: -98,
    // transform: [{ rotate: '42deg' }],
    justifyContent: 'center',
    width: '100%',
    overflow: 'hidden',
    height: 25,
    backgroundColor: colors.appBlue,
  },
  previewText: {
    // paddingHorizontal: 88,
    // paddingVertical: 8,
    color: colors.white,
    width: '100%',
    textAlign: 'center',
  },
});
