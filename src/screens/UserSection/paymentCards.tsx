import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { getUserPaymentCardsState } from '@store/User';
import { isArray } from '@helpers';
import {
  CustomText,
  PaymentCards,
  Spinner,
  DeleteAlert,
  BaseHeader,
} from '@components';
import { spacing } from '@styles';
import { deleteUserPaymentCard } from '@services';

export const PaymentCardsList = React.memo(() => {
  const [isLoading, setLoading] = useState(false);
  const cardsList = useSelector(getUserPaymentCardsState);

  const handleDelete = useCallback(({ card }) => {
    DeleteAlert({
      text: 'Are you sure want to delete this card?',
      onPressYes: async () => {
        setLoading(true);
        await deleteUserPaymentCard(card);
        setLoading(false);
      },
    });
  }, []);

  const ListHeaderComponent = useCallback(
    () => (
      <CustomText
        isHeading={true}
        text="Payment Options"
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
          {isArray(cardsList.crypto_cards) && (
            <PaymentCards
              list={cardsList.crypto_cards}
              isModify={true}
              onModify={handleDelete}
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
