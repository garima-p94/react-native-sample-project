import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { getPageCollections } from '@services';
import { useSelector } from 'react-redux';
import { getAppCollectionsState } from '@store/Explore';
import {
  Collection,
  FlatListView,
  CustomText,
  Spinner,
  RefreshLoader,
} from '@components';
import { ListItemProps } from '@types';
import { spacing } from '@styles';
import {
  isNoCollectionHeading,
  momentScrollDetect,
  isExist,
  isBoolean,
} from '@helpers';

const { s, m, l, xl, xxl } = spacing;

const ExploreCrypto = () => {
  const [isLoading, setLoading] = useState(true);
  const [isRefresh, setRefresh] = useState(false);
  const collections = useSelector(getAppCollectionsState);
  const [pgnum, setPgNum] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      await getPageCollections({ params: { expset: pgnum } });
      setLoading(false);
    };
    fetch();
  }, []);

  const handleRefresh = useCallback(async () => {
    if (isRefresh) {
      return;
    }
    if (!isRefresh) {
      setRefresh(true);
      setTimeout(() => {
        setRefresh(false);
      }, 100);
      setLoading(true);
      setPgNum(1);
      await getPageCollections({ isRefresh: true });
      setLoading(false);
    }
  }, [isRefresh]);

  const onLoadMore = async (nativeEvent: any) => {
    if (collections.length > 1 && momentScrollDetect(nativeEvent)) {
      setPgNum(pgnum + 1);
      await getPageCollections({ params: { expset: pgnum + 1 } });
    }
  };

  const renderCollections = ({ item, index }: ListItemProps) => {
    const { collection, heading, subHeading } = item;
    const isNoSpacing =
      index === 0 ||
      (index !== 0 &&
        collection.tag_type === 'Explore Banner' &&
        !isBoolean(collection.banner_spacer));
    return (
      <View
        key={item.rowId}
        style={{ marginBottom: isNoSpacing ? -1 : spacing.xxl }}>
        {!isNoCollectionHeading.includes(collection.category.key) && (
          <View style={{ marginHorizontal: l, marginBottom: m }}>
            <CustomText isHeading text={heading} size="xl" />
            {isExist(subHeading) && (
              <CustomText
                text={subHeading}
                extraStyles={{ marginTop: s }}
                numberOfLines={2}
              />
            )}
          </View>
        )}
        <Collection
          list={item.objList}
          collection={{ ...collection, isNoSpacing }}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading && <Spinner isFullScreen={true} />}
      <FlatListView
        listKey="exploreList"
        data={collections}
        // style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: xxl }}
        renderItem={renderCollections}
        onMomentumScrollEnd={(e) => !isLoading && onLoadMore(e.nativeEvent)}
        // ItemSeparatorComponent={() => <View style={{ height: xxl }} />}
        ListHeaderComponent={() => (
          <CustomText
            isHeading={true}
            text="Buy Crypto"
            extraStyles={{
              paddingHorizontal: l,
              marginBottom: xl,
            }}
          />
        )}
        refreshControl={
          <RefreshLoader
            refreshing={isRefresh}
            onRefresh={() => handleRefresh()}
          />
        }
      />
    </View>
  );
};

export default ExploreCrypto;
