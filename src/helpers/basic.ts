import _ from 'lodash';
import moment from 'moment';
import * as Sentry from '@sentry/react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { BigNumber } from 'bignumber.js';
import { isWideUiPosts, PostTypes } from '@constants';
import { ObjectType } from '@types';
import { showMessage } from '@components';

/*
 *
 * check existance of values
 *
 */
export const isExist = (e: any) => e !== undefined && e !== null && e !== '';
export const ifExist = (e: any) => (isExist(e) ? e : null); // if exists then return value
export const isObject = (e: {}) =>
  isExist(e) && typeof e === 'object' && !_.isEmpty(e);
export const isArray = (e: []) => Array.isArray(e) && e.length >= 1;
export const isBoolean = (e: string | number) =>
  isExist(e) && (e === 1 || e === '1');

/*
 *
 * success response of APIs
 *
 */
export const isApiSuccess = (res: { status: string }) =>
  isExist(res) && isExist(res.status) && res.status === 'success';

/*
 *
 * date functions
 *
 */
// 'MMM Do, YYYY',
export const dateFormat = ({ d, f }: { d: string; f?: string }) => {
  if (isExist(d)) {
    const format = ifExist(f) || 'MMM Do, hh:mm A';
    return moment(d).format(format);
  }
  return '';
};

/*
 *
 * object type conversion
 *
 */
export const toIntType = (e: string) => (isExist(e) ? parseInt(e, 0) : 0);
// from string to floating type
export const toFloatType = (e: string) => (isExist(e) ? parseFloat(e) : 0);
// from other types to string
export const toStringType = (e: number) => (isExist(e) ? e.toString() : '');
// string in sentence case
export const toSentenceCase = (e: string) =>
  isExist(e) ? `${e.charAt(0).toUpperCase()}${e.slice(1).toLowerCase()}` : '';

/*
 *
 * format coversion
 *
 */

/* format numbers into units format */
export const numberFormatting = (value: string | number) =>
  Math.abs(Number(value)) >= 1.0e9
    ? `${(Math.abs(Number(value)) / 1.0e9).toFixed(1)}B`
    : Math.abs(Number(value)) >= 1.0e6
    ? `${(Math.abs(Number(value)) / 1.0e6).toFixed(1)}M`
    : Math.abs(Number(value)) >= 1.0e3
    ? `${(Math.abs(Number(value)) / 1.0e3).toFixed(1)}K`
    : typeof value === 'number' && !Number.isInteger(value)
    ? value.toFixed(2)
    : value;

/* format string or number to currency value with 2 decimal points */
// if value ia a big number (6-7 digits or more) & formatting is allowed then will do unit conversion
// current fixed to $, can be changed later
export const toCurrencyFormat = ({
  value,
  isFormatted = true,
  limit = 5,
}: {
  value: string | number;
  isFormatted?: boolean;
  limit?: number;
}) => {
  if (isExist(value)) {
    const newAmount = typeof value === 'string' ? toFloatType(value) : value;
    const result =
      isFormatted && toStringType(newAmount).length > limit
        ? numberFormatting(newAmount)
        : newAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `$${result}`;
  }
  return '$0.00';
};

export const toDollars = (amount: string) => {
  if (isExist(amount)) {
    const number = toFloatType(amount);
    if (isExist(number)) {
      const value: number = number / 100;
      if (value) {
        const val = toCurrencyFormat({ value });
        return val.toString();
      }
    }
  }
  return toCurrencyFormat({ value: '0.00' });
};

/* format value to crypto coin display format */
export const toCoinFormat = ({
  value,
  symbol,
  coinObj = {},
}: {
  value: string | number;
  symbol?: string;
  coinObj?: ObjectType;
}) => {
  let returnVal = '';
  const symbolTxt =
    ifExist(symbol) || coinObj.symbol || coinObj.cr_token_symbol || '';
  const number = new BigNumber(value).toFixed();
  if (Math.abs(Number(number)) >= 1.0e9) {
    returnVal = `${(Math.abs(Number(number)) / 1.0e9).toFixed(2)}B`;
  } else if (Math.abs(Number(number)) >= 1.0e6) {
    returnVal = `${(Math.abs(Number(number)) / 1.0e6).toFixed(2)}M`;
  } else if (Math.abs(Number(number)) >= 1.0e3) {
    returnVal = `${(Math.abs(Number(number)) / 1.0e3).toFixed(2)}K`;
  } else if (!Number.isInteger(number) && !isNaN(number)) {
    const minDecimal = 3;
    const decimalArr = Array.from(
      String(number.toString().split('.')[1]),
      Number,
    );
    let finalDecimal = [];
    decimalArr.some((d, index) => {
      finalDecimal.push(d);
      if (d > 0) {
        if (finalDecimal.length < minDecimal) {
          const newArr = [...decimalArr].slice(finalDecimal.length, minDecimal);
          finalDecimal = [...finalDecimal, ...newArr];
        }
        returnVal = `${parseInt(number, 0)}.${finalDecimal.join('')}`;
        return true;
      }
      if (finalDecimal.length - 1 === index) {
        returnVal = parseInt(number, 0);
      }
    });
  } else {
    returnVal = !isNaN(number) ? number : '';
  }
  return isExist(symbolTxt) ? `${returnVal} ${symbolTxt}` : returnVal;
};

/*
 *
 * array/object manipulation
 *
 */
export const sortArrayByKey = ({ array, key }: { array: []; key: string }) => {
  return isArray(array) ? _.sortBy(array, key) : [];
};

/*
 *
 * images
 *
 */

// type = listcard, card, large, mobilelarge, medium, featured, small, icon, external
// size = horizontal, vertical
export const isHorizontalImgKey = [
  'medium',
  'small',
  'large',
  'external',
  'icon',
];
export const isVerticalImgKey = [
  'card',
  'listcard',
  'mobilelarge',
  'large',
  'banner',
];
const imageKeys: ObjectType = {
  horizontal: [...isHorizontalImgKey, ...isVerticalImgKey],
  vertical: [...isVerticalImgKey, ...isHorizontalImgKey],
};

export const getAspectRatio = ({
  iw,
  ih,
  lw,
}: {
  iw: number;
  ih: number;
  lw: number;
}) => {
  return (ih / iw) * lw;
};

export const getImages = ({
  item = null,
  fullKey, // full image key name
  type, // specific type (refer arrays above)
  size = 'horizontal', // horizontal or vertical
  isUri, // needed with uri or without
}: ObjectType) => {
  let image = '';
  if (isExist(item)) {
    // check for full image key first
    image = isExist(fullKey) ? ifExist(item[fullKey]) || '' : '';
    // if no fullKey or image fullKey doesn't exist, check for type then
    if (!isExist(image) && isExist(type)) {
      image = ifExist(item[`image_url_${type}`]) || '';
    }
    // specific type image doesnt exist, then check for size
    const check =
      !isExist(image) &&
      isExist(size) &&
      (size === 'vertical' || size === 'horizontal');
    check &&
      imageKeys[size].some((e) => {
        // if still empty, check which exists
        if (!isExist(image) && isExist(item[`image_url_${e}`])) {
          image = item[`image_url_${e}`];
          return true;
        }
        return false;
      });
    image = ifExist(image) || ifExist(item.asset_file) || '';
  }
  return isUri ? { uri: image } : image;
};

export const getObjectImage = ({ isUri = true, obj }: ObjectType) => {
  let image = '';
  const props: ObjectType = {};
  if (isObject(obj)) {
    const { layoutType, objectType } = obj;
    const displayType = ifExist(layoutType) || '';
    if (isExist(objectType)) {
      if (objectType === 'Product') {
        const key = objectType.toLowerCase();
        if (isExist(displayType) && isVerticalImgKey.includes(displayType)) {
          image =
            obj[`${key}_image_url_mobilelarge`] ||
            obj[`${key}_image_url_large`];
        } else if (!isExist(image)) {
          image =
            obj[`${key}_image_url_medium`] || obj[`${key}_image_url_small`];
        }
      } else if (PostTypes.includes(objectType)) {
        // if POST
        if (!isWideUiPosts.includes(objectType)) {
          image =
            obj.post_large_image ||
            obj.post_image_url_large ||
            obj.image_url_large ||
            obj.post_image_url;
        } else {
          image =
            obj.post_medium_image ||
            obj.image_url_medium ||
            obj.post_small_image ||
            obj.image_url_small ||
            obj.post_image_url ||
            obj.asset_file;
        }
      }
      if (!isExist(image)) {
        // if no image at all, use external
        image = obj.post_ext_image || obj.image_url_external || '';
      }
      return isUri ? { uri: image } : image;
    }
    if (isVerticalImgKey.includes(displayType)) {
      // VERTICAL IMAGES
      props.size = 'vertical';
      if (displayType === 'minicard') {
        props.fullKey = 'image_url_listcard';
      } else if (displayType === 'large') {
        props.fullKey = 'image_url_mobilelarge';
      } else if (displayType === 'banner') {
        props.fullKey = 'image_url_mobilebanner';
      }
    } else if (isHorizontalImgKey.includes(displayType)) {
      // HORIZONTAL IMAGES
      props.size = 'horizontal';
      if (displayType === 'medium') {
        props.type = 'medium';
      } else if (displayType === 'small') {
        props.type = 'small';
      } else if (displayType === 'icon') {
        props.type = 'icon';
      }
    } else if (displayType === 'splash') {
      // SPLASH
      props.size = 'vertical';
      props.fullKey = 'image_url_splash';
    } else if (displayType === 'logo') {
      // LOGO
      props.size = 'horizontal';
      props.fullKey = 'image_url_logo';
    }
    image = getImages({ item: obj, ...props });
    if (!isExist(image)) {
      // if no image at all, use external
      image =
        obj.image_url_collection ||
        obj.asset_file ||
        obj.post_ext_image ||
        obj.image_url_external ||
        '';
    }
  }
  return isUri ? { uri: image } : image;
};

/* check shade of color - if dark or light */
export const isDarkShade = (shade: string) => {
  let color = ifExist(shade) || '';
  let r;
  let g;
  let b;
  if (color.match(/^rgb/)) {
    // If HEX --> store the red, green, blue values in separate variables
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/,
    );
    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    // If RGB --> Convert it to HEX: http://gist.github.com/983661
    color = +`0x${color.slice(1).replace(color.length < 5 && /./g, '$&$&')}`;
    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }
  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  // Using the HSP value, determine whether the color is light or dark
  return hsp > 127.5 ? false : true;
};

/* checking if list end is near */
export const momentScrollDetect = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: ObjectType) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const censorWord = (str: string) =>
  str[0] + '*'.repeat(str.length - 2) + str.slice(-1);
export const toMaskedEmail = (email: string) => {
  if (isExist(email)) {
    const arr = email.split('@');
    return `${censorWord(arr[0])}@${censorWord(arr[1])}`;
  }
  return '';
};

export const onCopyText = (str: string) => {
  if (isExist(str)) {
    Clipboard.setString(str);
    showMessage({ type: 'success', message: 'Text Copied' });
  }
  return null;
};

export const textSearch = ({
  list,
  key,
  search,
}: {
  list: Array<object>;
  key: string;
  search: string;
}) => {
  if (isArray(list)) {
    const arr = list.filter((item: ObjectType) => {
      const itemData = isExist(item[key]) ? `${item[key].toUpperCase()}` : '';
      const textData = search.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    return arr || [];
  }
  return [];
};

export const getInitials = ({
  str,
  length = 2,
}: {
  str: string;
  length?: number;
}) => {
  if (isExist(str)) {
    const arr = str.split(' ');
    const letter1 = isExist(arr[0]) ? arr[0].substring(0, 1).toUpperCase() : '';
    const letter2 =
      length === 2 && isExist(arr[1])
        ? arr[1].substring(0, 1).toUpperCase()
        : '';
    return `${letter1}${letter2}`;
  }
};

export const sentryMessage = (message: string) => {
  if (isExist(message)) {
    !__DEV__ && Sentry.captureMessage(message);
  }
  return null;
};
