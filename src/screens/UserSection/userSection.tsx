import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { getAppModeState, storeAppInitPhase, storeAppMode } from '@store/App';
import {
  getUserAddressesState,
  getUserPaymentCardsState,
  logoutUser,
} from '@store/User';
import {
  getUserWalletsState,
  getUserAccountsListState,
} from '@store/AccountPortfolio';
import { isArray } from '@helpers';
import {
  isAuthenticatedStatus,
  onAppModeChange,
  getUserWallets,
  getUserAccounts,
} from '@services';
import {
  FlatListView,
  CustomText,
  WalletList,
  PlusButton,
  PaymentCards,
  UserAddresses,
  Toggle,
  LogoutAlert,
  Spinner,
} from '@components';
import { InitializeProcessContext } from '@context';
import { spacing, globalStyles } from '@styles';
import { storePhases } from '@constants';

const { xxxl, xl, xxl, l } = spacing;
const sections = [
  {
    key: 'wallets',
    display: 'My Wallets',
  },
  {
    key: 'cards',
    display: 'My Payment Options',
  },
  {
    key: 'addresses',
    display: 'My Addresses',
  },
];

const UserSection = React.memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { onStartProcess } = useContext(InitializeProcessContext);

  const [isLoading, setLoading] = useState(true);

  const cardsList = useSelector(getUserPaymentCardsState);
  const addresses = useSelector(getUserAddressesState);
  const mode = useSelector(getAppModeState);
  const userWallets = useSelector(getUserWalletsState);
  const userAccounts = useSelector(getUserAccountsListState);

  useEffect(() => {
    const fetchWallets = async () => {
      if (!isArray(userWallets)) {
        await getUserWallets({});
      }
      setLoading(false);
    };
    fetchWallets();
  }, []);

  const handleTestMode = useCallback(async () => {
    dispatch(storeAppInitPhase(storePhases.loading));
    dispatch(storeAppMode(mode === '1' ? '0' : '1'));
    await onAppModeChange();
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'AppNavigator', params: { loginScreen: true } }],
    });
    navigation.dispatch(resetAction);
    onStartProcess();
  }, [dispatch, mode, navigation, onStartProcess]);

  const getList = useCallback(
    (key) => {
      let list: any[] = [];
      if (key === 'wallets') {
        list = userWallets;
      } else if (key === 'cards') {
        list = isArray(cardsList.crypto_cards)
          ? [...cardsList.crypto_cards]
          : [];
      } else if (key === 'addresses') {
        list = addresses;
      }
      if (isArray(list)) {
        list = list.slice(0, 2);
      }
      return list;
    },
    [userWallets, cardsList, addresses],
  );

  const onAdd = useCallback(
    (key) => {
      if (key === 'addresses') {
        navigation.navigate('ManageAddress');
      } else if (key === 'cards') {
        navigation.navigate('ManagePaymentCards');
      } else if (key === 'wallets') {
        navigation.navigate('WalletTypeSelection', {
          onNavigateBack: async () => {
            setLoading(true);
            await getUserWallets({});
            setLoading(false);
            // update user accounts list if no crypto accounts exist
            !isArray(userAccounts) && (await getUserAccounts());
          },
        });
      }
    },
    [navigation, userAccounts],
  );

  const onSeeAll = useCallback(
    (key) => {
      if (key === 'cards') {
        navigation.navigate('PaymentCardsList');
      } else if (key === 'addresses') {
        navigation.navigate('UserAddressesList');
      } else if (key === 'wallets') {
        navigation.navigate('UserWallets');
      }
    },
    [navigation],
  );

  const onLogOut = useCallback(() => {
    LogoutAlert({
      onPressYes: async () => {
        await isAuthenticatedStatus(false);
        await dispatch(logoutUser());
        // navigation.navigate('EmailLogin');
      },
    });
  }, [dispatch]);

  const renderSections = useCallback(
    ({ item, index }) => {
      const list = getList(item.key);
      return (
        <View key={index} style={{ paddingBottom: xxxl }}>
          <View style={styles.headingContainer}>
            <CustomText
              isHeading={true}
              text={item.display}
              extraStyles={{ width: '80%' }}
            />
            <PlusButton onPress={() => onAdd(item.key)} />
          </View>
          {item.key === 'wallets' && (
            <WalletList
              list={list}
              handleWallet={(e) =>
                navigation.navigate('WalletInformation', { walletType: e })
              }
            />
          )}
          {item.key === 'cards' && <PaymentCards list={[...list]} />}
          {item.key === 'addresses' && <UserAddresses list={[...list]} />}
          {list.length > 2 && (
            <CustomText
              isHeading
              text="See all"
              size="m"
              extraStyles={styles.seeAllTxt}
              onPress={() => onSeeAll(item.key)}
            />
          )}
        </View>
      );
    },
    [getList, navigation, onAdd, onSeeAll],
  );

  const FooterComponent = useCallback(
    () => (
      <View style={{ paddingHorizontal: l }}>
        <Toggle
          textSize="xl"
          isEnabled={mode === '1'}
          heading="Test Mode"
          onChange={() => handleTestMode()}
        />
        <CustomText
          isHeading
          text="Logout"
          size="xl"
          extraStyles={{ marginTop: spacing.m }}
          onPress={() => onLogOut()}
        />
      </View>
    ),
    [handleTestMode, mode, onLogOut],
  );

  return (
    <View style={{ flex: 1 }}>
      {isLoading && <Spinner />}
      <FlatListView
        listKey="screenList"
        data={sections}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: xxl }}
        renderItem={renderSections}
        ListFooterComponent={FooterComponent}
      />
    </View>
  );
});

export default UserSection;

const styles = StyleSheet.create({
  seeAllTxt: {
    alignSelf: 'flex-end',
    paddingHorizontal: l,
    marginTop: l,
  },
  headingContainer: {
    ...globalStyles.rowSpacing,
    width: '100%',
    paddingHorizontal: l,
  },
});
