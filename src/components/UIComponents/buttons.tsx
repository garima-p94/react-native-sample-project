import React, { useMemo } from 'react';
import {
  StyleSheet,
  Pressable,
  Text,
  PressableProps,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PlusIcon, AngleLeft } from './icons';
import { spacing, buttons, colors, fonts, smallSlop } from '@styles';

export interface ButtonProps extends PressableProps {
  text: string;
  size: string;
  isInactive?: boolean;
  extraStyles?: StyleProp<ViewStyle>;
}

export const ButtonText = (props: ButtonProps) => {
  const { text, size, isInactive, extraStyles, onPress, disabled } = props;

  const { buttonStyles, textStyles } = useMemo(() => {
    const width = buttons[size];
    return {
      buttonStyles: {
        width,
        padding: width > buttons.m ? spacing.s : spacing.xs,
      },
      textStyles: {
        fontSize: width > buttons.m ? fonts.l : fonts.m,
      },
    };
  }, [size]);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyles,
        isInactive && { backgroundColor: colors.lightGray },
        extraStyles && extraStyles,
      ]}
      disabled={disabled}
      onPress={() => onPress && onPress()}>
      <Text
        style={[
          styles.buttonText,
          textStyles,
          isInactive && { color: colors.darkGray },
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};
ButtonText.defaultProps = {
  isInactive: false,
  disabled: false,
};

export const PlusButton = ({ buttonStyles, onPress, isDisabled }: any) => (
  <Pressable
    disabled={isDisabled}
    style={[styles.roundPlusButton, buttonStyles]}
    onPress={() => onPress()}>
    <PlusIcon color={colors.appBlue} onPress={() => onPress()} />
  </Pressable>
);

export const BackButton = ({ iconColor }: { iconColor?: string }) => {
  const { goBack } = useNavigation();
  return (
    <Pressable onPress={() => goBack()} hitSlop={smallSlop}>
      <AngleLeft
        disabled
        style={{ color: iconColor }}
        onPress={() => goBack()}
      />
    </Pressable>
  );
};
BackButton.defaultProps = {
  iconColor: colors.darkGray,
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.appBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '800',
  },
  roundPlusButton: {
    borderRadius: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
