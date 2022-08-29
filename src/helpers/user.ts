import { isObject, isExist } from '@helpers';
import { ListItemProps, ObjectType } from '@types';

export const getAddressFormat = ({ item }: ListItemProps) => {
  if (isObject(item)) {
    const { address, address2, city, country, zip_code, state_province } = item;
    let AddressText = '';
    isExist(address) && (AddressText = AddressText.concat(address));
    isExist(address2) && (AddressText = AddressText.concat(` ${address2}`));
    isExist(city) && (AddressText = AddressText.concat(` ${city}`));
    isExist(zip_code) && (AddressText = AddressText.concat(`, ${zip_code}`));
    isExist(state_province) &&
      (AddressText = AddressText.concat(`, ${state_province}`));
    isExist(country) && (AddressText = AddressText.concat(` ${country}`));
    return AddressText;
  }
  return '';
};

export const getCustomerInfo = (obj: ObjectType) => {
  const customer: ObjectType = {};
  if (isObject(obj)) {
    const isSend =
      isExist(obj.transaction_type) &&
      obj.transaction_type === 'send' &&
      isExist(obj.from_customer_id);
    customer.customer_id = isSend ? obj.from_customer_id : obj.customer_id;
    const name = isSend ? obj.from_uname : obj.uname || obj.customer;
    customer.name = name;
    customer.uname = name;
    customer.user_id = isSend ? obj.from_user_id : obj.user_id;
    customer.user_image_url_large = isSend
      ? obj.from_user_image_url_large
      : obj.user_image_url_large;
    customer.user_image_url_medium = isSend
      ? obj.from_user_image_url_medium
      : obj.user_image_url_medium;
    customer.user_image_url_small = isSend
      ? obj.from_user_image_url_small
      : obj.user_image_url_small;

    customer.isCustomer = isExist(customer.customer_id);
  }
  return customer;
};

export const isRallyUser = (user: ObjectType) => {
  let isRally = false;
  if (isObject(user)) {
    if (
      (isExist(user.customer_id) && user.customer_id === '2066') ||
      (isExist(user.cust_id) &&
        user.cust_id === '80gvavl4ytprpwr')
    ) {
      isRally = true;
    } else if (isExist(user.user_id) && user.user_id === '6054151') {
      isRally = true;
    }
  }
  return isRally;
};
