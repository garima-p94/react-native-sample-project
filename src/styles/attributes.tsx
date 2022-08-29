import { Dimensions } from 'react-native';
import { ObjectType } from '@types';
import { isNotch } from '@utils';

// screen height & screen width
export const sh = Dimensions.get('window').height;
export const sw = Dimensions.get('window').width;
// width & height % calculator functions
export const wp = (num: number) => (sw * num) / 100;
export const hp = (num: number) => (sh * num) / 100;

export const headerHeight = isNotch ? hp(10.2) : hp(9);
export const footerFlex = 0.09;

export const bigSlop = { top: 10, bottom: 10, right: 10, left: 10 };
export const smallSlop = { top: 5, bottom: 5, right: 5, left: 5 };

// for margin or padding spaces
export const spacing: ObjectType = {
  xs: 5,
  s: 10,
  m: 15,
  l: 20,
  xl: 25,
  xxl: 30,
  xxxl: 40,
};
// for font sizes
export const fonts: ObjectType = {
  xs: 10,
  s: 12,
  m: 14,
  l: 16,
  l1: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
};

// for button sizes
export const buttons: ObjectType = {
  xs: wp(15),
  s: wp(20),
  m: wp(30),
  l: wp(40),
  xl: wp(65),
  xxl: wp(90),
};

export const colors = {
  black: '#000000',
  white: '#ffffff',
  // ------ ----- gray shades
  darkGray: '#464646',
  mediumGray: '#6f6a6a',
  lightGray: '#edeeee',
  veryLightGray: '#f3f3f3',
  boldGrey: '#8a8a8a',
  blueGray: '#7393B3',
  // ------ ----- specific app colors:
  appBlue: '#5091ed',
  bloctoBlue: '#0086C9',
  ethereumGray: '#708090',
  flowGreen: '#50C878',
  coinBase: '#1560BD', // '#005A92',

  red: '#FF0200',

  purple: '#9370DB',
  violet: '#8F00FF',
  lightRed: '#fdefef', // for input field errors
};

/* const colors = {
  // white
  white: '#ffffff',
  whiteDark: '#F8F8F7',
  // orange
  red: '#FF0200',
  // blue
  stripBlue: '#5091ed',
  // gray
  // 5091ed, 5190ED
  expertBlue: '#5091ed',
  purple: '#9370DB',
  greyText: '#BFB9B9',
  lightGray: '#d3d3d3',
  medGray: '#6f6a6a',
  textGray: '#5B5A5A',
  darkGray: '#464646',
  veryLightGray: '#F3F3F3',
  cancelGrey: '#AEAEAE',
  borderHeader: '#EEEDED',
  searchBox: '#f3f3f3',
  emptyImgGrey: '#edeeee',
  greyStars: '#bababa',
  greyContent: '#8a8a8a', // light but bold grey, used in explore app headings
  footerGrey: '#9e9e9e',
  black: 'black',
  whiteSmoke: '#EEEEEE',
  errorLightRed: '#fdefef',

  grayButton: '#c4c2c2',
  // App colors:

  inputLightGrey: '#F5F5F5',

  background: '#1F0808',
  clear: 'rgba(0,0,0,0)',
  facebook: '#3b5998',
  transparent: 'rgba(0,0,0,0)',
  silver: '#F7F7F7',
  steel: '#CCCCCC',
  error: 'rgba(200, 0, 0, 0.8)',
  ricePaper: 'rgba(255,255,255, 0.75)',
  frost: '#D8D8D8',
  cloud: 'rgba(200,200,200, 0.35)',
  windowTint: 'rgba(0, 0, 0, 0.4)',
  panther: '#161616',
  charcoal: '#595959',
  coal: '#2d2d2d',
  bloodOrange: '#fb5f26',
  snow: 'white',

  ember: 'rgba(164, 0, 48, 0.5)',
  fire: '#e73536',
  drawer: 'rgba(30, 30, 29, 0.95)',
  eggplant: '#251a34',
  border: '#483F53',
  banner: '#5F3E63',
  text: '#E0D7E5',
  twitter: '#55acee',
  loginBlue: '#0691ce',
  loginGreen: '#4cd964',
  txtgrey: '#8e9396',
  whites: '#E8E8E8',
  // greys: '#cccccc',
  darktext: '#6f6f6f',
  shadows: '#b7b7b7',
  lighttxt: '#929597',
  hintblue: '#c9b0c1',
  // blightgrey: '#e2e2e2',
  backgrey: '#e6e6e6',
  blacktxt: '#363636',
  skyblue: '#71d4ff',
  txtsky: '#83c8e7',

  // WooCommerce Color
  red: 'red',
  // white: 'white',
  yellow: '#ffc700',
  lightBlack: '#111111',
  gray: '#d8d8d8',
  darkGreyBtn: '#5B5353',
};

export default colors;
 */
