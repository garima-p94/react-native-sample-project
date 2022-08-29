import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { isBoolean, isBannerImage } from '@helpers';
import { FlatListView } from '@components';
import {
  BannerObject,
  PostItem,
  CollectionObject,
  AboutCollection,
  ExperienceItem,
  ChannelItem,
} from '../AppObjects';
import { ListProps, ListItemProps, ObjectType } from '@types';
import { spacing, colors, wp } from '@styles';
import { objectKeys, PostTypes } from '@constants';

interface CollectionProps extends ListProps {
  collection: ObjectType;
}

export const Collection = ({ list, collection }: CollectionProps) => {
  const {
    layoutType,
    isSingleRow,
    isSingleRowItem,
    displayUI,
    category,
    isNoSpacing,
  } = useMemo(() => {
    return {
      layoutType: collection.channel_list_ui_type,
      isSingleRow: isBoolean(collection.rows_in_listing),
      isSingleRowItem: isBoolean(collection.items_in_listing),
      ...collection,
    };
  }, [collection]);

  const { horizontal, listProps, itemStyles } = useMemo(() => {
    const isHorizontal = isSingleRow;
    const numColumns = isHorizontal ? null : displayUI.minColumns || null;
    return {
      horizontal: isHorizontal,
      itemStyles: {
        marginRight: isHorizontal ? spacing.m : 0,
        marginBottom: isNoSpacing ? 0 : spacing.s,
      },
      listProps: {
        horizontal: isHorizontal,
        numColumns,
        style: {
          paddingHorizontal:
            collection.tag_type === 'Explore About Selection' ? 0 : spacing.l,
        },
        columnWrapperStyle:
          isHorizontal || numColumns <= 1
            ? null
            : { justifyContent: 'space-between' },
      },
    };
  }, [isSingleRow, displayUI, isNoSpacing]);

  const renderCollections = ({ item, index }: ListItemProps) => {
    const layout = !horizontal
      ? { ...displayUI, ...displayUI.multiColumns }
      : { ...displayUI };
    const isSingleItem =
      isSingleRowItem && list.length === 1
        ? { width: wp(90), aspectRatio: 1.38 }
        : {};
    const details = {
      object: { ...item },
      layoutType,
      objectType: category.key,
      layoutUI: { ...layout, ...isSingleItem },
    };
    return (
      <View key={index} style={itemStyles}>
        {category.key === objectKeys.banner && isBannerImage(item) && (
          <BannerObject {...details} />
        )}
        {PostTypes.includes(category.key) && <PostItem {...details} />}
        {category.key === objectKeys.collections && (
          <CollectionObject {...details} />
        )}
        {category.key === objectKeys.about && <AboutCollection {...details} />}
        {category.key === objectKeys.event && <ExperienceItem {...details} />}
        {category.key === objectKeys.channel && <ChannelItem {...details} />}
      </View>
    );
  };
  return collection.isCarousal ? (
    <Carousel
      sliderWidth={wp(100)}
      autoplayDelay={3000}
      loop
      activeSlideAlignment="center" // isModify ? 'start' :
      firstItem={0}
      inactiveSlideOpacity={0}
      itemWidth={displayUI.width}
      autoplay={true}
      data={list}
      renderItem={renderCollections}
    />
  ) : (
    <FlatListView
      horizontal={isBoolean(collection.rows_in_listing)}
      data={list}
      renderItem={renderCollections}
      scrollEnabled={list.length > 1}
      {...listProps}
    />
  );
};

const styles = StyleSheet.create({
  aboutContainer: {
    backgroundColor: colors.black,
    paddingVertical: 20,
    width: wp(100),
  },
});
