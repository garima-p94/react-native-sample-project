import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
  getUserId,
  getCrytoTokenDetails,
  getTokenTransactions,
} from '@services';
import {
  isExist,
  isObject,
  isArray,
  numberFormatting,
  momentScrollDetect,
} from '@helpers';
import {
  Line,
  FlatListView,
  Spinner,
  ReadMore,
  RefreshLoader,
  CustomText,
  SectionListView,
  AssetObject,
  ButtonText,
  UserDetails,
  OrdersList,
  CryptoChart,
  PaymentsList,
} from '@components';
// import { TokenImage, CryptoFooter } from './common';
// import { handlePrice, CoinObject } from './index';
import { globalStyles, colors, wp } from '@styles';
import { ObjectType } from '@types';
import { spacing } from '../../styles/attributes';
import { useSelector } from 'react-redux';
import { getPortfolioAccountState } from '@store/AccountPortfolio';

const categoriesList = [
  { key: 'about', display: 'About' },
  { key: 'wallet', display: 'Wallet' },
  { key: 'transaction', display: 'Activity' },
  { key: 'payment', display: 'Payments' },
  { key: 'reward', display: 'Rewards' },
];

const defState: ObjectType = {
  isLoading: true,
  list: [],
  pageNo: '',
};

const CryptoTokenDetails = () => {
  const routes: ObjectType = useRoute();
  const tokenId = routes.params?.tokenId ?? null;
  const userAccCryptoList = routes.params?.userAccCryptoList ?? null;
  const onNavigateBack = routes.params?.onNavigateBack ?? null;
  const account = useSelector(getPortfolioAccountState);

  const [isLoading, setLoading] = useState(true);
  const [isRefresh, setIsRefresh] = useState(false);
  const [selectedOption, setOption] = useState('about');
  const [tokenObject, setTokenObject] = useState<ObjectType>({});
  const [tabs, setTabs] = useState<Array<ObjectType>>([]);
  const [graphObj, setGraphObj] = useState([]);
  const [publicTxnData, setPublicTxnData] = useState({ ...defState });
  const [walletTxnData, setWalletTxnData] = useState({ ...defState });

  const apiParams = useMemo(() => ({ id: tokenId }), [tokenId]);
  const accountId = useMemo(() => {
    return account.id || account.id;
  }, [account]);

  useEffect(() => {
    fetchTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTransaction = useCallback(
    async ({ isAll, type, pageNo }: ObjectType) => {
      if ((type === 'transaction' || isAll) && pageNo) {
        setPublicTxnData((prevState) => ({
          ...prevState,
          isLoading: true,
          pageNo,
        }));
        const list = await getTokenTransactions({
          params: { ...apiParams, page: pageNo },
        });
        setPublicTxnData((prevState) => ({
          ...prevState,
          isLoading: false,
          list: pageNo === 1 ? list : [...prevState.list, ...list],
        }));
      }
      if ((type === 'wallet' || isAll) && pageNo && accountId) {
        setWalletTxnData((prevState) => ({
          ...prevState,
          isLoading: true,
          pageNo,
        }));
        const list = await getTokenTransactions({
          params: {
            ...apiParams,
            page: pageNo,
            account_id: accountId,
          },
        });
        setWalletTxnData((prevState) => ({
          ...prevState,
          isLoading: false,
          list: pageNo === 1 ? list : [...prevState.list, ...list],
        }));
      }
    },
    [accountId, apiParams],
  );

  const fetchTokens = useCallback(
    async (options = {}) => {
      let newTabs = [...categoriesList];
      if (isExist(tokenId)) {
        const res = await getCrytoTokenDetails({ params: { id: tokenId } }); // 'Ajx8ipzbydswuaabw98up4e0m4tj0lzj'
        if (isObject(res)) {
          const token = isExist(res.circulating_supply)
            ? parseFloat(res.circulating_supply)
            : 0;
          const rate = isExist(res.exchange_rate)
            ? parseFloat(res.exchange_rate)
            : 0;
          const mcap = numberFormatting(token * rate);
          res.mcap = `MCap ${mcap ? `$${mcap}` : '$0.00'}`;
          res.isCreator = res.creator_user_id === getUserId();
          if (!res.isCreator) {
            newTabs = categoriesList.filter((e) => e.key !== 'payment');
          }
          setTokenObject(res);
          setGraphObj(res);
        }
      }
      setTabs([...newTabs]);
      // refreshes portfolio & crypo global assets api
      // options.isInit && (await handleCryptoApisData());
      setLoading(false);
      fetchTransaction({ isAll: true, pageNo: 1 });
    },
    [fetchTransaction, tokenId],
  );

  const handleRefresh = () => {
    setIsRefresh(true);
    setTimeout(async () => {
      setIsRefresh(false);
      setLoading(true);
      setOption('about');
      await fetchTokens();
      // when coming from account card
      onNavigateBack && onNavigateBack();
    }, 500);
  };

  const onLoadMore = (nativeEvent: any) => {
    if (
      (momentScrollDetect(nativeEvent) && selectedOption === 'transaction') ||
      selectedOption === 'wallet'
    ) {
      const e: ObjectType =
        selectedOption === 'transaction' ? publicTxnData : walletTxnData;
      if (!e.isLoading && e.pageNo !== e.pageNo + 1 && isArray(e.list)) {
        fetchTransaction({ type: selectedOption, pageNo: e.pageNo + 1 });
      }
    }
  };

  const switchViews = () => {
    switch (selectedOption) {
      case 'about': {
        return (
          <>
            <UserDetails isDisabled user={tokenObject} imagePrefix="user" />
            {isExist(tokenObject.about) && (
              <ReadMore
                numberOfLines={7}
                textStyles={{ color: colors.mediumGray }}
                extraStyles={{ marginTop: spacing.m }}>
                {tokenObject.about}
              </ReadMore>
            )}
          </>
        );
      }
      case 'transaction': {
        return (
          <>
            <OrdersList
              isAdmin
              orders={publicTxnData.list}
              tokenId={tokenObject.id}
              showCryptoAmt
              showCustomer={tokenObject.isCreator}
              extraFlatListProps={{ style: { marginBottom: spacing.m } }}
            />
            {publicTxnData.isLoading && <Spinner isFullScreen={false} />}
          </>
        );
      }
      case 'payment': {
        return isArray(tokenObject.payments) ? (
          <PaymentsList
            payments={tokenObject.payments}
            showCryptoAmt
            extraFlatListProps={{
              style: { marginBottom: spacing.m },
              extraData: tokenObject,
            }}
          />
        ) : (
          <View />
        );
      }
      case 'wallet': {
        return (
          <View>
            {isExist(tokenObject.user_number_of_tokens) && (
              <>
                <AssetObject asset={tokenObject} defFilterType="balance" />
                <Line />
              </>
            )}
            {isArray(walletTxnData.list) && (
              <>
                <OrdersList
                  isAdmin
                  showCryptoAmt
                  orders={walletTxnData.list}
                  tokenId={tokenObject.id}
                  extraFlatListProps={{ style: { marginBottom: spacing.m } }}
                />
                {walletTxnData.isLoading && <Spinner isFullScreen={false} />}
              </>
            )}
          </View>
        );
      }
      default:
        return null;
    }
  };

  const renderTabs = useCallback(
    ({ item }) => (
      <ButtonText
        key={item.key}
        isInactive={item.key !== selectedOption}
        size="m"
        text={item.display}
        onPress={() => setOption(item.key)}
        extraStyles={{ marginRight: spacing.l, width: wp(25) }}
      />
    ),
    [selectedOption],
  );

  const sections = useMemo(
    () => [{ title: tokenObject.symbol, data: [{ id: tokenObject.id }] }],
    [tokenObject],
  );

  return (
    <View style={globalStyles.flex}>
      {isLoading && <Spinner />}
      {!isLoading && isObject(tokenObject) && (
        <SectionListView
          sections={sections}
          style={styles.container}
          onMomentumScrollEnd={({ nativeEvent }: any) =>
            onLoadMore(nativeEvent)
          }
          refreshControl={
            <RefreshLoader
              refreshing={isRefresh}
              onRefresh={() => handleRefresh()}
            />
          }
          renderSectionHeader={({ section: { title } }) => (
            <CustomText isHeading text={title} extraStyles={styles.section} />
          )}
          renderItem={({ index }) => (
            <View key={index} style={{ flex: 1 }}>
              <View style={styles.section}>
                <AssetObject
                  asset={tokenObject}
                  defFilterType="price"
                  isShowOwned={false}
                />
              </View>
              <Line />
              {tokenObject.id !== '298' && (
                <View style={{ paddingHorizontal: spacing.s }}>
                  <CryptoChart chartObj={graphObj} />
                </View>
              )}
              <View style={{ marginVertical: spacing.m }}>
                <FlatListView
                  listKey="filterList"
                  horizontal={true}
                  data={tabs}
                  renderItem={renderTabs}
                  contentContainerStyle={{ marginHorizontal: spacing.m }}
                  style={{ marginTop: spacing.m }}
                />
                <View style={{ margin: spacing.l }}>
                  {switchViews()}
                  <View style={{ height: wp(50) }} />
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default CryptoTokenDetails;

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    paddingHorizontal: 0,
  },
  section: {
    paddingHorizontal: spacing.m,
    marginBottom: spacing.m,
  },
  aboutView: {
    ...globalStyles.rowSpacing,
    width: '96%',
    marginTop: spacing.s,
  },
  assetImage: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: 180,
    overflow: 'hidden',
    backgroundColor: colors.lightGray,
  },
  flexRow: {
    ...globalStyles.rowStart,
    flex: 0,
    marginVertical: 20,
  },
  coinRow: {
    ...globalStyles.rowSpacing,
    width: '100%',
  },
  topText: {
    //
    fontSize: 14,
    width: '37%',
    textAlign: 'right',
  },
  amount: {
    textAlign: 'right',
    color: colors.mediumGray,
    // marginTop: 5, //
    fontSize: 12,
    fontWeight: '700',
    width: '40%', //
  },
});
