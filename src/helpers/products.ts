import { store } from '@store/index';
import {
  isArray,
  isBoolean,
  isObject,
  toFloatType,
  isExist,
  toCoinFormat,
  ifExist,
} from './basic';
import { ObjectType } from '../types';
import { toCurrencyFormat } from '@helpers';
import { getCryptoAssetsState } from '@store/AccountPortfolio';

export const getProductPaymentDisplayText = ({
  price,
  product,
  totalGuest,
  isAmountApplicable = false,
}: ObjectType) => {
  let priceValTxt = '';
  let isShowCrypto = false;
  let coinSymbol = '';
  const list = getCryptoAssetsState(store.getState());
  let coinObj: ObjectType = {};
  const priceDisplay = price ? toCurrencyFormat(price) : '';
  if (isArray(list) && isBoolean(product.is_accepts_crypto_token)) {
    isShowCrypto = true;
    if (isObject(product) && product.cr_token_id) {
      coinObj = list.find((d) => d.token_id === product.cr_token_id) || {};
    } else {
      coinObj = Object.assign({}, list[0]);
    }
    if (isObject(coinObj)) {
      coinSymbol = coinObj.symbol;
      let coinVal: string | number = '';
      if (
        isBoolean(product.is_exchange_rate_applicable) ||
        isAmountApplicable
      ) {
        coinVal = toFloatType(price) / toFloatType(coinObj.exchange_rate) || '';
      } else if (isExist(totalGuest)) {
        coinVal =
          toFloatType(product.number_of_crypto_tokens) *
          parseInt(totalGuest, 0);
      } else {
        coinVal = toFloatType(product.number_of_crypto_tokens);
      }
      if (isBoolean(product.accept_crypto_coins_only) || !priceDisplay) {
        priceValTxt = toCoinFormat({ value: coinVal, coinObj });
      } else {
        priceValTxt = `${priceDisplay} or ${toCoinFormat({
          value: coinVal,
          coinObj,
        })}`;
      }
    } else {
      priceValTxt = priceDisplay;
    }
  } else {
    priceValTxt = priceDisplay;
  }
  return { priceValTxt, isShowCrypto, coinSymbol };
};

export const getNFTEditionNumber = ({ asset, isTotal = false }: ObjectType) => {
  if (isObject(asset)) {
    const num = ifExist(asset.edition_number) || null;
    const total = ifExist(asset.total_editions) || '';
    if (isTotal) {
      return `Total Editions: ${total}`;
    }
    return num ? `Edition: ${num}${`/${total}`}` : '';
  }
  return '';
};
