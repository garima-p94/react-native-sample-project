import { apiRequest, getUserId } from '@services';
import { isApiSuccess, isObject, isExist } from '@helpers';
import { ObjectType } from '@types';

/* general function for object api */
export const getObjectData = async (params: ObjectType) => {
  let body = { sourcetype: 'app' };
  if (isObject(params) && isExist(params.sourceid)) {
    body = { ...body, ...params };
    const res = await apiRequest({
      body: {
        type: 'sgObjDetails',
        user_id: getUserId(),
        ...body,
        retdata: true,
      },
    });
    if (isApiSuccess(res) && isObject(res.data)) {
      return res.data;
    }
    return null;
  }
};
