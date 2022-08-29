import React, { useCallback, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Linking,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
  isObject,
  isExist,
  onCopyText,
  ifExist,
  getNFTEditionNumber,
} from '@helpers';
import { isTestMode } from '@services';
import {
  SectionListView,
  CustomText,
  ButtonText,
  ImageObject,
  CardHeader,
  ReadMore,
  CopyIcon,
} from '@components';
import { globalStyles, wp, colors, spacing } from '@styles';
import { ListItemProps, ObjectType } from '@types';

const { xs, m, l } = spacing;

const NFTDetailCard = React.memo(() => {
  const { params }: ObjectType = useRoute();
  const posY = useRef(new Animated.Value(0)).current;

  const { asset, isOwner, isActive, edition, productObj, sections } =
    useMemo(() => {
      const product = params?.product ?? {};
      const nftData = isObject(product.nft_data) ? product.nft_data : {};
      return {
        sections: [{ title: product.name, data: [{ id: product.id }] }],
        productObj: product,
        asset: nftData,
        isOwner: isExist(product.user_type)
          ? product.user_type === 'owner'
          : false,
        isActive: isExist(product.status)
          ? product.status === 'published'
          : false,
        edition: getNFTEditionNumber({ asset: nftData }),
      };
    }, []);

  const handleHashAddress = useCallback(() => {
    Linking.openURL(
      `https://testnet.flowscan.org/transaction/${productObj.nft_data.nft_txn_hash}`,
    );
  }, [productObj]);

  return (
    <View style={globalStyles.cardContainer}>
      <CardHeader scrollY={posY} />
      <SectionListView
        sections={sections}
        style={globalStyles.flex}
        renderSectionHeader={({ section: { title } }) => (
          <ImageObject
            isClickable={false}
            isOrgRatio
            object={{ ...productObj, layoutType: 'banner' }}
            extraStyles={{ width: wp(100) }}
            image={
              ifExist(productObj.asset_file) ||
              ifExist(productObj.image_url_icon) ||
              ifExist(productObj.product_image) ||
              ''
            }
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
            {isExist(asset.nft_token_id) && (
              <CustomText
                text={edition}
                extraStyles={{ marginTop: m, fontWeight: '600' }}
              />
            )}
            {isExist(productObj.description) && (
              <ReadMore numberOfLines={6} extraStyles={{ marginTop: l }}>
                {productObj.description}
              </ReadMore>
            )}

            {isExist(asset.nft_chain) && (
              <View style={[globalStyles.rowStart, { marginTop: l }]}>
                <CustomText isHeading={true} text="Blockchain:  " size="l" />
                <CustomText text={asset.nft_chain} size="m" />
              </View>
            )}

            {isExist(asset.nft_txn_hash) && (
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
                  style={[globalStyles.rowSpacing, { width: '100%' }]}>
                  <CustomText
                    isHeading={true}
                    text={asset.nft_txn_hash}
                    size="m"
                    numberOfLines={4}
                    extraStyles={{ color: colors.appBlue, width: '85%' }}
                  />
                  <CopyIcon
                    onPress={() => onCopyText(asset.nft_txn_hash)}
                    size={28}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
      {isOwner && isActive && (
        <View style={styles.footerView}>
          <ButtonText
            size="m"
            text="Send"
            isInactive
            disabled
            extraStyles={styles.footerButton}
          />
        </View>
      )}
    </View>
  );
});
export default NFTDetailCard;

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
  footerView: {
    ...globalStyles.footerContainer,
    justifyContent: 'flex-end',
    paddingHorizontal: l,
  },
  footerButton: {
    paddingVertical: 8,
    borderRadius: 5,
    width: '28%',
  },
});
