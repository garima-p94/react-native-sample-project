import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { isExist, isObject, isArray, toDollars, ifExist } from '@helpers';
// getOrderFilteredData, handleChannelObject
import {
  Spinner,
  Line,
  BaseHeader,
  TransactionStatus,
  CustomText,
  UserDetails,
} from '@components';
import { getOrderDetails } from '@services';
import { globalStyles, spacing } from '@styles';
import { ObjectType } from '@types';

const PurchaseDetails = () => {
  // const { navigate, push } = useNavigation();
  const routes: ObjectType = useRoute();

  const orderItem = useMemo(() => {
    return routes.params?.orderItem ?? {};
  }, [routes]);
  // const tokenId = routes.params?.tokenId ?? '';
  // const onNavigationBack = routes.params?.onNavigationBack ?? null;

  const [isLoading, setLoading] = useState(true);
  const [orderObject, setOrderObject] = useState<ObjectType>({});

  const showPaymentInfo =
    isObject(orderObject) &&
    (isObject(orderObject.detailsJson) || !orderObject.isCryptoPayment);

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrderDetails = useCallback(
    async (order?: ObjectType) => {
      const orderInfo = order || orderItem;
      if (isObject(orderInfo) && isExist(orderInfo.id)) {
        const details = await getOrderDetails({
          params: {
            id: orderInfo.id,
            is_crypto_txn: ifExist(orderInfo.is_crypto_txn) || '',
          },
        });
        setOrderObject(details);
      }
      setLoading(false);
    },
    [orderItem],
  );

  return (
    <View style={{ paddingVertical: spacing.xl, flex: 1 }}>
      {isLoading && <Spinner />}
      {!isLoading && isObject(orderObject) && (
        <View style={{ paddingBottom: 20, flex: 1 }}>
          <View style={{ paddingHorizontal: 15, marginBottom: 20 }}>
            {/* 28 */}
            <CustomText text="Order" isHeading size="xl" />

            {!orderObject.isCryptoPayment && (
              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                {/* fontSize: 18 */}
                <CustomText
                  text="Total:"
                  size="m"
                  extraStyles={{ width: '40%' }}
                />
                <CustomText
                  text={orderObject.totalOrderAmount}
                  size="m"
                  extraStyles={{ fontWeight: '600' }}
                />
              </View>
            )}

            {isObject(orderObject.custData) && (
              <View style={{ marginTop: 30 }}>
                {/* 16 */}
                <CustomText text="Ordered By:" isHeading size="m" />
                <View
                  style={[globalStyles.rowSpacing, { marginTop: 10, flex: 0 }]}>
                  <TouchableOpacity
                    disabled // !orderObject.isCustomer
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <UserDetails
                      isDisabled
                      extraStyles={{ width: '100%' }}
                      user={orderObject.custData}
                    />
                    {/* 14 */}
                    <CustomText
                      text={orderObject.custData.customer}
                      isHeading
                      size="s"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* orderObject.isMembership && isArray(orderObject.apps) && (
            <ChannelList
              heading="In Channels"
              channelList={orderObject.apps}
              showSave={false}
              mainViewStyles={{ marginTop: 0, marginBottom: 20 }}
              listStyles={{ marginTop: 10, paddingLeft: 20 }}
              headerContainer={{ paddingLeft: 20 }}
              headingStyle={{ fontSize: 16 }}
              channelWidth={wp(25)}
            />
          ) */}
          <Line />

          <View style={{ marginTop: 15 }}>
            <View style={styles.orderDetails}>
              {/* 16 */}
              <CustomText
                text="Order Status:"
                size="m"
                extraStyles={{ width: '40%', fontWeight: '700' }}
              />
              <TransactionStatus
                status={orderObject.order_status}
                extraStyles={{ width: '23%' }}
              />
            </View>
            <OrderItem label="Order Id" value={orderObject.id} />
            <OrderItem label="Type" value={orderObject.orderType} />
            <OrderItem label="Ordered on" value={orderObject.orderDate} />
            <Line />
          </View>

          <View style={{ marginTop: 15 }}>
            {/* fontSize: 20 */}
            <CustomText
              text="Product Details"
              isHeading
              size="l"
              extraStyles={{ paddingHorizontal: 15 }}
            />
            {!orderObject.isCrypto ? (
              <View style={{ marginTop: 15 }}>
                <OrderItem
                  label="Product Name"
                  value={orderObject.product_name}
                />
                {isExist(orderObject.campaign_name) && (
                  <OrderItem
                    label="Campaign Name"
                    value={orderObject.campaign_name}
                  />
                )}
              </View>
            ) : (
              isObject(orderObject.primaryToken) && (
                <View style={{ marginTop: 15 }}>
                  {isExist(orderObject.campaign_name) && (
                    <OrderItem
                      label="Campaign Name"
                      value={orderObject.campaign_name}
                    />
                  )}
                  <OrderItem
                    label="Product Name"
                    value={orderObject.primaryToken.tokenName}
                  />
                  <OrderItem
                    label="Symbol"
                    value={orderObject.primaryToken.tokenSymbol}
                  />
                  <OrderItem
                    label="Number of Tokens"
                    value={orderObject.primaryToken.numberOfTokens}
                  />
                </View>
              )
            )}
            <Line />
          </View>

          {isObject(orderObject.secondaryToken) && (
            <View style={{ marginTop: 15 }}>
              {/* 20 */}
              <CustomText
                text={orderObject.secondaryToken.label}
                isHeading
                size="l"
                extraStyles={{ paddingHorizontal: 15 }}
              />
              <View style={{ marginTop: 15 }}>
                <OrderItem
                  label="Product Name"
                  value={orderObject.secondaryToken.tokenName}
                />
                <OrderItem
                  label="Symbol"
                  value={orderObject.secondaryToken.tokenSymbol}
                />
                <OrderItem
                  label="Number of Tokens"
                  value={orderObject.secondaryToken.numberOfTokens}
                />
              </View>
            </View>
          )}

          {showPaymentInfo && (
            <View style={{ marginTop: 15 }}>
              <CustomText
                text={orderObject.detailsHeading}
                isHeading
                size="l"
                extraStyles={{ paddingHorizontal: 15 }}
              />
              {/* if order json data exists - show that */}
              {isObject(orderObject.detailsJson) && (
                <View style={{ marginTop: 15 }}>
                  {orderObject.isTypeSubsciption && (
                    <View style={styles.orderDetails}>
                      <CustomText
                        text="Status:"
                        size="m"
                        extraStyles={styles.itemHeading}
                      />
                      <TransactionStatus
                        status={orderObject.subscription_status}
                      />
                    </View>
                  )}
                  {/* Service Text & Amount */}
                  {isExist(orderObject.detailsJson.serviceText) && (
                    <View style={styles.orderDetails}>
                      {isExist(orderObject.detailsJson.serviceText) && (
                        <CustomText
                          text={orderObject.detailsJson.serviceText}
                          size="m"
                          extraStyles={{ width: '58%', fontWeight: '700' }}
                        />
                      )}
                      <CustomText
                        text={orderObject.detailsJson.serviceAmount}
                        size="m"
                        extraStyles={styles.itemValues}
                      />
                    </View>
                  )}
                  {/* Discount Text & Amount */}
                  {isExist(orderObject.detailsJson.discountAmount) && (
                    <View style={styles.orderDetails}>
                      {isExist(orderObject.detailsJson.discountText) ? (
                        <CustomText
                          text={orderObject.detailsJson.discountText}
                          size="m"
                          extraStyles={{ width: '58%', fontWeight: '700' }}
                        />
                      ) : (
                        <View style={{ width: '58%' }} />
                      )}
                      <CustomText
                        text={orderObject.detailsJson.discountAmount}
                        size="m"
                        extraStyles={styles.itemValues}
                      />
                    </View>
                  )}
                  {/* Additional Text */}
                  {isExist(orderObject.detailsJson.additionalText) && (
                    <View style={styles.orderDetails}>
                      <CustomText
                        text={orderObject.detailsJson.additionalText}
                        size="m"
                        extraStyles={styles.itemValues}
                      />
                    </View>
                  )}
                  {orderObject.isCancelledSubscription && (
                    <OrderItem
                      label="Cancellation Date"
                      value={orderObject.detailsJson.cancelledDate}
                    />
                  )}
                  <OrderItem
                    label="Paid"
                    value={orderObject.detailsJson.paid}
                  />
                  {orderObject.isActiveSubscription && (
                    <>
                      <OrderItem
                        label="Start Date"
                        value={orderObject.detailsJson.startDate}
                      />
                      <OrderItem
                        label="Next Billing Amount"
                        value={orderObject.detailsJson.nextAmount}
                      />
                    </>
                  )}
                </View>
              )}

              {/* if non crypto payment = show these */}
              {!orderObject.isCryptoPayment &&
                !isObject(orderObject.detailsJson) && (
                  <View style={{ marginTop: 15 }}>
                    <OrderItem
                      label="Order Amount"
                      value={orderObject.totalOrderAmount}
                    />
                    <OrderItem
                      label="Card Processing Fees"
                      value={toDollars(orderObject.processing_fee)}
                    />
                    <OrderItem
                      label="Platform Fees"
                      value={toDollars(orderObject.fee)}
                    />
                    <OrderItem
                      label="Total Fees"
                      value={orderObject.totalFees}
                    />
                    <OrderItem
                      label="Net Order"
                      value={toDollars(orderObject.receivable_amount)}
                    />
                  </View>
                )}
            </View>
          )}
          {/* isArray(orderObject.included_products) && (
            fontsize 17
            <View style={globalStyles.container}>
              <CustomText text="Included Products" isHeading size="m" />
              <DonationOfferList
                horizontal={false}
                objectList={orderObject.included_products}
                extraFlatListProps={{ style: { marginTop: 10 } }}
                listItemStyles={{ marginVertical: 15 }}
                objectStyles={{ width: wp(25) }}
                detailsStyles={{ marginLeft: 10, width: '70%' }}
              />
            </View>
          ) */}
        </View>
      )}
    </View>
  );
};

export default PurchaseDetails;

export const OrderItem = ({ label, value, isEmptyHeading }: ObjectType) => (
  <View style={styles.orderDetails}>
    {label && (
      <CustomText
        text={`${label}:`}
        size="m"
        extraStyles={styles.itemHeading}
      />
    )}
    {isEmptyHeading && <View style={{ width: '58%' }} />}
    <CustomText text={value} size="m" extraStyles={styles.itemValues} />
  </View>
);
OrderItem.defualtProps = {
  label: '',
  value: '',
  isEmptyHeading: false,
};

const styles = StyleSheet.create({
  orderDetails: {
    ...globalStyles.rowSpacing,
    flex: 0,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  itemHeading: {
    fontWeight: '700',
    width: '58%',
  },
  itemValues: { textAlign: 'right', width: '42%' },
});
