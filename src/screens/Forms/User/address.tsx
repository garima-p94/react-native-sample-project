import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { View, Keyboard, StyleSheet } from 'react-native';
import {
  ScrollViewList,
  FormField,
  RoundedInput,
  BaseHeader,
  Picker,
} from '@components';
import { manageUserAddresses } from '@services';
import { isExist, isArray, isObject } from '@helpers';
import { globalStyles, spacing } from '@styles';
import { countries, USstates } from '@constants';
import { useRoute } from '@react-navigation/native';

interface FormParams {
  first_name?: string;
  last_name?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string | object;
  country?: string | object;
  zip_code?: number | string;
}

const reqdFields = [
  'first_name',
  'last_name',
  'address',
  'city',
  'zip_code',
  'state',
  'country',
];
const ManageAddress = React.memo(({ navigation }) => {
  const routes = useRoute();
  const { goBack } = navigation;
  const isEdit = routes.params?.isEdit ?? false;
  const address = routes.params?.address ?? {};

  const [params, setParams] = useState<FormParams>({
    first_name: '',
    last_name: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
  });
  const [missing, setMissing] = useState<Array<string>>([]);
  const [isStatePicker, setIsStatePicker] = useState(false);

  useEffect(() => {
    if (isEdit && isObject(address)) {
      const newParams = { ...address, state: address.state_province };
      setIsStatePicker(address.country === 'United States');
      setParams(newParams);
    }
  }, []);

  const onEdit = (f: string, v: any) => {
    isArray(missing) && setMissing([]);
    setParams((prev) => ({
      ...prev,
      [f]: v,
    }));
    if (f === 'country') {
      setIsStatePicker(v === 'United States');
    }
  };

  const onSubmit = useCallback(async () => {
    Keyboard.dismiss();
    const errors: Array<string> = reqdFields.filter(
      (e) => !isExist(params[e]) && e,
    );
    if (isArray(errors)) {
      setMissing([...errors]);
      return;
    } else {
      await manageUserAddresses({ params, isEdit, addressId: params.id });
      goBack();
    }
  }, [params, isEdit, goBack]);

  return (
    <View style={globalStyles.flex}>
      <BaseHeader text="Address" onSubmit={() => onSubmit()} />

      <ScrollViewList contentContainerStyle={styles.scroll}>
        <FormField label="Name">
          <View style={globalStyles.rowSpacing}>
            <RoundedInput
              field="first_name"
              value={params.first_name}
              placeholder="First Name"
              fieldStyles={{ width: '48%' }}
              handleChange={onEdit}
              isInvalid={missing.includes('first_name')}
            />
            <RoundedInput
              field="last_name"
              value={params.last_name}
              placeholder="Last Name"
              fieldStyles={{ width: '48%' }}
              handleChange={onEdit}
              isInvalid={missing.includes('last_name')}
            />
          </View>
        </FormField>

        <FormField label="Address">
          <RoundedInput
            field="address"
            value={params.address}
            placeholder="Address"
            handleChange={onEdit}
            isInvalid={missing.includes('address')}
          />
          <RoundedInput
            field="address2"
            value={params.address2}
            placeholder="Apt, Suite, Building"
            handleChange={onEdit}
          />
          <RoundedInput
            field="city"
            value={params.city}
            placeholder="City"
            handleChange={onEdit}
            isInvalid={missing.includes('city')}
          />
          <View style={globalStyles.rowSpacing}>
            <RoundedInput
              field="zip_code"
              value={params.zip_code}
              placeholder="Zip"
              fieldStyles={{ width: '45%' }}
              handleChange={onEdit}
              isInvalid={missing.includes('zip_code')}
            />
            {isStatePicker ? (
              <Picker
                placeHolder={params.state || 'State'}
                list={USstates}
                displayKey="name"
                valueKey="state_code"
                value={params.state || {}}
                onChange={(v) => onEdit('state', v)}
                isInvalid={missing.includes('state')}
                fieldStyles={{ width: '48%' }}
              />) : (
                <RoundedInput
                  field="state"
                  value={params.state}
                  placeholder={params.state || 'State'}
                  fieldStyles={{ width: '48%' }}
                  handleChange={onEdit}
                  isInvalid={missing.includes('state')}
                />
              )}
          </View>
          <Picker
              isObjArray={false}
              placeHolder={params.country || 'Country'}
              list={countries}
              value={params.country || {}}
              onChange={(v) => onEdit('country', v)}
              isInvalid={missing.includes('country')}
            />
        </FormField>
      </ScrollViewList>
    </View>
  );
});

export default ManageAddress;

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: spacing.xl,
  },
});
