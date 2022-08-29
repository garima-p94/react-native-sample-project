import md5 from 'md5';
import { getUserId } from './user';
import { apiRequest } from './request';
import { isExist, ifExist, isApiSuccess } from '@helpers';
import { apiEndPoints } from '@constants';
import { showMessage } from '@components';

export const getOtp = async ({
  gtype,
  userId,
}: {
  gtype: string;
  userId?: string;
}) => {
  if (isExist(gtype)) {
    const res = await apiRequest({
      endPoint: apiEndPoints.otpAuth,
      body: {
        ptype: 'generate',
        user_id: ifExist(userId) || getUserId(),
        gtype: ifExist(gtype) || 'phone',
      },
    });
    const isSent = isApiSuccess(res);
    showMessage({
      message: res.message,
      type: isSent ? 'success' : 'danger',
    });
    return isSent;
  }
};

export const verifyOtp = async ({
  gtype,
  code,
  userId,
}: {
  gtype: string;
  code: string | number;
  userId?: string;
}) => {
  if (isExist(gtype) && isExist(code)) {
    const body = {
      ptype: 'verify',
      user_id: ifExist(userId) || getUserId(),
    };
    if (gtype === 'phone') {
      body.sms_otp = md5(code);
    }
    if (gtype === 'email') {
      body.email_otp = md5(code);
    }
    const res = await apiRequest({
      endPoint: apiEndPoints.otpAuth,
      body,
    });
    const isVerified = isApiSuccess(res);
    showMessage({
      message: res.message,
      type: isVerified ? 'success' : 'danger',
    });
    return isVerified;
  }
  return null;
};
