import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getAllWalletAddressesState } from '@store/AccountPortfolio';
import { ifExist, isArray, isObject } from '@helpers';
import {
  TabHeader,
  CustomText,
  FlatListView,
  PlusButton,
  Spinner,
  AddressCard,
} from '@components';
import { globalStyles, spacing, colors, hp } from '@styles';
import { ObjectType } from '@types';
import { walletProvidersCatIds } from '@constants';

const WalletInformation = () => {
  const { navigate } = useNavigation();
  const routes: ObjectType = useRoute();

  const allAddresses = useSelector(getAllWalletAddressesState);

  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState<Array<ObjectType>>([]);

  const { walletType, isInternal } = useMemo(() => {
    let e = routes.params?.walletType ?? {};
    const isApp = e.id === walletProvidersCatIds.app;
    const styles = e.listdisptext ? JSON.parse(e.listdisptext) : {};
    const backgroundColor = styles.color ? styles.color : colors.black;
    const color = isApp ? colors.appBlue : colors.white;
    return {
      walletType: {
        ...e,
        backgroundColor: backgroundColor,
        color,
      },
      isInternal: isApp,
    };
  }, [routes]);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = useCallback(async () => {
    if (isObject(walletType)) {
      const addresses = allAddresses.filter(
        (e) => e.wallet_provider_category_id === walletType.id,
      );
      isArray(addresses) && setAddresses([...addresses]);
    }
    setIsLoading(false);
  }, [walletType, allAddresses]);

  const onAddNew = useCallback(() => {
    let ids = [];
    if (isArray(addresses)) {
      ids = addresses.map((e: ObjectType) => e.wallet_category_id);
    }
    navigate('ManageWalletAddresses', {
      excludeCategories: ids,
      onNavigateBack: () => {
        setIsLoading(true);
        fetchAddresses();
      },
    });
  }, [addresses, navigate, fetchAddresses]);

  const renderAddresses = useCallback(
    ({ item, index }) => (
      <View key={index} style={{ top: -(index * hp(26)) }}>
        <AddressCard
          address={{ ...item }}
          onPress={() => navigate('AddressDetails', { address: item })}
        />
      </View>
    ),
    [navigate],
  );

  return (
    <View style={{ flex: 1 }}>
      <TabHeader isShowBack text="Wallet" />
      {isLoading && <Spinner isFullScreen={false} isAbsolute />}
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <CustomText
            isHeading
            text={`${ifExist(walletType.listname) || ''} Wallet`}
          />
          {isInternal && <PlusButton onPress={() => onAddNew()} />}
        </View>
        <View
          style={[
            styles.walletContainer,
            {
              backgroundColor: walletType.backgroundColor,
            },
          ]}>
          {isArray(addresses) ? (
            <FlatListView
              scrollEnabled={addresses.length > 5} //
              data={[...addresses]}
              renderItem={renderAddresses}
              contentContainerStyle={{ zIndex: 9, position: 'relative' }}
            />
          ) : (
            <View style={{ flex: 1 }} />
          )}
          <CustomText
            isHeading
            size="xl"
            isWhiteTxt
            text={walletType.listname.toUpperCase()}
            extraStyles={{
              textAlign: 'center',
              color: walletType.color,
              justifyContent: 'flex-end',
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default WalletInformation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.m,
  },
  headingContainer: {
    ...globalStyles.rowSpacing,
    flex: 0,
    width: '100%',
    marginBottom: spacing.l,
  },
  walletContainer: {
    ...globalStyles.shadowContainer,
    flex: 0.95,
    // flex: 0,
    borderRadius: 10,
    padding: spacing.m,
    backgroundColor: colors.black,
    shadowOffset: {
      width: 5,
      height: 5,
    },
  },
  category: {
    width: '100%',
    height: hp(25),
    // aspectRatio: 1.8,
    borderRadius: 10,
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.l,
    paddingTop: spacing.m,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
