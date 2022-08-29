import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getCategoriesState } from '@store/Categories';
import { getCategories } from '@services';
import { isArray, isObject } from '@helpers';
import { BaseHeader, CustomText, Spinner, WalletList } from '@components';
import { globalStyles, spacing } from '@styles';
import { ObjectType } from '@types';
import { walletProvidersCatIds } from '@constants';

const WalletTypeSelection = () => {
  const { navigate, goBack } = useNavigation();
  const routes: ObjectType = useRoute();
  const onNavigateBack = routes.params?.onNavigateBack ?? null;
  const [isLoading, setLoading] = useState(true);
  const walletProviders = useSelector((state) =>
    getCategoriesState(state, 'walletProviders'),
  );

  useEffect(() => {
    const fetchWallets = async () => {
      if (!isArray(walletProviders)) {
        await getCategories({ type: 'walletProviders' });
      }
      setLoading(false);
    };
    fetchWallets();
  }, []);

  const onConnect = useCallback(
    (wallet: ObjectType) => {
      if (isObject(wallet)) {
        if (wallet.id === walletProvidersCatIds.app) {
          goBack();
          navigate('ManageWalletAddresses', {
            // excludeCategories: ids,
            onNavigateBack: async () => {
              onNavigateBack && onNavigateBack();
            },
          });
        } else if (wallet.id === walletProvidersCatIds.walletConnect) {
          // connect walletConnect
        }
      }
    },
    [goBack, navigate, onNavigateBack],
  );

  const ListHeaderComponent = useCallback(() => {
    return (
      <CustomText
        isHeading
        text="Connect Wallets"
        extraStyles={{ marginHorizontal: spacing.l, marginBottom: spacing.l }}
      />
    );
  }, []);

  return (
    <View style={globalStyles.flex}>
      <BaseHeader showSubmit={false} text="Wallet Type" />
      {isLoading && <Spinner isFullScreen={false} isAbsolute />}
      {!isLoading && isArray(walletProviders) && (
        <WalletList
          list={walletProviders}
          handleWallet={(e) => onConnect(e)}
          listProps={{
            style: styles.container,
            columnWrapperStyle: styles.walletList,
            ListHeaderComponent,
          }}
        />
      )}
    </View>
  );
};

export default WalletTypeSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: spacing.xxl,
  },
  walletList: {
    justifyContent: 'space-between',
    marginHorizontal: spacing.l,
    marginBottom: spacing.m,
  },
});
