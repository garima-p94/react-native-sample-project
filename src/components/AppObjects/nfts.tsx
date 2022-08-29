import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  toFloatType,
  toCurrencyFormat,
  toCoinFormat,
  isArray,
  ifExist,
  isObject,
  getNFTEditionNumber,
} from '@helpers';
import { CustomText, FlatListView } from '../UIComponents';
import { CategoryType, ImageObject } from './objects';
import { spacing, globalStyles, colors, wp } from '@styles';
import { ListProps, ListItemProps, ObjectType } from '@types';
import { objectSizes } from '@constants';

const { xs, s, l } = spacing;
const { square } = objectSizes;
const coinTabsList = ['coins', 'price', 'balance'];

/*
 *
 * NFT list as product/nft
 *
 */
interface NFTListProps extends ListProps {
  onClick?: (e: object) => void;
  isShowEdition?: boolean;
}
export const NftList = ({
  list,
  isHorizontal,
  onClick,
  isShowEdition,
}: NFTListProps) => {
  const { navigate } = useNavigation();

  const { objectStyles, extraListProps, itemStyles } = useMemo(() => {
    const st = !isHorizontal
      ? { ...square, ...square.multiColumns }
      : { ...square };
    return {
      itemStyles: {
        width: st.width,
        marginBottom: l,
        marginRight: isHorizontal ? l : 0,
      },
      objectStyles: st,
      extraListProps: !isHorizontal
        ? {
            numColumns: 2,
            columnWrapperStyle: {
              justifyContent: 'space-between',
              paddingHorizontal: l,
            },
          }
        : { paddingHorizontal: l },
    };
  }, [isHorizontal]);

  const handleNfts = useCallback(
    (nft) => {
      if (onClick) {
        onClick(nft);
      } else {
        navigate('NFTDetailCard', { product: nft });
        return;
      }
    },
    [navigate, onClick],
  );

  const renderNfts = ({ item, index }: ListItemProps) => {
    const asset = isObject(item.nft_data) ? item.nft_data : {};
    return (
      <TouchableOpacity
        key={index}
        style={itemStyles}
        onPress={() => handleNfts(item)}>
        <ImageObject
          isColumns
          isShadow={true}
          image={item.asset_file || item.product_image}
          object={item}
          isClickable={false}
          extraStyles={objectStyles}
        />
        {/* isExist(item.status) && <MintingStatus status={item.status} /> */}
        <CategoryType
          text={ifExist(asset.nft_chain) || ''}
          extraStyles={{ marginTop: s, color: colors.red }}
        />
        <CustomText
          isHeading
          text={item.name}
          size="m"
          numberOfLines={2}
          extraStyles={{ marginTop: xs, height: 35 }}
        />
        {isShowEdition && (
          <CustomText
            text={getNFTEditionNumber({ asset })}
            extraStyles={{ marginTop: spacing.s, fontWeight: '600' }}
          />
        )}
      </TouchableOpacity>
    );
  };
  return (
    <FlatListView
      horizontal={isHorizontal}
      data={list}
      renderItem={renderNfts}
      {...extraListProps}
    />
  );
};
NftList.defaultProps = {
  list: [],
  onClick: null,
};

/*
 *
 * NFT editions object & list
 *
 */
const editionWidth = {
  horizonatal: wp(30), // image & details side by side
  vertical: wp(44), // details below image
};

export const NFTEditions = ({
  object,
  isDisabled,
  isHorizontal, // true = image & details side by side, false = details below image
  layoutStyles, // styles for the container
  objectStyles, // style for the image object
}: ObjectType) => {
  const { navigate } = useNavigation();

  const st = useMemo(
    () => ({
      layout: {
        marginBottom: 20,
        width: isHorizontal ? '100%' : editionWidth.vertical,
        flexDirection: isHorizontal ? 'row' : 'column',
        marginRight: !isHorizontal ? 20 : 0,
        ...layoutStyles,
      },
      object: {
        aspectRatio: 1,
        width: isHorizontal ? editionWidth.horizonatal : editionWidth.vertical,
        marginRight: isHorizontal ? 14 : 0,
        ...objectStyles,
      },
      details: {
        marginTop: 10,
        width: isHorizontal ? '64%' : '100%',
      },
    }),
    [isHorizontal, layoutStyles, objectStyles],
  );

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={st.layout}
      onPress={() => {
        navigate('NFTDetailCard', { product: object });
        // push('ProductDetails', { id: object.id });
      }}>
      <ImageObject
        isColumns
        isShadow
        image={object.aseet_file || object.product_image}
        object={object}
        isClickable={false}
        extraStyles={st.object}
      />
      <View style={st.details}>
        <CategoryType
          text={object.type || object.catgeory}
          extraStyles={{ marginVertical: xs }}
        />
        <CustomText
          isHeading
          text={`${object.editionNumber} ${object.name}`}
          size="m"
          extraStyles={{ marginTop: s }}
        />
      </View>
    </TouchableOpacity>
  );
};

export const NFTEditionList = ({
  isHorizontal, // vertical or horizontal list
  data, // list
  extraListProps,
  isMultipleRows, // list = vertical, layout = vertical, numColums = 2
  isDisabled,
  isShowMore,
}: ObjectType) => {
  const listProps = useMemo(() => {
    const obj = { ...extraListProps };
    if (isMultipleRows) {
      obj.numColumns = 2;
      obj.columnWrapperStyle = { justifyContent: 'space-between' };
    }
    return obj;
  }, [extraListProps, isMultipleRows]);

  return isArray(data) ? (
    <>
      <FlatListView
        horizontal={isHorizontal}
        data={isShowMore ? data.slice(0, 3) : data}
        style={{ marginTop: l }}
        {...listProps}
        renderItem={({ item, index }: ListItemProps) => (
          <NFTEditions
            key={index}
            isHorizontal={isMultipleRows ? false : !isHorizontal}
            object={{ ...item, editionNumber: `#${index ? index + 1 : 1}` }}
            isDisabled={isDisabled}
          />
        )}
      />
      {/* isShowMore && data.length > 3 && (
          <SeeMoreList
            list={data}
            extraStyles={{ margin: 20, alignSelf: 'flex-end' }}
            handlePress={() =>
              navigate('ShowAll', {
                objType: 'NFTEdition',
                objectList: data,
              })
            }
          />
        ) */}
    </>
  ) : (
    <View />
  );
};
NFTEditionList.defaultProps = {
  isHorizontal: false,
  data: [],
  extraListProps: {},
  isMultipleRows: false,
  isShowMore: true,
};

/*
 *
 * Asset list = tokens, coins
 *
 */
interface AssetProps extends ListProps {
  isExternalWallet?: boolean;
  defFilterType?: string;
  isHeader?: boolean;
  onTabChange?: (e: string) => void;
}

export const AssetObject = ({
  asset,
  defFilterType,
  isExternalWallet,
  isShowOwned,
}: ObjectType) => {
  const { navigate } = useNavigation();
  const getFilterValues = useCallback(() => {
    const tokens = toFloatType(asset.user_number_of_tokens);
    const rate = toFloatType(asset.exchange_rate);
    const obj = {
      topText: '',
      bottomText: '',
      mCap: `${toCurrencyFormat({
        value: toFloatType(asset.circulating_supply) * rate,
      })} Mkt Cap`,
      topColor: colors.boldGrey,
      bottomColor: colors.boldGrey,
    };
    if (isExternalWallet) {
      obj.mCap = '';
      obj.topText = `${toCoinFormat({ value: tokens, coinObj: asset })}`;
    } else if (defFilterType === 'coins') {
      obj.topText = `${toCoinFormat({ value: tokens, coinObj: asset })}`;
      obj.bottomText = toCurrencyFormat({ value: tokens * rate });
      obj.bottomColor = colors.darkGray;
    } else if (defFilterType === 'price') {
      obj.topText = toCurrencyFormat({ value: rate });
      obj.bottomText = `${toCoinFormat({ value: tokens, coinObj: asset })}`;
      obj.topColor = colors.appBlue;
    } else if (defFilterType === 'balance') {
      obj.topText = toCurrencyFormat({ value: tokens * rate }); // toCurrencyFormat(100000);
      obj.bottomText = `${toCoinFormat({ value: tokens, coinObj: asset })}`;
      obj.topColor = colors.darkGray;
    }
    return obj;
  }, [asset, defFilterType, isExternalWallet]);

  const { topText, bottomText, topColor, bottomColor, mCap } = useMemo(() => {
    return getFilterValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, defFilterType, isExternalWallet, getFilterValues]);

  return (
    <TouchableOpacity
      onPress={() =>
        navigate('CryptoTokenDetails', { tokenId: asset.token_id })
      }
      style={styles.assetContainer}>
      <ImageObject
        isRounded={true}
        isClickable={false}
        object={asset}
        extraStyles={{ width: '17%' }}
      />
      <View style={{ width: '80%' }}>
        <View style={[styles.details]}>
          <CustomText
            isHeading
            text={asset.name}
            size="m"
            extraStyles={{ width: '62%' }}
            numberOfLines={1}
          />
          <CustomText
            isHeading
            text={topText}
            size="m"
            extraStyles={[styles.textOne, { color: topColor }]}
          />
        </View>
        <View style={styles.details}>
          <CustomText
            isHeading
            text={asset.symbol}
            size="s"
            extraStyles={{ width: '22%' }}
          />
          {defFilterType !== 'balance' && (
            <CustomText
              text={mCap}
              size="s"
              extraStyles={{
                width: !isShowOwned ? '32%' : '38%',
                textAlign: 'center',
              }}
            />
          )}
          {isShowOwned && (
            <CustomText
              isHeading
              text={bottomText}
              size="s"
              extraStyles={[styles.textTwo, { color: bottomColor }]}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
AssetObject.defaultProps = {
  isShowOwned: true,
};

export const CryptoAssets = (props: AssetProps) => {
  const { list, defFilterType, isHeader, onTabChange } = props;

  const renderCoinTabs = useCallback(
    ({ item }) => {
      const isActiveTab = item === defFilterType;
      return (
        <TouchableOpacity
          key={item}
          disabled={item === defFilterType}
          onPress={() => onTabChange && onTabChange(item)}>
          <CustomText
            text={item.toUpperCase()}
            size="s"
            extraStyles={isActiveTab ? { color: colors.appBlue } : {}}
          />
        </TouchableOpacity>
      );
    },
    [defFilterType, onTabChange],
  );

  const ListHeaderComponent = () =>
    isHeader ? (
      <View style={styles.flexRow}>
        <CustomText
          isHeading
          size="l"
          text="Your Crypty Assets"
          extraStyles={{ width: '56%' }}
        />
        <FlatListView
          listKey="filterList"
          data={coinTabsList}
          renderItem={renderCoinTabs}
          scrollEnabled={false}
          style={{ width: '42%' }}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      </View>
    ) : null;

  const renderItems = useCallback(
    ({ item, index }: ListItemProps) => (
      <AssetObject key={index} asset={item} {...props} />
    ),
    [props],
  );

  return (
    <FlatListView
      listKey="assetLists"
      vertical={true}
      data={list}
      renderItem={renderItems}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
};

CryptoAssets.defaultProps = {
  isHeader: true,
  onTabChange: () => {},
};

const styles = StyleSheet.create({
  assetContainer: {
    ...globalStyles.rowSpacing,
    alignItems: 'center',
    marginTop: l,
    width: '100%',
  },
  details: {
    ...globalStyles.rowSpacing,
    width: '100%',
    flex: 0,
    marginBottom: s,
  },
  flexRow: {
    ...globalStyles.rowCenter,
    justifyContent: 'space-between',
    width: '98%',
    // marginTop: s,
    alignSelf: 'center',
  },
  textOne: {
    width: '37%',
    textAlign: 'right',
  },
  textTwo: {
    width: '40%',
    textAlign: 'right',
  },
  nftShadows: {
    ...globalStyles.shadowContainer,
    overflow: 'visible',
  },
});
