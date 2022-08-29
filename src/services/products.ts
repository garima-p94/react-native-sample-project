
import { getUserId, apiRequest } from '@services';
import { ifExist, isObject, isExist, isApiSuccess } from '@helpers';
import { apiEndPoints } from '@constants';

export const getProductDetails = async (options = {}) => {
  const { params } = options;
  if (isObject(params) && isExist(params.id)) {
    const body = {
      ptype: 'getproductservicedetails',
      product_id: params.id,
      user_id: ifExist(params.userId) || getUserId(),
      // include_offers: isOffers ? '1' : '0',
      // include_benefits: isBenefits ? '1' : '0',
    };
    try {
      const res = await apiRequest({
        endPoint: apiEndPoints.productServiceApi,
        body,
      });
      if (isApiSuccess(res) && isObject(res.product)) {
        return res.product;
      }
      return null;
    } catch (err) {
      console.log('product error ===>', err);
      return null;
    }
  }
};
