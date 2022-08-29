import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ImageObject } from './objects';
import { globalStyles, spacing, colors } from '@styles';
import { ObjectType, ListItemProps, ListProps } from '@types';
import { CustomText, FlatListView } from '../UIComponents';
import { paymentCardImages } from '@constants';
import { getAddressFormat, isExist, ifExist } from '@helpers';

export const UserDetails = ({
  user,
  isDisabled,
  extraStyles,
  imagePrefix,
}: ObjectType) => {
  const userImage = useMemo(() => {
    let i = '';
    if (isExist(imagePrefix)) {
      i =
        ifExist(user[`${imagePrefix}_image_url_small`]) ||
        ifExist(user[`${imagePrefix}_image_url_medium`]) ||
        ifExist(user[`${imagePrefix}_image_url_large`]);
    }
    return i;
  }, [imagePrefix, user]);
  return (
    <TouchableOpacity
      disabled={isDisabled}
      onPress={() => {}}
      style={[styles.userImage, extraStyles]}>
      <ImageObject
        object={{ ...user, objectType: 'User' }}
        uiType="round"
        image={userImage}
        isClickable={false}
        extraStyles={{ width: '15%' }}
      />
      <CustomText
        text={user.uname || user.name}
        isHeading
        size="m"
        extraStyles={{ marginLeft: spacing.s }}
      />
    </TouchableOpacity>
  );
};
UserDetails.defaultProps = {
  isDisabled: true,
};

interface List extends ListProps {
  list: Array<{ display: string }>;
  listProps?: object;
  isModify?: boolean;
  onModify?: (e: object) => void;
}
export const PaymentCards = React.memo(
  ({ list, isModify, listProps, onModify }: List) => {
    const renderCards = ({ item }: ListItemProps) => (
      <TouchableOpacity disabled key={item.id} style={styles.cardContainer}>
        <ImageObject
          isUri={false}
          isClickable={false}
          object={item}
          image={paymentCardImages[item.brand]}
          extraStyles={styles.cardImage}
        />
        <View style={{ width: '50%' }}>
          <CustomText isHeading text={item.brand} size="l" />
          <CustomText
            text={`***** ${item.last4}`}
            isHeading
            size="m"
            extraStyles={{
              marginVertical: spacing.s,
              color: colors.mediumGray,
            }}
          />
          <CustomText
            size="m"
            text={`Expires ${item.exp_month}/${item.exp_year} `}
            extraStyles={{ color: colors.mediumGray }}
          />
          {isModify && (
            <CustomText
              text="Delete"
              extraStyles={{ color: colors.appBlue, marginTop: spacing.s }}
              onPress={() => onModify && onModify({ card: item })}
            />
          )}
        </View>
      </TouchableOpacity>
    );
    return (
      <FlatListView
        vertical
        data={list}
        renderItem={renderCards}
        {...listProps}
      />
    );
  },
);

export const UserAddresses = React.memo(
  ({ list, isModify, listProps, onModify }: List) => {
    const renderAddresses = useCallback(
      ({ item }: ListItemProps) => (
        <TouchableOpacity disabled key={item.id} style={styles.section}>
          <CustomText isHeading text={item.name} size="l" />
          <CustomText
            text={getAddressFormat({ item })}
            numberOfLines={3}
            extraStyles={{ marginTop: spacing.xs }}
          />
          {isModify && (
            <View style={styles.addressesEdit}>
              <CustomText
                text="Edit"
                extraStyles={{ color: colors.appBlue }}
                onPress={() =>
                  onModify && onModify({ action: 'edit', address: item })
                }
              />
              <CustomText
                text="Delete"
                extraStyles={{ color: colors.appBlue }}
                onPress={() =>
                  onModify && onModify({ action: 'delete', address: item })
                }
              />
            </View>
          )}
        </TouchableOpacity>
      ),
      [isModify, onModify],
    );
    return (
      <FlatListView
        vertical
        data={list}
        renderItem={renderAddresses}
        {...listProps}
      />
    );
  },
);

const styles = StyleSheet.create({
  cardContainer: {
    ...globalStyles.rowSpacing,
    ...globalStyles.shadowContainer,
    borderRadius: 5,
    justifyContent: 'space-around',
    paddingVertical: spacing.l,
    paddingHorizontal: 0,
    marginTop: spacing.l,
    alignSelf: 'center',
    width: '90%',
  },
  section: {
    ...globalStyles.shadowContainer,
    borderRadius: 5,
    paddingVertical: spacing.l,
    paddingHorizontal: spacing.l,
    marginTop: spacing.l,
    alignSelf: 'center',
    width: '90%',
  },
  addressesEdit: {
    ...globalStyles.rowSpacing,
    width: '27%',
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  cardImage: {
    width: '35%',
    aspectRatio: 1.3,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  userImage: {
    ...globalStyles.rowSpacing,
    width: '100%',
    justifyContent: 'flex-start',
  },
});
