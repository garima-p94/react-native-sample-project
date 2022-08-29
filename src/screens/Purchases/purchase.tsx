import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getActiveCustomerState } from '@store/User';
import {
  CategoryType,
  CustomText,
  FlatListView,
  ImageObject,
  Spinner,
  ButtonText,
  SectionListView,
  OrdersList,
} from '@components';
import { isArray, ifExist, isObject } from '@helpers';
import { spacing, globalStyles } from '@styles';
import { getMyPurchases } from '@services';
import { getUserPurchasesState } from '@store/Orders';
import { orderFilters } from '@constants';

const { m, l, xl } = spacing;
const sections = [{ title: 'My Bag', data: [{ id: '' }] }];

const UserPurchases = () => {
  const { navigate } = useNavigation();
  const [isLoading, setLoading] = useState(true);
  const [isRefresh, setRefresh] = useState(false);
  const [isLoadMore, setLoadMore] = useState(false);
  const [isCallLoadMore, setIsCallLoadMore] = useState(true);
  const [pgnum, setPgNum] = useState(1);
  const [tab, setTab] = useState(orderFilters[0]);
  const customer = useSelector(getActiveCustomerState);
  const purchases = useSelector(getUserPurchasesState);

  useEffect(() => {
    const fetchPurchases = async () => {
      await getMyPurchases({
        isRefresh: true,
        params: {
          pgnum,
          customer_id: ifExist(customer.cust_id) || '',
          category_id: tab.ids,
        },
      });
      setLoading(false);
    };
    fetchPurchases();
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
      setLoading(true);
      setPgNum(1);
      const selected = orderFilters[0];
      setTab(selected);
      setIsCallLoadMore(true);
      await getMyPurchases({
        isRefresh: true,
        params: {
          customer_id: customer.cust_id,
          category_id: selected.ids,
        },
      });
      setLoading(false);
    }
  }, [isRefresh, customer]);

  const onLoadMore = async () => {
    if (!isLoading && isCallLoadMore && !isLoadMore) {
      setLoadMore(true);
      setPgNum(pgnum + 1);
      const res = await getMyPurchases({
        params: {
          page: pgnum + 1,
          customer_id: customer.cust_id,
          category_id: tab.ids,
        },
      });
      setIsCallLoadMore(isArray(res) && res.length >= 12);
      setLoadMore(false);
    }
  };

  const onTabChange = useCallback(
    async (e) => {
      if (isObject(e) && e.key !== tab.key) {
        setTab(e);
        setPgNum(1);
        setLoading(true);
        setIsCallLoadMore(true);
        await getMyPurchases({
          isRefresh: true,
          params: {
            customer_id: customer.cust_id,
            category_id: e.ids,
            page: 1,
          },
        });
        setLoading(false);
      }
    },
    [customer, tab],
  );

  const renderCategories = useCallback(
    ({ item }) => (
      <ButtonText
        key={item.key}
        isInactive={tab.key !== item.key}
        size="s"
        text={item.display}
        onPress={() => onTabChange(item)}
      />
    ),
    [onTabChange, tab],
  );

  const renderPurchases = ({ item, index }) => (
    <View key={`${index}-${item.id}`} style={styles.purchase}>
      {index === 0 && (
        <View style={[styles.flexRow, { marginBottom: spacing.l }]}>
          <CustomText
            isHeading
            text="Your Crypto Assets"
            size="l"
            extraStyles={{ width: '48%' }}
          />
          <CustomText
            isHeading
            text="Included Products"
            size="l"
            extraStyles={{ width: '48%' }}
          />
        </View>
      )}
      <View style={styles.flexRow}>
        <ImageObject
          isShadow
          uiType="square"
          object={{ ...item, objectType: 'Product' }}
          extraStyles={{ width: '45%' }}
          // isClickable
          // onClick={() => navigate('PurchaseDetails', { orderItem: item })}
        />
        {isArray(item.included_products) && (
          <View style={{ width: '48%' }}>
            {item.included_products.slice(0, 2).map((e) => (
              <View key={e.id} style={styles.includedProducts}>
                <ImageObject
                  isShadow
                  uiType="square"
                  object={{ ...e }}
                  extraStyles={{ width: '35%' }}
                />
                <View style={{ width: '62%' }}>
                  <CategoryType
                    text="some catgeory"
                    extraStyles={{ marginBottom: spacing.xs }}
                  />
                  <CustomText isHeading text="Included Products" size="s" />
                </View>
              </View>
            ))}
            {item.included_products.length > 2 && (
              <CustomText
                isHeading={true}
                text="See More"
                size="s"
                onPress={() => {}}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <SectionListView
        sections={sections}
        contentContainerStyle={styles.container}
        refreshing={isRefresh}
        onRefresh={() => handleRefresh()}
        onEndReachedThreshold={0.5}
        onEndReached={() => onLoadMore()}
        renderSectionHeader={() => (
          <View>
            {isLoading && <Spinner isFullScreen={false} isAbsolute={true} />}
            <CustomText
              isHeading={true}
              text="My Bag"
              extraStyles={{
                paddingHorizontal: spacing.l,
                marginBottom: spacing.xl,
              }}
            />
            <FlatListView
              listKey="orderfilters"
              vertical
              numColumns={4}
              style={styles.categories}
              columnWrapperStyle={{ justifyContent: 'space-around' }}
              scrollEnabled={false}
              data={orderFilters}
              renderItem={renderCategories}
            />
          </View>
        )}
        renderItem={() => (
          <View style={{ marginTop: xl }}>
            {tab.key === 'nfts' ? (
              <FlatListView
                listKey="screenList"
                data={[...purchases]}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingVertical: spacing.xxl }}
                renderItem={renderPurchases}
                vertical={true}
              />
            ) : (
              <OrdersList
                orders={purchases}
                showCryptoAmt
                extraFlatListProps={{
                  style: {
                    marginBottom: spacing.l,
                    marginHorizontal: spacing.l,
                  },
                }}
              />
            )}
            {isLoadMore && <Spinner isFullScreen={false} />}
            {/* providerId, type -> props of <Assets /> */}
          </View>
        )}
      />
    </View>
  );
};

export default UserPurchases;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: spacing.xxl,
  },
  flexRow: {
    ...globalStyles.rowSpacing,
    width: '100%',
  },
  includedProducts: {
    ...globalStyles.rowSpacing,
    alignSelf: 'flex-start',
    flex: 0,
    width: '100%',
    marginBottom: spacing.s,
  },
  purchase: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.l,
  },
  categories: { width: '70%', marginHorizontal: m, marginBottom: l },
});
