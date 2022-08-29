import React, { useMemo, useCallback } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import {
  isExist,
  toCoinFormat,
  isArray,
  toDollars,
  ifExist,
  getCustomerInfo,
  isRallyUser,
  toSentenceCase,
} from '@helpers';
import { CustomText, Line, TransactionStatus } from '../UIComponents';
import { CategoryType } from '../AppObjects';
import { ObjectType, ListItemProps } from '@types';
import { colors } from '@styles';
import { FlatListView } from '@components';

const { appBlue, mediumGray, lightGray, red } = colors;

export const PaymentsList = ({
  payments,
  extraFlatListProps,
  containerStyle,
  isDisabled,
  customClicks,
  showCryptoAmt,
}: ObjectType) => {

  const { navigate } = useNavigation();
  // renderItems
  const handlePayments = (payment: ObjectType) => {
    if (customClicks) {
      customClicks(payment);
    }
    navigate('PaymentCard', { payment });
  };

  const renderPayments = ({ item, index }: ListItemProps) => {
    const isCrypto =
      isExist(item.parent_category_id) && item.parent_category_id === '16312';
    const showCrypto = !isCrypto && isExist(item.cr_token_id); // showCryptoAmt ||
    let orderAmt = toDollars(item.order_amount);
    if (showCrypto) {
      // show tokens instead of dollars
      const tokens = isExist(item.no_of_coins)
        ? parseFloat(item.no_of_coins)
        : 0;
      orderAmt = `${toCoinFormat({ value: tokens, coinObj: item })}`;
    }
    const isTransaction =
      isExist(item.cr_token_id) && isExist(item.transaction_type);
    let middleText = isTransaction
      ? toSentenceCase(item.transaction_type)
      : null;
    if (!middleText) {
      middleText = isExist(item.campaign) ? item.campaign : '';
    }
    const custData = getCustomerInfo(item);
    return (
      <>
        <TouchableOpacity
          key={index}
          style={[{ paddingVertical: 10 }, containerStyle]}
          onPress={() => handlePayments(item)}>
          <View style={styles.flexHorizontal}>
            <CategoryType text={item.id} extraStyles={styles.itemId} />
            <CustomText
              text={middleText ? middleText : ''}
              numberOfLines={1}
              extraStyles={[
                styles.campaignName,
                isTransaction && { width: '20%' },
              ]}
            />
            <CustomText
              size="m"
              isHeading
              text={orderAmt}
              extraStyles={[styles.amount, isTransaction && { width: '50%' }]}
            />
          </View>
          <View style={styles.flexHorizontal}>
            {(isExist(item.type) || isExist(item.parent_category_display)) && (
              <CustomText
                isHeading
                size="m"
                text={
                  ifExist(item.parent_category_display) ||
                  ifExist(item.type) ||
                  ''
                }
                extraStyles={styles.donationType}
              />
            )}
            {isExist(item.product_name) && (
              <CustomText
                text={item.product_name}
                extraStyles={{ textAlign: 'left', width: '70%' }}
                numberOfLines={1}
              />
            )}
          </View>
          <View style={styles.flexHorizontal}>
            <View style={{ width: '30%' }}>
              <TransactionStatus
                status={item.payment_status}
                extraStyles={{ width: '90%' }}
              />
            </View>
            <View style={{ width: '36%' }}>
              <CustomText
                text={!isRallyUser(custData) ? custData.name : ''}
                size="m"
                extraStyles={{ fontSize: 13 }}
                numberOfLines={1}
              />
            </View>
            <View style={{ width: '34%' }}>
              {isExist(item.payment_date) && (
                <CustomText
                  text={moment(item.payment_date).format('MMM Do, hh:mm A')}
                  size="s"
                  extraStyles={{
                    color: mediumGray,
                    textAlign: 'right',
                  }}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
        <Line />
      </>
    );
  };

  return (
    <FlatListView
      data={payments}
      renderItem={renderPayments}
      {...extraFlatListProps}
    />
  );
};
PaymentsList.defaultProps = {
  payments: [],
  extraFlatListProps: {},
  containerStyle: {},
  isDisabled: true,
  customClicks: null,
  showCryptoAmt: false,
};

const styles = StyleSheet.create({
  categoryText: {
    fontSize: 12,
    color: red,
    marginVertical: 5,
  },
  backButton: {
    height: 45,
    alignSelf: 'center',
    paddingLeft: 10,
    top: 5,
  },
  youtubePlay: {
    width: 65,
    height: 46.42,
    bottom: 80,
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 99,
    opacity: 0.9,
  },
  videoPlay: {
    height: 50,
    width: 50,
    bottom: 80,
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 99,
    opacity: 0.7,
  },
  campaignImgView: {
    width: '100%',
    borderRadius: 10,
    aspectRatio: 1.3,
    backgroundColor: lightGray,
  },
  campaignImg: {
    height: '100%',
    width: '100%',
    borderRadius: 10,
    backgroundColor: lightGray,
  },
  commonObject: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: lightGray,
  },
  commonImgStyles: {
    width: '100%',
    height: '100%',
    backgroundColor: lightGray,
  },
  // transaction list
  flexHorizontal: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  donationType: {
    width: '30%',
    textAlign: 'left',
  },
  itemId: { width: '30%', color: appBlue, marginVertical: 0 },
  campaignName: {
    color: mediumGray,
    fontWeight: '700',
    width: '45%',
  },
  amount: {
    // fontSize: 15,
    color: appBlue,
    width: '25%',
    textAlign: 'right',
  },
});
