import React from 'react';
import { ViewStyle, StyleProp, Animated, SectionList } from 'react-native';
import { RefreshLoader } from '@components';

interface ScrollListProps {
  children: JSX.Element | JSX.Element[];
  style?: StyleProp<ViewStyle>;
  // React.CSSProperties
}

export const ScrollViewList = (props: ScrollListProps) => (
  <Animated.ScrollView
    horizontal={false}
    showsHorizontalScrollIndicator={false}
    showsVerticalScrollIndicator={false}
    scrollEventThrottle={16}
    {...props}>
    {props.children}
  </Animated.ScrollView>
);

export const FlatListView = (props: any) => (
  <Animated.FlatList
    vertical
    showsHorizontalScrollIndicator={false}
    showsVerticalScrollIndicator={false}
    scrollEventThrottle={16}
    keyExtractor={(item, index) => index.toString()}
    keyboardShouldPersistTaps="handled"
    {...props}
  />
);

export const SectionListView = (props: any) => {
  const { refreshing, onRefresh } = props;
  return (
    <SectionList
      keyExtractor={(item, index) => item + index}
      stickySectionHeadersEnabled={false}
      refreshControl={
        <RefreshLoader refreshing={refreshing} onRefresh={() => onRefresh()} />
      }
      {...props}
    />
  );
};
SectionListView.defaultProps = {
  refreshing: false,
  onRefresh: () => {},
};
