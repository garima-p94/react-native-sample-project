import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getUserAccountsListState,
  getPortfolioAccountState,
  storPortfolioAccount,
} from '@store/AccountPortfolio';
import { isObject, isArray } from '@helpers';
import { CrossIcon, CustomText, FlatListView, RadioButton } from '@components';
import { colors, globalStyles, wp, spacing } from '@styles';
import { ObjectType } from '@types';

const AccountSelection = () => {
  const { goBack } = useNavigation();
  const dispatch = useDispatch();
  const routes: ObjectType = useRoute();

  const onNavigateBack = routes.params?.onNavigateBack ?? null;
  const accounts = useSelector(getUserAccountsListState);
  const portfolioAccount = useSelector(getPortfolioAccountState);

  const handlePortAccount = useCallback(
    (e) => {
      if (isObject(e)) {
        dispatch(storPortfolioAccount(e));
        onNavigateBack && onNavigateBack(e);
        goBack();
      }
    },
    [dispatch, goBack, onNavigateBack],
  );

  const ListHeaderComponent = useCallback(
    () => (
      <View style={[globalStyles.rowSpacing, { flex: 0 }]}>
        <CustomText isHeading text="Accounts" size="xl" />
        <CrossIcon onPress={() => goBack()} />
      </View>
    ),
    [goBack],
  );

  const renderAccounts = useCallback(
    ({ item }) => (
      <RadioButton
        key={item.id}
        label={item.name}
        isSelected={portfolioAccount.id === item.id}
        extraStyles={{ marginTop: spacing.l }}
        onChange={() => handlePortAccount(item)}
        isDisabled={portfolioAccount.id === item.id}
      />
    ),
    [handlePortAccount, portfolioAccount],
  );

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => goBack()}>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          {isArray(accounts) && (
            <FlatListView
              data={[...accounts]}
              ListHeaderComponent={ListHeaderComponent}
              renderItem={renderAccounts}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AccountSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    width: wp(100),
    margin: 0,
  },
  subContainer: {
    flexGrow: 0,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.l,
    backgroundColor: colors.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    justifyContent: 'center',
  },
});
