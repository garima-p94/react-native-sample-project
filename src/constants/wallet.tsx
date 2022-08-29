import * as Images from '@assets';
import { ObjectType } from '@types';
import { colors } from '@styles';

const { white, red, bloctoBlue, coinBase, mediumGray, purple, appBlue } =
  colors;

export const walletProvidersCatIds = {
  app: '24708',
  walletConnect: '24724',
};

export const walletProviderColors: ObjectType = {
  '24708': { backgroundColor: '#000000', color: appBlue }, //
  '24709': { backgroundColor: red, color: white }, // rally
  '24710': { backgroundColor: bloctoBlue, color: white }, // blocto
  '24715': { backgroundColor: mediumGray, color: white }, // Metamask
  '24716': { backgroundColor: coinBase, color: white }, // Coinbase
  '24717': { backgroundColor: purple, color: white }, // Dapper
};

// not used anywhere - check & remove it (keep colors)
export const walletAddrTypesColor = [
  '#ff9f00', // orange
  '#50c878', // green
  '#777696', // gray
  '#e4d00a', // yellow
  '#F19CBB', // pink
  '#66424d', // red
  '#40e0d0', // blue
  '#6488ea', // blue gray
];
// temporary - remove it
export const walletAddressInfo: ObjectType = {
  Bitcoin: {
    backgroundColor: '#ff9f00',
  },
  Ethereum: {
    backgroundColor: '#50c878',
  },
  Flow: {
    backgroundColor: '#777696',
  },
  Polygon: {
    backgroundColor: '#e4d00a',
  },
  Cardano: {
    backgroundColor: '#F19CBB',
  },
  Celo: {
    backgroundColor: '#ff9f00',
  },
  Dogecoin: {
    backgroundColor: '#50c878',
  },
  Solana: {
    backgroundColor: '#777696',
  },
  default: {
    backgroundColor: '#7FFFD4',
  },
};

export const paymentCardImages: ObjectType = {
  'American Express': Images.amx,
  'Diners Club': Images.dinnerClub,
  JCB: Images.jcb,
  Discover: Images.discover,
  MasterCard: Images.master,
  Visa: Images.visa,
  UnionPay: Images.unionPay,
};
