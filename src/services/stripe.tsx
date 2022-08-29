import Stripe from 'tipsi-stripe';
import { ObjectType } from '@types';
import { isTestMode } from './app';
import { stripeKeys, errorMessages } from '@constants';

export const getStripeCardToken = async ({
  card,
  type,
}: {
  card: ObjectType;
  type: string;
}) => {
  try {
    const keys = !isTestMode() ? stripeKeys.live : stripeKeys.test;
    const publishableKey = keys[type];
    Stripe.setOptions({ publishableKey });
    const token = await Stripe.createTokenWithCard(card);
    if (!token.error) {
      return { token: token.tokenId };
    }
    const error = token.error.message || errorMessages.paymentFailed;
    return { error };
  } catch (err) {
    const error = err.message || errorMessages.paymentFailed;
    return { error };
  }
};
