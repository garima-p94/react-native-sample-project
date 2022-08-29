import React, { useRef, useMemo } from 'react';
import { View, Animated } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { onCopyText } from '@helpers';
import {
  TabHeader,
  CustomText,
  ScrollViewList,
  AddressCard,
} from '@components';
import { globalStyles, spacing } from '@styles';
import { ObjectType } from '@types';

const AddressDetails = () => {
  const routes: ObjectType = useRoute();

  const address: ObjectType = useMemo(() => {
    const obj = routes.params?.address ?? {};
    return { ...obj };
  }, [routes]);

  const posY = useRef(new Animated.Value(0)).current;

  return (
    <View style={globalStyles.flex}>
      <TabHeader isShowBack text="Address" />
      <ScrollViewList
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: posY } } }],
          { useNativeDriver: false },
        )}
        style={{ paddingVertical: spacing.xxl, paddingHorizontal: spacing.l }}>
        <CustomText isHeading text="Crypto Address Card" />
        <AddressCard
          address={{ ...address }}
          onPress={() => onCopyText(address.wallet_address)}
        />
      </ScrollViewList>
    </View>
  );
};

export default AddressDetails;

