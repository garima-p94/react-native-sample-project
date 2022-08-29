// any var of typeOf === object
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
export interface ObjectType {
  [key: string | number]: any;
}

// for custom flatlists
export interface ListProps {
  list: Array<object>;
  isHorizontal?: boolean;
}

// for flatlist render items
export interface ListItemProps {
  item?: any;
  index?: number;
}

// style props
export interface CustomStyles {
  style?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
  extraStyles?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
  textStyles?: StyleProp<TextStyle>;
}

// for functions in services - api calls
export interface ApiCallProps extends ObjectType {
  isNoStore?: boolean;
  isRefresh?: boolean;
  userId?: string;
  params?: {
    userId?: string;
    pgnum?: string;
    customerId?: string;
    password?: string;
    email?: string;
  };
  isEdit?: boolean;
}
