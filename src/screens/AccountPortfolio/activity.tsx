import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { getGlobalCryptoActivityState } from '@store/Orders';
import { isArray, toSentenceCase, ifExist } from '@helpers';
import { FlatListView, CustomText, SeeMoreText } from '@components';
import { spacing, colors, globalStyles } from '@styles';

export const Activity = React.memo(({ isSeeMore }: { isSeeMore?: boolean }) => {
  const { navigate } = useNavigation();
  const activity = useSelector(getGlobalCryptoActivityState);

  const onShowAll = () => {
    navigate('ShowAllAssets', { type: 'Activity' });
  };

  const renderActivity = useCallback(({ item }) => {
    return (
      <View key={item.id} style={styles.activityBlock}>
        <View style={styles.activityImg}>
          <FastImage
            source={{
              uri:
                ifExist(item.wallet_provider_image_url_small) ||
                ifExist(item.wallet_provider_image_url_medium) ||
                ifExist(item.wallet_provider_image_url_large) ||
                '',
            }}
            style={styles.image}
          />
        </View>
        <View style={styles.activityDetails}>
          <CustomText
            size="l"
            isHeading
            text={toSentenceCase(item.transaction_type)}
          />
          <CustomText
            size="m"
            isHeading
            text={item.type}
            extraStyles={{ marginTop: spacing.s, color: colors.mediumGray }}
          />
          <View
            style={[
              styles.activityBlock,
              { paddingHorizontal: 0, marginTop: spacing.s },
            ]}>
            <CustomText
              size="m"
              text={moment(item.order_date).format('MMM Do, hh:mm A')}
            />
            <CustomText size="m" text={`Order # ${item.id}`} />
          </View>
        </View>
      </View>
    );
  }, []);

  return isArray(activity) ? (
    <>
      <FlatListView
        listKey="activity"
        data={isSeeMore ? activity.slice(0, 4) : activity}
        style={{ flex: 1, marginBottom: spacing.m }}
        renderItem={renderActivity}
        onEndReachedThreshold={0.5}
      />
      {isSeeMore && activity.length > 4 && (
        <SeeMoreText
          extraStyles={{ paddingHorizontal: spacing.m }}
          onPress={() => onShowAll()}
        />
      )}
    </>
  ) : (
    <View />
  );
});

const styles = StyleSheet.create({
  activityBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.l,
    marginTop: spacing.m,
  },
  activityImg: {
    ...globalStyles.shadowContainer,
    width: '18%',
    aspectRatio: 0.7,
    borderRadius: 7,
  },
  activityDetails: {
    width: '78%',
    marginVertical: spacing.s,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 7,
  },
});
