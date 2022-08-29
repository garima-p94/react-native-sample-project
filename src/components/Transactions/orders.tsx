import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import {
  isExist,
  ifExist,
  toSentenceCase,
  toDollars,
  isRallyUser,
  getCustomerInfo,
} from '@helpers';
import {
  FlatListView,
  CustomText,
  Line,
  SeeMoreText,
  TransactionStatus,
} from '../UIComponents';
import { CategoryType } from '../AppObjects';
import { ObjectType, ListItemProps } from '@types';
import { colors, globalStyles, spacing } from '@styles';
import { toCoinFormat } from '../../helpers/basic';

export const OrdersList = ({
  orders,
  extraFlatListProps,
  containerStyle,
  isDisabled,
  showBottomSeeMore,
  handleShowAll,
  hideDefaultLineBreak,
  customClicks,
  onNavigationBack,
  isAdmin,
  showCustomer,
  showCryptoAmt, // only true in case of token transactions screen.
  tokenId,
}: ObjectType) => {
  // renderItems
  const { navigate } = useNavigation();

  const handleClick = (orderItem: ObjectType) => {
    // customClicks && customClicks(orderItem);
    // navigate('PurchaseDetails', { orderItem });
    // navigate('OrderDetails', {
    //   orderItem,
    //   onNavigationBack,
    //   isAdmin,
    //   tokenId,
    // });
  };

  const renderOrders = ({ item, index }: ListItemProps) => {
    const isCrypto =
      isExist(item.parent_category_id) && item.parent_category_id === '16312';
    const isTransaction =
      isExist(item.cr_token_id) && isExist(item.transaction_type);
    const isConvert =
      isCrypto &&
      isTransaction &&
      item.transaction_type === 'convert' &&
      isExist(item.convert_type);
    const showCrypto =
      showCryptoAmt ||
      (!isCrypto && isExist(item.cr_token_id)) ||
      (isCrypto && isConvert);

    let orderAmt = toDollars(item.order_amount);
    let secondaryAmt = '';
    let middeRowLabel = isExist(item.product_name) ? item.product_name : '';
    const isCoverCheck = showCrypto && isConvert;
    if (showCrypto) {
      // show tokens instead of dollars
      let primaryToken = isExist(item.no_of_coins)
        ? parseFloat(item.no_of_coins)
        : 0;
      orderAmt = `${toCoinFormat({ value: primaryToken, coinObj: item })}`;
      if (isConvert) {
        middeRowLabel = `${item.from_cr_token_symbol} to ${item.cr_token_symbol}`;
        primaryToken = isExist(item.from_no_of_coins)
          ? parseFloat(item.from_no_of_coins)
          : 0;
        orderAmt = `${toCoinFormat({
          value: primaryToken,
          symbol: item.from_cr_token_symbol,
        })}`;
        const secondaryToken = isExist(item.no_of_coins)
          ? parseFloat(item.no_of_coins)
          : 0;
        secondaryAmt = `${toCoinFormat({
          value: secondaryToken,
          coinObj: item,
        })}`;
        // }
      }
    }
    let middleText = isTransaction
      ? toSentenceCase(item.transaction_type)
      : null;
    if (!middleText) {
      middleText = isExist(item.campaign_name) ? item.campaign_name : '';
    }

    const customer = getCustomerInfo(item);

    return (
      <>
        <TouchableOpacity
          key={index}
          disabled={isDisabled}
          style={[styles.container, containerStyle]}
          onPress={() => handleClick(item)}>
          <View style={styles.flexHorizontal}>
            <CategoryType text={item.id} extraStyles={styles.itemId} />
            <CustomText
              text={middleText ? middleText : ''}
              extraStyles={[
                styles.campaignName,
                isTransaction && { width: '20%' },
              ]}
            />
            <CustomText
              isHeading
              text={orderAmt}
              size="m"
              extraStyles={[
                styles.orderAmount,
                isTransaction && { width: '50%' },
                isCoverCheck && { color: colors.darkGray },
              ]}
            />
          </View>
          <View style={styles.flexHorizontal}>
            {(isExist(item.parent_category_display) || isExist(item.type)) && (
              <CustomText
                isHeading
                size="m"
                numberOfLines={1}
                text={
                  ifExist(item.parent_category_display) ||
                  toSentenceCase(item.type) ||
                  ''
                }
                extraStyles={styles.donationType}
              />
            )}
            {isExist(middeRowLabel) && (
              <CustomText
                text={middeRowLabel}
                extraStyles={{
                  textAlign: 'left',
                  width: isConvert ? '38%' : '70%',
                }}
              />
            )}
            {isConvert && (
              <CustomText
                isHeading
                text={secondaryAmt}
                size="m"
                extraStyles={[
                  styles.orderAmount,
                  { width: '32%', color: colors.darkGray },
                  isCoverCheck && { color: colors.appBlue },
                ]}
              />
            )}
          </View>
          <View style={[styles.flexHorizontal, { alignItems: 'center' }]}>
            <View style={{ width: '30%' }}>
              <TransactionStatus
                status={item.order_status}
                extraStyles={{ width: '90%' }}
              />
            </View>
            <View style={{ width: '36%' }}>
              <CustomText
                size="s"
                text={
                  showCustomer && !isRallyUser(customer) ? customer.name : ''
                }
              />
            </View>
            <View style={{ width: '34%' }}>
              {isExist(item.order_date) && (
                <CustomText
                  text={moment(item.order_date).format('MMM Do, hh:mm A')}
                  size="xs"
                  extraStyles={{ textAlign: 'right' }}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
        {!hideDefaultLineBreak && <Line />}
      </>
    );
  };

  return (
    <>
      <FlatListView
        data={orders}
        renderItem={renderOrders}
        {...extraFlatListProps}
      />
      {showBottomSeeMore && (
        <SeeMoreText
          extraStyles={{ marginTop: 10 }}
          onPress={() => handleShowAll()}
        />
      )}
    </>
  );
};

OrdersList.defaultProps = {
  orders: [],
  extraFlatListProps: {},
  containerStyle: {},
  isDisabled: false,
  showBottomSeeMore: false,
  hideDefaultLineBreak: false,
  handleShowAll: () => {},
  customClicks: null,
  onNavigationBack: null,
  isAdmin: false,
  showCustomer: true,
  showCryptoAmt: false,
  tokenId: '',
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.m,
    paddingBottom: spacing.s,
  },
  flexHorizontal: {
    marginBottom: 10,
    width: '100%',
    ...globalStyles.rowSpacing,
  },
  donationView: {
    flexDirection: 'row',
    width: '100%',
  },
  orderAmount: {
    color: colors.appBlue,
    width: '25%',
    textAlign: 'right',
  },
  statusContainer: {
    marginTop: 10,
    width: '100%',
    ...globalStyles.rowSpacing,
  },
  donationType: {
    width: '29%',
    textAlign: 'left',
  },
  amountView: {
    width: '30%',
    alignItems: 'flex-end',
  },
  itemId: { width: '30%', color: colors.appBlue },
  campaignName: {
    fontWeight: '700',
    width: '45%',
  },
  orderInfoView: {
    width: '54%',
    paddingVertical: 2,
  },
  productObj: {
    width: '30%',
    aspectRatio: 0.77,
    borderRadius: 10,
  },
  discoverText: {
    color: colors.lightGray,
    fontWeight: '700',
    marginTop: 40,
  },
});
