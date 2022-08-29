import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { FlatListView, CustomText } from '../UIComponents';
import { isExist } from '@helpers';
import { spacing, fonts, colors, wp, globalStyles, hp } from '@styles';
import { ListProps, ListItemProps, ObjectType } from '@types';
import FastImage from 'react-native-fast-image';

interface WalletProps extends ListProps {
  list: Array<{ display: string }>;
  isHorizontal?: boolean;
  listProps?: ObjectType;
  handleWallet?: (e: ObjectType) => void;
}
const { white } = colors;

/*
 *
 * Wallet List
 *
 */

export const WalletList = ({
  list,
  isHorizontal,
  listProps,
  handleWallet,
}: WalletProps) => {
  const renderWallets = ({ item, index }: ListItemProps) => (
    <TouchableOpacity
      key={index}
      style={[styles.itemContainer]}
      onPress={() => handleWallet && handleWallet(item)}>
      <FastImage source={{ uri: item.image_small }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <FlatListView
      horizontal={isHorizontal}
      data={list}
      renderItem={renderWallets}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      {...listProps}
    />
  );
};

export const AddressCard = ({ address, onPress }: ObjectType) => {
  const settings = useMemo(() => {
    return address.wallet_setting
      ? JSON.parse(address.wallet_setting)
      : { color: colors.white };
  }, [address]);

  return (
    <Pressable
      disabled={!isExist(onPress)}
      onPress={() => onPress && onPress()}
      style={[styles.addressCard, { backgroundColor: settings.color }]}>
      <View />
      {isExist(address.wallet_address) && (
        <View style={[globalStyles.columnSpacing, { width: '95%' }]}>
          <CustomText
            size="l"
            isHeading
            isWhiteTxt
            text={address.wallet_name.toUpperCase()}
            extraStyles={{ textAlign: 'center', marginBottom: spacing.m }}
            onPress={() => onPress && onPress()}
          />
          <QRCode
            size={80}
            value={address.wallet_address}
            backgroundColor="transparent"
          />
          <CustomText
            size="m"
            isHeading
            text={`${address.wallet_address}`}
            extraStyles={styles.address}
          />
        </View>
      )}
      <View />
    </Pressable>
  );
};
AddressCard.defaultProps = {
  address: {},
  onPress: null,
};

const styles = StyleSheet.create({
  itemContainer: {
    ...globalStyles.shadowContainer,
    aspectRatio: 0.7,
    width: wp(38),
    justifyContent: 'center',
    borderRadius: 10,
  },
  itemText: {
    marginTop: spacing.s,
    alignSelf: 'center',
    fontSize: fonts.xl,
    color: white,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  columnWrapper: {
    paddingHorizontal: spacing.l,
    marginTop: spacing.l,
    justifyContent: 'space-between',
  },
  addressCard: {
    ...globalStyles.shadowContainer,
    width: '100%',
    height: hp(30),
    borderRadius: 10,
    marginTop: spacing.l,
    paddingVertical: spacing.l,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  address: {
    color: colors.white,
    width: '95%',
    marginTop: spacing.m,
    textAlign: 'center',
  },
});
