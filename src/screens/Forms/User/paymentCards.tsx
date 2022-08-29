import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { View, Keyboard, StyleSheet } from 'react-native';
import {
  ScrollViewList,
  FormField,
  RoundedInput,
  BaseHeader,
  Picker,
  Spinner,
  Line,
} from '@components';
import { manageUserPaymentCard } from '@services';
import { isExist, isArray, isObject } from '@helpers';
import { globalStyles, spacing } from '@styles';
import { countries, USstates, months, cardExpiryYear } from '@constants';
import { useRoute } from '@react-navigation/native';

interface FormParams {
  name?: string;
  number?: string | number;
  expMonth?: { key?: string; display?: string } | string;
  expYear?: { key?: string; display?: string } | string;
  cvc?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressCity: string;
  addressState?: string;
  addressCountry?: string;
  addressZip?: number | string;
  isSaved?: boolean;
}
/*  name: '',
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
      addressLine1: '',
    addressLine2: '',
    addressCity: '',
    addressState: '',
    addressCountry: countryData[0],
    addressZip: '',
    cardObj.addressLine1 = shippingAddress.address;
    cardObj.addressLine2 = shippingAddress.address2;
    cardObj.addressCity = shippingAddress.city;
    cardObj.addressState = shippingAddress.state_province;
    cardObj.addressCountry = shippingAddress.country;
    cardObj.addressZip = shippingAddress.zip_code;*/
const reqdFields = [
  'name',
  'number',
  'expMonth',
  'expYear',
  'cvc',
  'addressLine1',
  'addressCity',
  'addressState',
  'addressZip',
  'addressCountry',
];
const creditCardRegex =
  /^((?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|(?:2131|1800|35\d{3})\d{11})|(?:(62[0-9]{14,17}))|3(?:0[0-5]|[68][0-9])[0-9]{11}|((?:4\d{3})|(?:5[1-5]\d{2})|(?:6011)|(?:3[68]\d{2})|(?:30[012345]\d))?(\d{4})?(\d{4})?(\d{4}|3[4,7]\d{13}))$/;
const cvcRegex = /^[0-9]{3,4}$/;

const ManagePaymentCards = React.memo(({ navigation }) => {
  const routes = useRoute();
  const { goBack } = navigation;
  const isEdit = routes.params?.isEdit ?? false;
  const card = routes.params?.card ?? {};

  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState<FormParams>({
    name: '',
    number: '',
    expMonth: {},
    expYear: {},
    cvc: '',
    addressLine1: '',
    addressLine2: '',
    addressCity: '',
    addressState: '',
    addressCountry: '',
    addressZip: '',
    isSaved: true,
  });
  const [missing, setMissing] = useState<Array<string>>([]);
  const [isStatePicker, setIsStatePicker] = useState(false);


  const onEdit = (f: string, v: any) => {
    isArray(missing) && setMissing([]);
    setParams((prev) => ({ ...prev, [f]: v }));
    if (f === 'country') {
      setIsStatePicker(v === 'United States');
    }
  };

  const onSubmit = useCallback(async () => {
    Keyboard.dismiss();
    if (isLoading) {
      return;
    }
    const errors: Array<string> = reqdFields.filter(
      (e) => !isExist(params[e]) && e,
    );
    if (!errors.includes('number') && !creditCardRegex.test(params.number)) {
      errors.push('number');
    }
    if (!errors.includes('cvc') && !cvcRegex.test(params.cvc)) {
      errors.push('cvc');
    }
    if (isArray(errors)) {
      setMissing([...errors]);
      return;
    } else {
      setLoading(true);
      await manageUserPaymentCard({
        params: {
          ...params,
          expMonth: params.expMonth.key,
          expYear: params.expYear.key,
        },
        isEdit: false,
      });
      setLoading(false);
      goBack();
    }
  }, [isLoading, params, goBack]);

  return (
    <View style={globalStyles.flex}>
      <BaseHeader text="New Card" onSubmit={() => onSubmit()} />
      {isLoading && <Spinner isFullScreen={false} isAbsolute />}
      <ScrollViewList contentContainerStyle={styles.scroll}>
        <FormField label="Payment">
          <RoundedInput
            field="name"
            value={params.name}
            placeholder="Name"
            handleChange={onEdit}
            isInvalid={missing.includes('name')}
          />
          <View style={globalStyles.rowSpacing}>
            <RoundedInput
              field="number"
              value={params.number}
              placeholder="Card Number"
              keyboardType="numeric"
              fieldStyles={{ width: '68%' }}
              handleChange={onEdit}
              isInvalid={missing.includes('number')}
            />
            <RoundedInput
              field="cvc"
              value={params.cvc}
              placeholder="CVC"
              fieldStyles={{ width: '30%' }}
              handleChange={onEdit}
              isInvalid={missing.includes('cvc')}
            />
          </View>
          <View style={globalStyles.rowSpacing}>
            <Picker
              placeHolder={params.expMonth ? params.expMonth.display : 'Month'}
              list={months}
              value={params.expMonth ? params.expMonth.key : ''}
              onChange={(item) => onEdit('expMonth', item)}
              isInvalid={missing.includes('expMonth')}
              fieldStyles={{ width: '48%' }}
            />
            <Picker
              placeHolder={params.expYear ? params.expYear.display : 'Year'}
              list={cardExpiryYear}
              value={params.expYear ? params.expYear.key : ''}
              onChange={(item) => onEdit('expYear', item)}
              isInvalid={missing.includes('expYear')}
              fieldStyles={{ width: '48%' }}
            />
          </View>
        </FormField>
        <Line />

        <FormField label="Billing Address" style={{ marginTop: spacing.xxl }}>
          <RoundedInput
            field="addressLine1"
            value={params.addressLine1}
            placeholder="Address"
            handleChange={onEdit}
            isInvalid={missing.includes('addressLine1')}
          />
          <RoundedInput
            field="addressLine2"
            value={params.addressLine2}
            placeholder="Apt, Suite, Building"
            handleChange={onEdit}
          />
          <RoundedInput
            field="addressCity"
            value={params.addressCity}
            placeholder="City"
            handleChange={onEdit}
            isInvalid={missing.includes('addressCity')}
          />
          <View style={globalStyles.rowSpacing}>
            <RoundedInput
              field="addressZip"
              value={params.addressZip}
              placeholder="Zip"
              fieldStyles={{ width: '45%' }}
              handleChange={onEdit}
              isInvalid={missing.includes('addressZip')}
            />
            {isStatePicker ? (
              <Picker
                placeHolder={params.addressState || 'State'}
                list={USstates}
                displayKey="name"
                valueKey="state_code"
                value={params.addressState || {}}
                onChange={(v) => onEdit('addressState', v)}
                isInvalid={missing.includes('addressState')}
                fieldStyles={{ width: '48%' }}
              />
            ) : (
              <RoundedInput
                field="addressState"
                value={params.addressState}
                placeholder={params.addressState || 'State'}
                fieldStyles={{ width: '48%' }}
                handleChange={onEdit}
                isInvalid={missing.includes('addressState')}
              />
            )}
          </View>
          <Picker
            isObjArray={false}
            placeHolder={params.addressCountry || 'Country'}
            list={countries}
            value={params.addressCountry || {}}
            onChange={(v) => onEdit('addressCountry', v)}
            isInvalid={missing.includes('addressCountry')}
          />
        </FormField>
      </ScrollViewList>
    </View>
  );
});

export default ManagePaymentCards;

const styles = StyleSheet.create({
  scroll: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.m,
  },
});
