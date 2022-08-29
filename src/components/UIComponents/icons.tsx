import React from 'react';
import { Animated } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CustomStyles } from '@types';
import { colors } from '@styles';

const AnimatedFontAwesome = Animated.createAnimatedComponent(FontAwesome);
const AnimatedMaterialIcons = Animated.createAnimatedComponent(MaterialIcons);
const AnimatedMaterialCommunityIcons = Animated.createAnimatedComponent(
  MaterialCommunityIcons,
);
const AnimatedAntDesign = Animated.createAnimatedComponent(AntDesign);
const AnimatedEntypo = Animated.createAnimatedComponent(Entypo);
const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

const { red, appBlue, darkGray, lightGray, white } = colors;

const defProps = {
  size: 25,
  color: darkGray,
  style: {},
  onPress: () => {},
};

interface IconProps extends CustomStyles {
  size?: number;
  color?: string;
  disabled?: boolean;
  onPress?: () => void;
}

// Copy Icon
export const CopyIcon = (props: IconProps) => (
  <AnimatedMaterialCommunityIcons name="content-copy" {...props} />
);
CopyIcon.defaultProps = {
  ...defProps,
};

// Search Icon
export const SearchIcon = (props: IconProps) => (
  <AnimatedFontAwesome name="search" {...props} />
);
SearchIcon.defaultProps = {
  ...defProps,
  size: 22,
  color: lightGray,
};

// Angle Left or Right Icon
export const AngleRight = (props: IconProps) => (
  <AnimatedFontAwesome name="angle-right" {...props} />
);
AngleRight.defaultProps = { ...defProps, size: 32 };

export const AngleLeft = (props: IconProps) => (
  <AnimatedFontAwesome name="angle-left" {...props} />
);
AngleLeft.defaultProps = { ...defProps, size: 32 };
// angle-down
export const AngleDown = (props: IconProps) => (
  <AnimatedFontAwesome name="angle-down" {...props} />
);
AngleDown.defaultProps = { ...defProps, size: 28 };

// three vertical dots
export const VerticalDots = (props: IconProps) => (
  <AnimatedMaterialCommunityIcons name="dots-vertical" {...props} />
);
VerticalDots.defaultProps = { ...defProps, size: 32 };

// plus icon
export const PlusIcon = (props: IconProps) => (
  <AnimatedAntDesign name="pluscircle" {...props} />
);
PlusIcon.defaultProps = { ...defProps, size: 30 };

// check mark
export const CheckCircle = (props: IconProps) => (
  <AnimatedAntDesign name="checkcircle" {...props} />
);
CheckCircle.defaultProps = { ...defProps, size: 22 };

export const BarIcon = (props: IconProps) => (
  <AnimatedFontAwesome name="bars" {...props} />
);
BarIcon.defaultProps = { ...defProps, size: 22 };

export const ArrowSwap = (props: IconProps) => (
  <AnimatedIonicons name="swap-horizontal" {...props} />
);
ArrowSwap.defaultProps = { ...defProps, size: 22 };
/* swap-horizontal
 */

export const CrossIcon = (props: any) => (
  <AnimatedEntypo name="cross" {...props} />
);
CrossIcon.defaultProps = { ...defProps, size: 25 };

export const CheckIcon = (props: any) => (
  <AnimatedAntDesign name="check" {...props} />
);
CheckIcon.defaultProps = { ...defProps, size: 14, color: appBlue };

export const BlockIcon = (props: any) => (
  <AnimatedEntypo name="block" {...props} />
);
BlockIcon.defaultProps = { ...defProps, size: 11, color: red };

export const CheckBoxIcon = (props: any) => {
  const { isChecked } = props;
  return (
    <AnimatedMaterialIcons
      name={isChecked ? 'check-box' : 'check-box-outline-blank'}
      color={isChecked ? red : colors.mediumGray}
      {...props}
    />
  );
};
CheckBoxIcon.defaultProps = {
  style: {},
  onPress: () => {},
  isChecked: false,
  size: 20,
};
