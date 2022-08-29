import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { isArray } from '@helpers';
import { getCategoriesState } from '@store/Categories';
import { BaseHeader, CustomText, WalletList, PlusButton } from '@components';
import { globalStyles, spacing } from '@styles';

const UserWallets = () => {
  const { navigate } = useNavigation();
  const walletProviders = useSelector((state) =>
    getCategoriesState(state, 'walletProviders'),
  );

  const ListHeaderComponent = useCallback(() => {
    return (
      <View style={styles.headingContainer}>
        <CustomText isHeading text="Wallets" />
        <PlusButton
          onPress={() => navigate('WalletTypeSelection')}
        />
      </View>
    );
  }, [navigate]);

  return (
    <View style={{ flex: 1 }}>
      <BaseHeader showSubmit={false} text="Wallets" />
      {isArray(walletProviders) && (
        <WalletList
          list={walletProviders.slice(0, 1)}
          handleWallet={(walletType) =>
            navigate('WalletInformation', { walletType })
          }
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

export default UserWallets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: spacing.xxl,
  },
  headingContainer: {
    ...globalStyles.rowSpacing,
    width: '100%',
    paddingHorizontal: spacing.l,
    marginBottom: spacing.l,
  },
  walletList: {
    justifyContent: 'space-between',
    marginHorizontal: spacing.l,
    marginBottom: spacing.m,
  },
});
