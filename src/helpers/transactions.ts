import moment from 'moment';
import {
  ifExist,
  isObject,
  toDollars,
  toSentenceCase,
  isExist,
  isBoolean,
  dateFormat,
} from './basic';
import { isMembership, isSubscription } from '@services';
import { ObjectType } from '@types';
import { getCustomerInfo, isRallyUser } from './user';
import { toFloatType, toCoinFormat, toCurrencyFormat } from '@helpers';

export const getOrderFilteredData = (options: ObjectType = {}) => {
  const { order, tokenId } = options;
  if (isObject(order)) {
    const obj = {
      ...order,
      detailsJson: {},
      // cryptoInfo: {},
      detailsHeading: 'Payment Details',
      totalOrderAmount: toDollars(order.order_amount),
      orderType:
        ifExist(order.parent_category_display) ||
        toSentenceCase(order.type) ||
        '',
      orderDate: isExist(order.order_date)
        ? moment(order.order_date).format('MMM Do, hh:mm A')
        : '',
      totalFees: '$0.00',
    };

    // is subscription or memberhsip
    obj.isMembership =
      isBoolean(order.is_subscription) &&
      isMembership(order.parent_category_id);
    obj.isSubscription =
      isBoolean(order.is_subscription) &&
      isSubscription(order.parent_category_id);
    obj.isTypeSubsciption = obj.isMembership || obj.isSubscription;

    // customer information
    obj.custData = !isRallyUser(order) ? getCustomerInfo(order) : {};
    obj.isCustomer = isObject(obj.custData) && obj.custData.isCustomer;

    const paymentMethod = isExist(obj.currency_type)
      ? obj.currency_type.toLowerCase()
      : '';
    if (paymentMethod === 'usd') {
      const processFee = toFloatType(order.processing_fee);
      const campaignFee = toFloatType(order.transfer_fee);
      const fee = toFloatType(order.fee);
      const allFees = `${processFee + campaignFee + fee}`;
      obj.totalFees = toDollars(allFees);
    }

    // order json formatting
    const formatted = isExist(order.order_calculations_json)
      ? JSON.parse(order.order_calculations_json)
      : null;
    if (formatted) {
      const detailsJson: ObjectType = {
        startDate: dateFormat({
          d: formatted.subscription_date,
          f: 'MMM Do, YYYY',
        }),
        cancelledDate: dateFormat({
          d: formatted.subscription_canceled_at,
          f: 'MMM Do, YYYY',
        }),
        serviceText:
          ifExist(formatted.service_text) || isExist(formatted.service_type)
            ? `${formatted.service_type} Service`
            : 'Order Amount',
        discountText: ifExist(formatted.discount_text) || '',
        additionalText: ifExist(formatted.payment_started_date_text) || '',
      };
      if (obj.isTypeSubsciption) {
        const status = ifExist(order.subscription_status) || '';
        obj.detailsHeading = `${
          obj.isMembership ? 'Membership' : 'Subscription'
        } Details`;
        obj.isActiveSubscription = status === 'active';
        obj.isCancelledSubscription =
          (status === 'canceled' || status === 'cancelled') &&
          !isExist(formatted.subscription_canceled_at);
      }
      if (isExist(formatted.is_crypto_payment) || formatted.is_reward_payment) {
        // const prodsymbol = { symbol: ifExist(formatted.symbol) || '' };
        detailsJson.paid = `${toCoinFormat({
          value: formatted.pay_now_coins,
          symbol: formatted.symbol,
        })}`;
        detailsJson.nextAmount = `${toCoinFormat({
          value: formatted.upcoming_coins,
          symbol: formatted.symbol,
        })}`;
        detailsJson.serviceAmount = `${toCoinFormat({
          value: formatted.product_coins,
          symbol: formatted.symbol,
        })}`;
        detailsJson.discountAmount = `-${toCoinFormat({
          value: formatted.total_discount_coins,
          symbol: formatted.symbol,
        })}`;
      } else {
        detailsJson.paid = toCurrencyFormat(formatted.pay_now_amount);
        detailsJson.nextAmount = toCurrencyFormat(formatted.upcoming_amount);
        const serviceAmt =
          ifExist(formatted.product_amount) ||
          ifExist(formatted.upcoming_amount) ||
          '';
        detailsJson.serviceAmount = isExist(serviceAmt)
          ? toCurrencyFormat(serviceAmt)
          : '';
        detailsJson.discountAmount =
          isExist(formatted.total_discount) && formatted.total_discount > 0
            ? `-${toCurrencyFormat(formatted.total_discount)}`
            : '';
      }
      obj.detailsJson = {
        ...detailsJson,
        totalOrderAmount: ifExist(detailsJson.paid) || obj.totalOrderAmount,
      };
    }

    // check crypto information
    obj.isCrypto = isExist(obj.cr_token_id);
    if (obj.isCrypto) {
      const transaction = ifExist(order.transaction_type) || '';
      obj.isConvert =
        transaction === 'convert' &&
        order.parent_category_id === '16312' &&
        order.convert_type;
      obj.isCryptoPayment = paymentMethod === 'crypto';
      /* obj.cryptoInfo = {
        isConvert,
        isSend: transaction === 'send',
        isOnlyCryptoPay: transaction === 'send' || transaction === 'convert',
        isFrom: isConvert && order.convert_type === 'convert_from',
        primaryToken: {},
        secondaryToken: {},
      }; */
      const isFrom =
        obj.isConvert && isExist(tokenId) && tokenId === order.from_cr_token_id;
      // isConvert && order.convert_type === 'convert_from';
      const tokenSymbol = isFrom
        ? order.from_cr_token_symbol
        : order.cr_token_symbol;
      const primaryToken = {
        tokenId: isFrom ? order.from_cr_token_id : order.cr_token_id,
        tokenId: isFrom
          ? order.from_cr_token_id
          : order.cr_token_id,
        tokenName: isFrom ? order.from_cr_token_name : order.cr_token_name,
        tokenSymbol,
        tokens: isFrom ? order.from_no_of_coins : order.no_of_coins,
        symbol: { symbol: ifExist(tokenSymbol) || '' },
      };
      obj.primaryToken = {
        ...primaryToken,
        numberOfTokens: toCoinFormat({
          value: primaryToken.tokens,
          symbol: primaryToken.tokenSymbol,
        }),
      };
      if (obj.isConvert) {
        const secondarySymbol = isFrom
          ? order.cr_token_symbol
          : order.from_cr_token_symbol;
        const secondaryToken = {
          label: isFrom ? 'Converted To' : 'Converted From',
          tokenId: isFrom ? order.cr_token_id : order.from_cr_token_id,
          tokenId: isFrom
            ? order.cr_token_id
            : order.from_cr_token_id,
          tokenName: isFrom ? order.cr_token_name : order.from_cr_token_name,
          tokenSymbol: secondarySymbol,
          tokens: isFrom ? order.no_of_coins : order.from_no_of_coins,
          symbol: { symbol: ifExist(secondarySymbol) || '' },
          // numberOfTokens: isFrom ? order.no_of_coins : order.from_no_of_coins,
        };
        obj.secondaryToken = {
          ...secondaryToken,
          numberOfTokens: toCoinFormat({
            value: secondaryToken.tokens,
            symbol: secondaryToken.tokenSymbol,
          }),
        };
      }
    }
    return obj;
  }
  return order;
};
