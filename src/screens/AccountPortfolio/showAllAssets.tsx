import React, { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getGlobalCryptoActivityPageState } from '@store/Orders';
import { getAccountPortfolioList, getGlobalCryptoActivity } from '@services';
import { SectionListView, CustomText, Spinner, NftList } from '@components';
import { Assets } from './assets';
import { Activity } from './activity';
import { globalStyles, spacing, colors } from '@styles';
import { ObjectType } from '@types';
import { useSelector } from 'react-redux';

const { m, l, xl } = spacing;

const ShowAllAssets = React.memo(() => {
  const routes: ObjectType = useRoute();
  const type = routes.params?.type ?? '';
  const activityPage: number = useSelector(getGlobalCryptoActivityPageState);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const sections = useMemo(() => {
    return [{ title: type, data: [type] }];
  }, [type]);

  const handleRefresh = useCallback(async () => {
    if (isRefresh) {
      return;
    }
    setIsRefresh(true);
    setIsLoading(true);
    setIsRefresh(false);
    if (type === 'Activity') {
      await getGlobalCryptoActivity({ isRefresh: true, params: { page: 1 } });
      setIsLoading(false);
    }
  }, [type, isRefresh]);

  const onLoadMore = useCallback(async () => {
    const pgnum = activityPage + 1;
    if (
      !isLoader &&
      type === 'Activity' &&
      activityPage < pgnum &&
      activityPage !== pgnum
    ) {
      setIsLoader(true);
      await getGlobalCryptoActivity({ params: { page: pgnum } });
      setIsLoader(false);
    }
  }, [type, activityPage, isLoader]);

  return (
    <View style={{ flex: 1 }}>
      {isLoading && <Spinner />}
      {!isLoading && (
        <SectionListView
          sections={sections}
          contentContainerStyle={styles.container}
          refreshing={isRefresh}
          onRefresh={() => handleRefresh()}
          onEndReachedThreshold={0.5}
          onEndReached={() => onLoadMore()}
          renderSectionHeader={() => (
            <CustomText
              isHeading
              text={type}
              extraStyles={{ paddingHorizontal: l }}
            />
          )}
          renderItem={() => (
            <View style={{ marginTop: xl }}>
              {type === 'Activity' ? (
                <Activity />
              ) : type === 'NFTs' ? (
                <NftList
                  isHorizontal={false}
                  isShowEdition
                  {...routes.params}
                />
              ) : (
                <Assets isShowAll={true} {...routes.params} />
              )}
              {isLoader && <Spinner isFullScreen={false} />}
              {/* providerId, type -> props of <Assets /> */}
            </View>
          )}
        />
      )}
    </View>
  );
});

export default ShowAllAssets;

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
  },
  coinsContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: m,
    marginTop: l,
  },
  flexRow: {
    ...globalStyles.rowCenter,
    justifyContent: 'space-between',
    width: '98%',
    // marginTop: s,
    alignSelf: 'center',
  },
  assetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '99%',
    marginTop: m,
  },
  rightText: {
    width: '40%',
    color: colors.appBlue,
    textAlign: 'right',
  },
});
