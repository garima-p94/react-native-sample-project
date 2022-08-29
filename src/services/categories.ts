import { isExist, isApiSuccess, isArray, sortArrayByKey } from '@helpers';
import { apiRequest } from '@services';
import { store } from '@store/index';
import { storeCategories } from '@store/Categories';
import { ObjectType } from '@types';

const categoryTags: ObjectType = {
  walletProviders: { ctag: 'wallet providers', parent_id: '24707' },
  collections: { ctag: 'Explore Row Collection Types', parent_id: '16383' },
  walletAddrTypes: { ctag: 'Wallet Category', parent_id: '24687' },
};

// ['15485', '15644']; // membership or subscription
export const isMembership = (cat: string) => isExist(cat) && cat === '15485';
export const isSubscription = (cat: string) => isExist(cat) && cat === '15644';
export const isSubscribeType = (cat: string) =>
  isMembership(cat) || isSubscription(cat);

// category search
export const getCategories = async ({
  name,
  type,
}: {
  type: string;
  name?: string;
}) => {
  if (isExist(type)) {
    const res = await apiRequest({
      body: {
        type: 'catsearch',
        filter: 'all',
        ...categoryTags[type],
        cname: name || '',
      },
    });
    if (isApiSuccess(res) && isArray(res.data)) {
      const arr = res.data.map((item) => {
        item.id = item.id.toString();
        if (isArray(item.child_data)) {
          item.child_data.map((e) => {
            e.id = e.id.toString();
          });
        }
        return item;
      });
      const sorted = sortArrayByKey({ array: arr, key: 'sort' });
      store.dispatch(storeCategories({ [type]: sorted }));
      return sorted;
    }
  }
  return null;
  // if (res && isApiSuccess(res) && checkArrayExist(res.data)) {
  //   let arr = [...res.data];
  //   if (type === 'campaign') {
  //     arr = res.data.filter(
  //       (e) => e.id === 15459 || e.id === 15460 || e.id === 15461,
  //     );
  //   }
  // }
};
