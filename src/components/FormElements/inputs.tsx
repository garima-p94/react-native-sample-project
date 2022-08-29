import React from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
  View,
} from 'react-native';
import { colors, spacing } from '@styles';
import { FieldError } from './elements';

interface RoundedInputProps extends TextInputProps {
  field: string;
  handleChange?: (f: string, v: string | number) => void;
  extraStyles?: StyleProp<ViewStyle>;
  isInvalid?: boolean;
  isShowError?: boolean;
  fieldStyles?: StyleProp<ViewStyle>;
}
export const RoundedInput = (props: RoundedInputProps) => {
  const {
    field,
    handleChange,
    extraStyles,
    isInvalid,
    isShowError = true,
    fieldStyles,
  } = props;
  return (
    <View style={[{ width: '100%', marginBottom: spacing.s }, fieldStyles]}>
      <TextInput
        style={[
          styles.input,
          isInvalid && { backgroundColor: colors.lightRed },
          extraStyles,
        ]}
        placeholderTextColor={colors.mediumGray}
        autoCapitalize="sentences"
        autoCorrect={false}
        onChange={(e) =>
          handleChange && handleChange(field, e.nativeEvent.text)
        }
        {...props}
      />
      <FieldError isShow={isInvalid && isShowError} />
    </View>
  );
};
RoundedInput.defaultProps = {
  handleChange: () => {},
  isInvalid: false,
  isShowError: true,
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.veryLightGray,
    width: '100%',
    padding: spacing.s,
    borderRadius: 15,
    height: 36,
  },
});
