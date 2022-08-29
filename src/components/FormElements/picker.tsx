import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { AngleDown, CustomText, FlatListView, Overlay } from '../UIComponents';
import { ifExist } from '@helpers';
import { CustomStyles, ListItemProps } from '@types';
import { globalStyles, colors, spacing } from '@styles';
import { FieldError, RadioButton } from './elements';
import { errorMessages } from '@constants';

interface PickerProps extends CustomStyles {
  isObjArray: boolean;
  list: Array<string> | Array<{}>;
  placeHolder?: string | number;
  valueKey?: string;
  displayKey?: string;
  value?: string | number;
  onChange?: (e: string | number | object) => void;
  isShowError: boolean;
  isInvalid: boolean;
  fieldStyles: StyleProp<ViewStyle>;
}

export const Picker = ({
  isObjArray,
  extraStyles,
  placeHolder,
  list,
  displayKey,
  valueKey,
  value,
  onChange,
  isInvalid,
  isShowError = true,
  fieldStyles,
}: PickerProps) => {
  const [isPicker, setIsPicker] = useState(false);

  const renderOptions = useCallback(
    ({ item, index }: ListItemProps) => {
      const isActive = isObjArray ? item[valueKey] === value : item === value;
      return (
        <View key={`${index}-${displayKey}`} style={styles.radioItems}>
          <RadioButton
            isSelected={isActive}
            label={isObjArray ? item[displayKey] : item}
            onChange={() => {
              setIsPicker(false);
              onChange && onChange(item);
            }}
          />
        </View>
      );
    },
    [displayKey, onChange, value, valueKey],
  );

  return (
    <View style={[styles.pickerContainer, fieldStyles]}>
      <Pressable
        style={[
          styles.picker,
          isInvalid && { backgroundColor: colors.lightRed },
          extraStyles,
        ]}
        onPress={() => setIsPicker(true)}>
        <CustomText
          text={ifExist(placeHolder) || 'Select...'}
          extraStyles={{ width: '75%' }}
        />
        <AngleDown
          disabled
          size={25}
          style={{ lineHeight: 14, top: spacing.xs }}
        />
      </Pressable>
      <FieldError isShow={isInvalid && isShowError} />
      {isPicker && (
        <Overlay isVisible={isPicker} onClose={() => setIsPicker(false)}>
          <FlatListView vertical data={list} renderItem={renderOptions} />
        </Overlay>
      )}
    </View>
  );
};
/* <CustomText text="something" /> */
Picker.defaultProps = {
  isObjArray: true,
  placeHolder: 'Select...',
  list: [],
  displayKey: 'display',
  valueKey: 'key',
  isShowError: true,
  isInvalid: false,
  fieldStyles: {},
};

const styles = StyleSheet.create({
  pickerContainer: {
    width: '100%',
    marginBottom: spacing.s,
  },
  picker: {
    ...globalStyles.rowSpacing,
    flex: 0,
    width: '100%',
    borderRadius: 15,
    backgroundColor: colors.lightGray,
    padding: spacing.s,
  },
  radioItems: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
  },
});
