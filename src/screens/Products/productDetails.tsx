import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Animated,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
  isObject,
  isExist,
  isArray,
  onCopyText,
  getProductPaymentDisplayText,
  isBoolean,
} from '@helpers';
import { getProductDetails, getUserId, isTestMode } from '@services';
import {
  FlatListView,
  SectionListView,
  NFTEditionList,
  CustomText,
  ButtonText,
  ImageObject,
  Spinner,
  CardHeader,
  ReadMore,
  CopyIcon,
} from '@components';
import { globalStyles, wp, colors, spacing } from '@styles';
import { ListItemProps, ObjectType } from '@types';

const { xs, s, l } = spacing;
const isExternal = ['24665', '24664']; // external nft & open sea external nft
const isHideFooter = ['24670']; // drop product
const isSpecificNftType = ['24661', '24665']; // nft internal & nft external

const ProductDetails = React.memo(() => {
  const { params }: ObjectType = useRoute();
  const productId = params?.id ?? '';

  const [isLoading, setLoading] = useState(true);
  const [productObj, setProductObj] = useState<ObjectType>({});
  const posY = useRef(new Animated.Value(0)).current;

  const {
    price,
    isOwnProduct,
    isInternalCheckout,
    isExternalLink,
    isNFT,
    isNftData,
    isActive,
    isEditions,
    sections,
  } = useMemo(() => {
    const { priceValTxt } = getProductPaymentDisplayText({
      price: productObj.price,
      product: productObj,
    });
    return {
      sections: [
        { title: productObj.name, data: [{ id: productObj.id }] },
      ],
      isNftData: isObject(productObj.nft_data),
      price: priceValTxt,
      isExternalLink:
        isExternal.includes(productObj.category_id) &&
        isExist(productObj.external_url),
      isInternalCheckout: !isExternal.includes(productObj.category_id),
      isOwnProduct: productObj.primary_creator_id === getUserId(),
      isEditions: isArray(productObj.nft_editions),
      isNFT: isSpecificNftType.includes(productObj.category_id),
      isActive: productObj.status === 'published',
    };
  }, [productObj]);

  const { isBuyableProduct, isBuyableNft, isSellable } = useMemo(
    () => ({
      isBuyableProduct:
        !isNFT &&
        isActive &&
        (isExternalLink ||
          (!isOwnProduct &&
            isInternalCheckout &&
            isBoolean(productObj.is_available_for_purchase))),
      isBuyableNft:
        isNFT &&
        !isOwnProduct &&
        isActive &&
        isBoolean(productObj.is_available_for_purchase),
      isSellable: isNFT && isOwnProduct && isActive,
    }),
    [
      isNFT,
      isActive,
      isExternalLink,
      isOwnProduct,
      isInternalCheckout,
      productObj,
    ],
  );

  useEffect(() => {
    const fetchObjData = async () => {
      if (isExist(productId)) {
        let res = await getProductDetails({ params: { id: productId } });
        if (res) {
          const parentCatId = isObject(res.category_hierachy)
            ? res.category_hierachy.category_id
            : '';
          setProductObj({ ...res, parentCatId });
        }
      }
      setLoading(false);
    };
    fetchObjData();
  }, []);

  const handleHashAddress = useCallback(() => {
    Linking.openURL(
      `https://testnet.flowscan.org/transaction/${productObj.nft_data.nft_txn_hash}`,
    );
  }, [productObj]);

  const renderProducts = useCallback(
    ({ item, index }) => (
      <View key={index} style={{ width: wp(42), marginTop: l }}>
        <CustomText isHeading={true} text={item.name} size="m" />
        {/* <DropItems
          object={{ ...item, displayUI: { width: wp(42), aspectRatio: 0.83 } }}
        /> */}
      </View>
    ),
    [],
  );

  return (
    <View style={globalStyles.cardContainer}>
      {isLoading && <Spinner />}
      {!isLoading && (
        <>
          <CardHeader scrollY={posY} />
          {isObject(productObj) && (
            <>
              <SectionListView
                sections={sections}
                style={globalStyles.flex}
                renderSectionHeader={({ section: { title } }) => (
                  <ImageObject
                    isClickable={false}
                    isOrgRatio
                    object={{ ...productObj, layoutType: 'banner' }}
                    extraStyles={{ width: wp(100) }}
                  />
                )}
                renderItem={({ index }: ListItemProps) => (
                  <View key={index} style={styles.container}>
                    <CustomText
                      size="xxl"
                      isHeading={true}
                      text={productObj.name}
                      extraStyles={{ marginTop: l }}
                    />
                    {isExist(productObj.description) && (
                      <ReadMore
                        numberOfLines={6}
                        extraStyles={{ marginTop: l }}>
                        {productObj.description}
                      </ReadMore>
                    )}
                    {isNftData && (
                      <>
                        {isExist(productObj.nft_data.nft_chain) && (
                          <View
                            style={[globalStyles.rowStart, { marginTop: l }]}>
                            <CustomText
                              isHeading={true}
                              text="Blockchain:  "
                              size="l"
                            />
                            <CustomText
                              text={productObj.nft_data.nft_chain}
                              size="m"
                            />
                          </View>
                        )}
                        {isExist(productObj.nft_data.nft_txn_hash) && (
                          <View style={styles.hashAddress}>
                            <CustomText
                              isHeading={true}
                              size="l"
                              text="Transaction Hash:"
                              extraStyles={{ marginBottom: xs }}
                            />
                            <TouchableOpacity
                              disabled={!isTestMode()}
                              onPress={handleHashAddress}
                              style={[
                                globalStyles.rowSpacing,
                                { width: '100%' },
                              ]}>
                              <CustomText
                                isHeading={true}
                                text={productObj.nft_data.nft_txn_hash}
                                size="m"
                                extraStyles={{
                                  color: colors.appBlue,
                                  width: '85%',
                                }}
                                numberOfLines={4}
                              />
                              <CopyIcon
                                onPress={() =>
                                  onCopyText(productObj.nft_data.nft_txn_hash)
                                }
                                size={28}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </>
                    )}
                    {isNFT && (
                      <View style={{ marginTop: s }}>
                        {/* productObj.minting_status && (
                        <ReadMore extraStyles={{ marginVertical: 10 }} numberOfLines={3}>
                          {productObj.minting_status}
                        </ReadMore>
                      ) */}
                      </View>
                    )}
                    {isEditions && (
                      <View style={{ marginTop: l }}>
                        <CustomText
                          isHeading={true}
                          text="Editions"
                          size="xl"
                        />
                        <NFTEditionList
                          isHorizontal={false}
                          data={productObj.nft_editions}
                        />
                      </View>
                    )}
                    {isArray(productObj.included_products) && (
                      <FlatListView
                        data={productObj.included_products}
                        renderItems={renderProducts}
                        numColumns={2}
                        style={globalStyles.flex}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        ListHeaderComponent={() => (
                          <CustomText
                            isHeading={true}
                            text="Featured Items"
                            size="xl"
                          />
                        )}
                        onScroll={Animated.event(
                          [{ nativeEvent: { contentOffset: { y: posY } } }],
                          { useNativeDriver: false }, // if true -> need to use Animated.ScrollView,
                        )}
                      />
                    )}
                  </View>
                )}
              />
              {!isHideFooter.includes(productObj.category_id) && (
                <View style={globalStyles.footerContainer}>
                  <View style={{ width: '55%' }}>
                    {isExist(price) && (
                      <CustomText isHeading text={price} size="l" />
                    )}
                  </View>
                  {isBuyableNft || isBuyableProduct || isSellable ? (
                    <ButtonText
                      size="m"
                      text={isSellable ? 'Send' : 'Buy Now'}
                      isInactive
                      disabled
                      extraStyles={styles.buyNow}
                    />
                  ) : (
                    <View style={{ width: '28%' }} />
                  )}
                </View>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
});

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    paddingVertical: 0,
  },
  hashAddress: {
    ...globalStyles.columnSpacing,
    alignItems: 'flex-start',
    marginTop: spacing.l,
    width: '100%',
  },
  buyNow: {
    paddingVertical: 8,
    borderRadius: 5,
    width: '28%',
  },
});
