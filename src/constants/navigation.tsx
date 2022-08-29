import React from 'react';
import { TransitionPresets } from '@react-navigation/stack';
import {
  EmailLogin,
  AccountPortfolio,
  ShowAllAssets,
  ExploreCrypto,
  CryptoItems,
  UserPurchases,
  UserSection,
  ProductDetails,
  NFTDetailCard,
  PaymentCardsList,
  UserAddressesList,
  ManageAddress,
  ManagePaymentCards,
  OtpAuthentication,
  WalletTypeSelection,
  UserWallets,
  WalletInformation,
  ManageWalletAddresses,
  AddressDetails,
  AccountSelection,
  CryptoTokenDetails,
  PurchaseDetails,
} from '@screens';
import { TabHeader } from '@components';
import { AppNavigator } from '../navigation/appNavigator';
import * as Images from '@assets';
import { ObjectType } from '@types';

const config = {
  animation: 'easeInEaseOut',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

export const preLogInRoutes: Array<{
  key: string;
  name: string;
  component: React.ReactNode | React.Component;
  options?: {
    headerShown?: Boolean;
    title?: string;
    headerLeft?: React.ReactNode | React.Component;
  };
}> = [
  {
    key: 'emailLogin',
    name: 'EmailLogin',
    component: EmailLogin,
    options: { headerShown: false },
  },
  {
    key: 'otpAuthentication',
    name: 'OtpAuth',
    component: OtpAuthentication,
    options: { headerShown: false },
  },
];

export const footerRoutes: ObjectType = {
  AccountPortfolio: {
    key: 'portfolio',
    label: 'Account',
    activeImage: Images.redPortFolio,
    inactiveImage: Images.greyPortFolio,
    component: AccountPortfolio,
  },
  ExploreCrypto: {
    key: 'explore',
    label: 'Crypto',
    activeImage: Images.redExplore,
    inactiveImage: Images.greyExplore,
    component: ExploreCrypto,
  },
  UserPurchases: {
    key: 'purchases',
    label: 'My Bag',
    activeImage: Images.redPurchase,
    inactiveImage: Images.greyPurchase,
    component: UserPurchases,
  },
  CryptoItems: {
    key: 'cryptoItem',
    label: 'Items',
    activeImage: Images.redItems,
    inactiveImage: Images.greyItems,
    component: CryptoItems,
  },
  UserSection: {
    key: 'userSection',
    label: 'My Section',
    activeImage: Images.redUserSection,
    inactiveImage: Images.greyUserSection,
    component: UserSection,
  },
};

const overlayOptions = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
  headerShown: false,
};
export const overlayRoutes: Array<{
  key: string;
  name: string;
  component: React.ReactNode | React.Component;
  options?: {
    headerShown?: Boolean;
    title?: string;
    headerLeft?: React.ReactNode | React.Component;
    [key: string]: any;
  };
}> = [
  {
    key: 'ManageAddress',
    name: 'ManageAddress',
    component: ManageAddress,
    options: overlayOptions,
  },
  {
    key: 'ManagePaymentCards',
    name: 'ManagePaymentCards',
    component: ManagePaymentCards,
    options: overlayOptions,
  },
  {
    key: 'WalletTypeSelection',
    name: 'WalletTypeSelection',
    component: WalletTypeSelection,
    options: overlayOptions,
  },
  {
    key: 'ManageWalletAddresses',
    name: 'ManageWalletAddresses',
    component: ManageWalletAddresses,
    options: overlayOptions,
  },
  {
    key: 'AccountSelection',
    name: 'AccountSelection',
    component: AccountSelection,
    options: {
      ...overlayOptions,
      cardOverlayEnabled: true,
      cardStyle: { backgroundColor: 'rgba(0,0,0,0.8)' },
      presentation: 'transparentModal',
      // animationEnabled
      // transitionSpec: {
      //   open: config,
      //   close: config,
      // },
    },
  },
];

export const screenRoutes: Array<{
  key: string;
  name: string;
  component: React.ReactNode | React.Component;
  options?: {
    headerShown?: Boolean;
    title?: string;
    headerLeft?: React.ReactNode | React.Component;
  };
}> = [
  {
    key: 'AppNavigator',
    name: 'AppNavigator',
    component: AppNavigator,
    options: { headerShown: false },
  },
  {
    key: 'ProductDetails',
    name: 'ProductDetails',
    component: ProductDetails,
    options: { headerShown: false },
  },
  {
    key: 'NFTDetailCard',
    name: 'NFTDetailCard',
    component: NFTDetailCard,
    options: { headerShown: false },
  },
  {
    key: 'ShowAllAssets',
    name: 'ShowAllAssets',
    component: ShowAllAssets,
    options: {
      headerShown: true,
      header: () => <TabHeader isShowBack={true} />,
    },
  },
  {
    key: 'PaymentCardsList',
    name: 'PaymentCardsList',
    component: PaymentCardsList,
    options: { headerShown: false },
  },
  {
    key: 'UserAddressesList',
    name: 'UserAddressesList',
    component: UserAddressesList,
    options: { headerShown: false },
  },
  {
    key: 'UserWallets',
    name: 'UserWallets',
    component: UserWallets,
    options: { headerShown: false },
  },
  {
    key: 'WalletInformation',
    name: 'WalletInformation',
    component: WalletInformation,
    options: { headerShown: false },
  },
  {
    key: 'AddressDetails',
    name: 'AddressDetails',
    component: AddressDetails,
    options: { headerShown: false },
  },
  {
    key: 'CryptoTokenDetails',
    name: 'CryptoTokenDetails',
    component: CryptoTokenDetails,
    options: {
      headerShown: true,
      header: () => <TabHeader isShowBack={true} />,
    },
  },
  {
    key: 'PurchaseDetails',
    name: 'PurchaseDetails',
    component: PurchaseDetails,
    options: {
      headerShown: true,
      header: () => <TabHeader isShowBack={true} />,
    },
  },
  ...overlayRoutes,
];
