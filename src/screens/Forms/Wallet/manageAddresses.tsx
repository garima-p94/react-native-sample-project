import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getCategoriesState } from '@store/Categories';
import { getCategories, manageWalletAddress } from '@services';
import { isArray, isExist, getInitials, isObject } from '@helpers';
import {
  BaseHeader,
  CustomText,
  FlatListView,
  RadioButton,
  RoundedInput,
  Spinner,
} from '@components';
import { spacing, globalStyles, colors } from '@styles';
import { ObjectType } from '@types';

const ManageWalletAddresses = () => {
  const { goBack } = useNavigation();
  const routes: ObjectType = useRoute();
  const excludeCategories: Array<string> =
    routes.params?.excludeCategories ?? [];
  const onNavigateBack = routes.params?.onNavigateBack ?? null;

  const [isLoading, setIsLoading] = useState(true);
  const [typeList, setTypeList] = useState([]);
  const [addressName, setAddrName] = useState('');
  const [selected, setSelected] = useState({});
  const addressTypes = useSelector((state) =>
    getCategoriesState(state, 'walletAddrTypes'),
  );

  useEffect(() => {
    const fetchTypes = async () => {
      let list = [];
      if (!isArray(addressTypes)) {
        list = await getCategories({ type: 'walletAddrTypes' });
      } else {
        list = [...addressTypes];
      }
      if (isArray(excludeCategories)) {
        list = list.filter(
          (e: ObjectType) => !excludeCategories.includes(e.id),
        );
      }
      isArray(list) && setTypeList([...list]);
      setIsLoading(false);
    };
    fetchTypes();
  }, []);

  const isSubmit = useMemo(() => {
    return !isLoading && isObject(selected) && isExist(addressName);
  }, [addressName, isLoading, selected]);

  const onSubmit = useCallback(async () => {
    if (isSubmit) {
      setIsLoading(true);
      await manageWalletAddress({
        params: { wallet_type: selected.id, name: addressName },
      });
      setIsLoading(false);
      onNavigateBack && onNavigateBack();
      goBack();
    }
  }, [addressName, goBack, isSubmit, onNavigateBack, selected]);

  const ListHeaderComponent = useCallback(() => {
    return (
      <View>
        <CustomText isHeading text="Add Crypto Addresses" />
        <View style={{ marginTop: spacing.xl }}>
          <CustomText isHeading size="l" text="Crypto Address Name" />
          <RoundedInput
            field="addressName"
            handleChange={(f, v) => setAddrName(v)}
            extraStyles={{ marginTop: spacing.l }}
          />
        </View>
      </View>
    );
  }, []);

  const renderAddressesTypes = useCallback(
    ({ item, index }) => (
      <View key={`${index}-${item.id}`}>
        {index === 0 && (
          <CustomText
            text="Crypto Address Type"
            isHeading
            size="l"
            extraStyles={{ marginBottom: spacing.s }}
          />
        )}
        <TouchableOpacity
          onPress={() => setSelected(item)}
          style={styles.address}>
          <View style={styles.addressColor}>
            <CustomText
              text={getInitials({ str: item.listname, length: 1 })}
              size="m"
              isHeading
              extraStyles={{ color: colors.white }}
            />
          </View>
          {/* <CustomText
            text="BTC"
            size="m"
            isHeading
            // extraStyles={{ color: colors.white }}
          /> */}
          <RadioButton
            label={item.listname}
            isSelected={selected.id === item.id}
            extraStyles={{ width: '80%' }}
            onChange={() => setSelected(item)}
          />
        </TouchableOpacity>
      </View>
    ),
    [selected],
  );

  return (
    <View style={{ flex: 1 }}>
      <BaseHeader
        text="Address"
        isSubmitDisabled={!isSubmit}
        onSubmit={onSubmit}
      />
      {isLoading && <Spinner isFullScreen={false} isAbsolute={true} />}
      <FlatListView
        style={{ paddingHorizontal: spacing.l, paddingVertical: spacing.xxl }}
        data={typeList}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={renderAddressesTypes}
        ListHeaderComponent={ListHeaderComponent}
      />
    </View>
  );
};

export default ManageWalletAddresses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: spacing.xxl,
  },
  walletList: {
    justifyContent: 'space-between',
    marginHorizontal: spacing.m,
    marginBottom: spacing.m,
  },
  address: {
    ...globalStyles.rowSpacing,
    flex: 0,
    width: '100%',
    marginTop: spacing.m,
  },
  addressColor: {
    ...globalStyles.columnCenter,
    ...globalStyles.shadowContainer,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    flex: 0,
    width: 60,
    height: 35,
    borderRadius: 5,
    backgroundColor: '#ff9f00',
    borderColor: '#ff9f00',
  },
});
