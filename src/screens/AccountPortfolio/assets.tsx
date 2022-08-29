import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, Pressable, LayoutAnimation } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import { CryptoAssets, CustomText, CheckBoxIcon } from '@components';
import {
  getAccountPortfolioListState,
  getPortfolioWorthState,
} from '@store/AccountPortfolio';
import { globalStyles, spacing, hp, colors } from '@styles';
import { NftList } from '@components';
import { isArray, isObject } from '@helpers';
import { ObjectType } from '@types';

const { m, l } = spacing;

interface AssetProps {
  providerId: string;
  isShowAll?: boolean;
  type?: string;
  category?: string;
}

export const Assets = React.memo((props: AssetProps) => {
  const { providerId, category } = props;
  const { navigate } = useNavigation();
  const [coinTab, selectedTab] = useState('balance');
  const [isNFTGrouped, setIsNFTGrouped] = useState(false);
  const portfolio = useSelector(getAccountPortfolioListState);
  const { portfolioWorth, portfolioUpdatedAt } = useSelector(
    getPortfolioWorthState,
  );

  const onNFTGrouping = useCallback(() => {
    setIsNFTGrouped(!isNFTGrouped);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isNFTGrouped]);

  const onNFTClick = useCallback(
    (nft) => {
      if (isObject(nft)) {
        if (isNFTGrouped && isArray(nft.groups)) {
          const objectList = _.sortBy(nft.groups, 'token_id');
          navigate('ShowAllAssets', { type: 'NFTs', list: objectList });
        } else {
          navigate('NFTDetailCard', { product: nft });
        }
      }
    },
    [isNFTGrouped, navigate, props],
  );

  const isExternalWallet = useMemo(() => {
    return providerId === '24710';
  }, [providerId]);

  const { isNftTab, assetsList, isTokensTab, isCoinsTab, isBalanceTab } =
    useMemo(() => {
      const tabs = {
        isTokensTab: category === 'Tokens',
        isCoinsTab: category === 'Coins',
        isNftTab: category === 'NFTs',
        isBalanceTab: category === 'Balance',
      };
      let list = [];
      if (isExternalWallet) {
        list = [];
      } else {
        const isList = isObject(portfolio) && isArray(portfolio.list);
        if (isList && tabs.isTokensTab) {
          list = portfolio.list.filter(
            (d: ObjectType) =>
              d.type_category_id === '24652' &&
              d.wallet_provider_category_id === providerId,
          );
        } else if (isList && tabs.isCoinsTab) {
          list = portfolio.list.filter(
            (d: ObjectType) =>
              d.type_category_id === '24651' &&
              d.wallet_provider_category_id === providerId,
          );
        }
      }
      return {
        ...tabs,
        isTokensData: isArray(list),
        assetsList: list,
      };
    }, [isExternalWallet, category, providerId, portfolio]);

  const groupEditionsInDisplay = (nfts: any) => {
    if (isArray(nfts)) {
      let nftList: any = [...nfts];
      const grouped = _.groupBy(nftList, 'collection_id');
      if (isObject(grouped)) {
        nftList = [];
        let nullList: any = [];
        Object.keys(grouped)
          .reverse()
          .map((f) => {
            const collection = grouped[f];
            if (f !== 'null') {
              if (collection.length > 1) {
                collection[0].groups = [...collection];
                nftList = [...nftList, collection[0]];
              } else {
                nftList = [...nftList, ...collection];
              }
            } else {
              nullList = [...collection];
            }
          });
        nftList = [...nftList, ...nullList];
      }
      return nftList;
    }
    return [];
  };

  const nftList = useMemo(() => {
    let nfts: any = [];
    if (isNftTab && isArray(portfolio.nft_list)) {
      nfts = [...portfolio.nft_list];
      if (isNFTGrouped) {
        nfts = groupEditionsInDisplay(nfts);
      }
    }
    return nfts;
  }, [isNftTab, isNFTGrouped, portfolio]);

  return (
    <View style={{ flex: 1 }}>
      {isBalanceTab && (
        <View style={styles.balance}>
          <CustomText
            isHeading
            text={portfolioWorth}
            extraStyles={{ fontSize: 40 }}
          />
          <CustomText
            text={`updated at ${portfolioUpdatedAt}`}
            size="s"
            extraStyles={styles.updatedAt}
          />
        </View>
      )}

      {(isTokensTab || isCoinsTab) && isArray(assetsList) && (
        <View style={styles.coinsContainer}>
          <CryptoAssets
            list={assetsList}
            onTabChange={(e) => selectedTab(e)}
            defFilterType={coinTab}
            isExternalWallet={isExternalWallet}
          />
        </View>
      )}

      {isNftTab && isArray(nftList) && (
        <>
          <Pressable
            style={styles.groupNftOption}
            onPress={() => onNFTGrouping()}>
            <CheckBoxIcon
              size={24}
              isChecked={isNFTGrouped}
              onPress={() => onNFTGrouping()}
            />
            <CustomText
              isHeading
              text="Group Editions"
              size="m"
              style={{ color: colors.mediumGray }}
            />
          </Pressable>

          <NftList
            list={nftList}
            isHorizontal={false}
            onClick={onNFTClick}
            isShowEdition={!isNFTGrouped}
          />
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  coinsContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: m,
  },
  picker: { width: '90%', marginHorizontal: m, marginBottom: l },
  balance: {
    ...globalStyles.columnCenter,
    height: hp(35),
    paddingHorizontal: spacing.l,
  },
  updatedAt: {
    marginTop: spacing.s,
    marginLeft: spacing.xs,
    color: colors.mediumGray,
  },
  groupNftOption: {
    ...globalStyles.rowSpacing,
    margin: spacing.l,
    marginTop: 0,
    width: '32%',
    // backgroundColor: 'yellow',
  },
});
