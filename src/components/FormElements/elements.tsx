import React from 'react';
import { View, Switch, StyleSheet, Pressable } from 'react-native';
import { globalStyles, colors, spacing } from '@styles';
import { CheckCircle, CustomText } from '@components';
import { CustomStyles } from '@types';
import { Line } from '../UIComponents';
import { errorMessages } from '@constants';
import { isExist } from '@helpers';

interface ToggleProps extends CustomStyles {
  heading: string;
  isEnabled?: boolean;
  onChange?: () => void;
  isDisabled?: boolean;
  textSize?: string;
}
export const Toggle = ({
  heading,
  isEnabled,
  onChange,
  extraStyles,
  isDisabled,
  textSize,
}: ToggleProps) => (
  <View style={[styles.toggleView, extraStyles]}>
    <CustomText
      isHeading
      text={heading}
      size={textSize}
      extraStyles={{ width: '80%' }}
    />
    <Switch
      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
      value={isEnabled}
      ios_backgroundColor={colors.lightGray}
      onChange={() => onChange && onChange()}
      trackColor={{ true: colors.red, false: colors.lightGray }}
      disabled={isDisabled}
    />
  </View>
);
Toggle.defaultProps = {
  isEnabled: false,
  onChange: () => {},
  isDisabled: false,
  textSize: 'l',
};

interface RadioProps extends CustomStyles {
  isSelected: boolean;
  activeColor?: string;
  inActiveColor?: string;
  label?: string;
  onChange: () => void;
  isDisabled?: boolean;
}
export const RadioButton = ({
  isSelected,
  activeColor,
  inActiveColor,
  label,
  onChange,
  extraStyles,
  isDisabled,
}: RadioProps) => (
  <Pressable
    style={[styles.radioButton, extraStyles]}
    onPress={() => onChange()}
    disabled={isDisabled}>
    {isExist(label) && (
      <CustomText
        isHeading
        text={label ? label : ''}
        size="m"
        extraStyles={{ paddingRight: spacing.m }}
      />
    )}

    <View style={[styles.radio, isSelected && { borderColor: activeColor }]}>
      {isSelected && (
        <CheckCircle
          color={isSelected ? activeColor : inActiveColor}
          onPress={() => onChange()}
          disabled={isDisabled}
        />
      )}
    </View>
  </Pressable>
);
RadioButton.defaultProps = {
  isSelected: false,
  activeColor: colors.red,
  inActiveColor: colors.white,
  label: '',
  onChange: () => {},
  isDisabled: false,
};

/*
 * FormField wrapper
 * wraps form elements with label & description
 * optional - accompanied by line separator
 */

interface FormFieldProps extends CustomStyles {
  label: string;
  description?: string;
  isSeparator?: boolean;
  children: JSX.Element | JSX.Element[];
}
export const FormField = (props: FormFieldProps) => {
  const { label, description, isSeparator, style, children } = props;

  return (
    <View style={[styles.fieldWrapper, style]}>
      <CustomText text={label} isHeading={true} size="l" />
      <CustomText text={description} extraStyles={{ marginTop: spacing.xs }} />
      {children}
      {isSeparator && <Line extraStyles={{ marginTop: spacing.s }} />}
    </View>
  );
};

interface FieldError {
  isShow?: boolean;
  error?: string;
}
export const FieldError = ({ isShow, error }: FieldError) =>
  isShow ? (
    <CustomText
      text={error}
      extraStyles={{ color: colors.red, height: spacing.l, top: 5 }}
    />
  ) : (
    <View style={{ height: spacing.l }} />
  );
FieldError.defaultProps = {
  error: errorMessages.fieldError,
};

const styles = StyleSheet.create({
  toggleView: {
    ...globalStyles.rowSpacing,
    width: '100%',
  },
  radioButton: {
    ...globalStyles.rowSpacing,
    flex: 0,
    width: '100%',
  },
  radio: {
    width: 23,
    aspectRatio: 1,
    borderRadius: 180,
    borderWidth: 0.5,
    borderColor: colors.mediumGray,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  fieldWrapper: {
    marginTop: spacing.m,
    paddingHorizontal: spacing.m,
    width: '100%',
  },
});
