import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import * as entities from 'entities';
import { fonts, textStyles, colors } from '@styles';
import { isExist } from '@helpers';
import { CustomStyles } from '@types';

export interface CustomTextProps extends CustomStyles {
  text?: string;
  size?: any;
  isHeading?: boolean;
  numberOfLines?: number;
  onPress?: () => void;
  isWhiteTxt?: boolean;
}

// for Heading of particular font sizes
// large (30 = xxxl), medium (20 = xl), small (16 = l)
export const CustomText = (props: CustomTextProps) => {
  const { text, size, extraStyles, isHeading, isWhiteTxt } = props;

  const textSt = useMemo(() => {
    const fontSize = isExist(size)
      ? fonts[size]
      : isHeading
      ? fonts.xxl
      : fonts.m;
    const color = isWhiteTxt ? colors.white : colors.darkGray;
    let st = isHeading
      ? { ...textStyles.heading, fontSize: fontSize }
      : { fontSize: fontSize };
    return { ...st, color };
  }, [size, isHeading, isWhiteTxt]);

  return isExist(text) ? (
    <Animated.Text
      suppressHighlighting
      style={[textSt, extraStyles]}
      {...props}>
      {text}
    </Animated.Text>
  ) : (
    <Text />
  );
};

CustomText.defaultProps = {
  size: '',
  isHeading: false,
  isWhiteTxt: false,
};

export const SeeMoreText = (props: CustomTextProps) => (
  <CustomText
    isHeading
    text="See More"
    size="s"
    {...props}
    extraStyles={{
      textAlign: 'right',
      color: colors.mediumGray,
      ...props.extraStyles,
    }}
  />
);
SeeMoreText.defaultProps = {
  extraStyles: {},
};

const measureHeightAsync = async (component) =>
  new Promise((resolve) => {
    if (component.current) {
      component.current.measure((x, y, width, height) => {
        resolve(height);
      });
    } else {
      resolve(0);
    }
  });

const nextFrameAsync = async () =>
  new Promise((resolve) => requestAnimationFrame(() => resolve()));

const useIsMounted = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);
  return isMounted;
};

interface ReadMoreProps extends CustomStyles {
  children: string;
  onReady?: () => {};
  isEnabled?: boolean;
  numberOfLines: number;
}

export const ReadMore = ({
  numberOfLines,
  children,
  onReady,
  textStyles,
  isEnabled,
  extraStyles,
}: ReadMoreProps) => {
  const [measured, setMeasured] = useState(false);
  const [showAllText, setShowAllText] = useState(false);
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);

  const textRef = useRef(null);

  const isMounted = useIsMounted();

  useLayoutEffect(() => {
    const measure = async () => {
      await nextFrameAsync();
      if (!isMounted.current) {
        return;
      }
      const fullHeight = await measureHeightAsync(textRef);
      setMeasured(true);
      await nextFrameAsync();
      if (!isMounted.current) {
        return;
      }
      const limitedHeight = await measureHeightAsync(textRef);
      if (fullHeight > limitedHeight) {
        setShouldShowReadMore(true);
      } else {
        onReady && onReady();
      }
    };
    measure();
  }, [children, isMounted, onReady]);

  useEffect(() => {
    onReady && onReady();
  }, [onReady, shouldShowReadMore]);

  const maybeRenderReadMore = () => {
    if (shouldShowReadMore && !showAllText) {
      return (
        <Text
          style={[styles.readMoreLessText, textStyles]}
          onPress={() => setShowAllText(true)}>
          Read more
        </Text>
      );
    } else if (shouldShowReadMore && showAllText) {
      return (
        <Text
          style={[styles.readMoreLessText, textStyles]}
          onPress={() => setShowAllText(false)}>
          Read less
        </Text>
      );
    }
  };

  return (
    <View style={[{ width: '100%' }, extraStyles]}>
      <View style={{ opacity: 0, position: 'absolute' }}>
        <Text
          style={[styles.detailsText, textStyles]}
          numberOfLines={measured ? numberOfLines : 0}
          ref={textRef}>
          {entities.decodeHTML(children)}
        </Text>
      </View>
      <Text
        style={[styles.detailsText, textStyles]}
        numberOfLines={showAllText ? 0 : numberOfLines}>
        {entities.decodeHTML(children)}
      </Text>
      {isExist(children) && isEnabled && maybeRenderReadMore()}
    </View>
  );
};

ReadMore.defaultProps = {
  children: '',
  numberOfLines: 3,
  onReady: () => {},
  textStyles: {},
  extraStyles: {},
  isEnabled: true,
};

const styles = StyleSheet.create({
  detailsText: {
    fontSize: 14,
    fontFamily: 'System',
    color: colors.mediumGray,
  },
  readMoreLessText: {
    color: colors.darkGray,
    fontWeight: '700',
  },
});
