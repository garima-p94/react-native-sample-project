import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { getUserAddressesState } from '@store/User';
import { isArray } from '@helpers';
import {
  CustomText,
  UserAddresses,
  Spinner,
  DeleteAlert,
  BaseHeader,
} from '@components';
import { spacing } from '@styles';
import { deleteUserAddress } from '@services';

export const UserAddressesList = React.memo(({ navigation }) => {
  const { navigate } = navigation;
  const [isLoading, setLoading] = useState(false);
  const addresses = useSelector(getUserAddressesState);

  const handleModify = useCallback(
    async ({ address, action }) => {
      if (action === 'delete') {
        DeleteAlert({
          onPressYes: async () => {
            await deleteUserAddress({ id: address.id });
          },
          text: 'Are you sure want to delete this address?',
        });
      } else if (action === 'edit') {
        navigate('ManageAddress', { isEdit: true, address });
      }
      return null;
    },
    [navigate],
  );

  const ListHeaderComponent = useCallback(
    () => (
      <CustomText
        isHeading={true}
        text="Addresses"
        extraStyles={{ paddingHorizontal: spacing.l }}
      />
    ),
    [],
  );

  return (
    <View style={{ flex: 1 }}>
      <BaseHeader showSubmit={false} />
      {isLoading && <Spinner isFullScreen={true} />}
      {!isLoading && (
        <View style={{ flex: 1 }}>
          {isArray(addresses) && (
            <UserAddresses
              list={addresses}
              isModify={true}
              onModify={handleModify}
              listProps={{
                ListHeaderComponent,
                contentContainerStyle: { paddingVertical: spacing.xxl },
              }}
            />
          )}
        </View>
      )}
    </View>
  );
});
