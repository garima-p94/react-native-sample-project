import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import {
  getUserAccountsListState,
  getPortfolioAccountState,
} from '@store/AccountPortfolio';
import { getCategoriesState } from '@store/Categories';
import {
  getAccountPortfolioList,
  getGlobalCryptoActivity,
  getPortfolioWorth,
  getUserWallets,
} from '@services';
import { isArray, sentryMessage } from '@helpers';
import {
  FlatListView,
  CustomText,
  Spinner,
  RefreshLoader,
  ArrowSwap,
  ButtonText,
} from '@components';
import { globalStyles, spacing } from '@styles';
import { Assets } from './assets';
import { Activity } from './activity';
import { getCategories } from '@services';
import { ListItemProps, ObjectType } from '@types';

const { xxxl, xxl, l, m, xl } = spacing;
const sections = ['Account', 'Latest Activity']; // 'Latest Activity'
const categories = ['Balance', 'NFTs', 'Coins', 'Tokens'];

/* Account Portfolio */

const AccountPortfolio = React.memo(({ navigation }) => {
  const { navigate } = navigation;
  const [isLoading, setLoading] = useState(true);
  const [isRefresh, setRefresh] = useState(false);
  const [provider, setProvider] = useState('');
  const [category, setCategory] = useState('Balance');
  const accounts = useSelector(getUserAccountsListState);
  const portfolioAccount = useSelector(getPortfolioAccountState);
  const walletProvider = useSelector((state) =>
    getCategoriesState(state, 'walletProviders'),
  );

  useEffect(() => {
    sentryMessage('inside app');
    const fetchList = async () => {
      let list = [];
      if (!isArray(walletProvider)) {
        list = await getCategories({ type: 'walletProviders' });
      } else {
        list = [...walletProvider];
      }
      isArray(list) && setProvider(list[0]);
      setLoading(false);
    };
    fetchList();
  }, []);

  const multipleApiCalls = useCallback(async () => {
    setLoading(true);
    setCategory('Balance');
    await getGlobalCryptoActivity({ isRefresh: true });
    await getAccountPortfolioList({
      isRefresh: true,
      params: { hard_resfresh: '1' },
    });
    await getPortfolioWorth();
    setLoading(false);
  }, []);

  const handleRefresh = useCallback(async () => {
    if (isRefresh) {
      return;
    }
    if (!isRefresh) {
      setRefresh(true);
      setTimeout(() => {
        setRefresh(false);
      }, 100);
      multipleApiCalls();
    }
  }, [isRefresh, multipleApiCalls]);

  const onAccountSwitch = useCallback(() => {
    navigate('AccountSelection', {
      onNavigateBack: async () => {
        multipleApiCalls();
        await getUserWallets({ isRefresh: true });
      },
    });
  }, [multipleApiCalls, navigate]);

  const renderCategories = useCallback(
    ({ item }) => (
      <View key={item}>
        <ButtonText
          isInactive={category !== item}
          size="s"
          text={item}
          onPress={() => setCategory(item)}
        />
      </View>
    ),
    [category],
  );

  const renderSections = ({ item, index }: ListItemProps) => {
    const isAccount = item === 'Account';
    const isHeading = !(index === 1 && category !== 'Balance');
    return (
      <View key={index} style={{ paddingBottom: xxxl }}>
        {isHeading && (
          <View style={styles.headerContainer}>
            <CustomText
              isHeading={true}
              text={index === 1 ? item : portfolioAccount.name}
              extraStyles={{ width: '85%' }}
              numberOfLines={2}
            />
            {isAccount && (
              <ArrowSwap
                disabled={!isArray(accounts)}
                onPress={() => onAccountSwitch()}
                style={{ marginTop: 5 }}
              />
            )}
          </View>
        )}
        {isAccount && (
          <FlatListView
            listKey="categoryList"
            vertical
            numColumns={4}
            style={styles.categories}
            columnWrapperStyle={{ justifyContent: 'space-around' }}
            scrollEnabled={false}
            data={categories}
            renderItem={renderCategories}
          />
        )}
        {isAccount && <Assets providerId={provider.id} category={category} />}
        {!isAccount && category === 'Balance' && <Activity isSeeMore />}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading && <Spinner isFullScreen={true} />}
      <FlatListView
        listKey="screenList"
        data={sections}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: xxl }}
        renderItem={renderSections}
        refreshControl={
          <RefreshLoader
            refreshing={isRefresh}
            onRefresh={() => handleRefresh()}
          />
        }
      />
    </View>
  );
});

export default AccountPortfolio;

const styles = StyleSheet.create({
  categories: { width: '90%', marginHorizontal: m, marginBottom: xl },
  headerContainer: {
    ...globalStyles.rowSpacing,
    alignItems: 'flex-start',
    flex: 0,
    paddingHorizontal: l,
    paddingBottom: spacing.xl,
  },
});
