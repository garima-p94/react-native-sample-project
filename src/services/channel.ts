import { isApiSuccess, isObject, filterExploreLists } from '@helpers';
import { apiRequest, getUserId } from '@services';
import { store } from '@store/index';
import { storeAppCollections } from '@store/Explore';
import { ObjectType } from '@types';
import { getActiveAppState } from '@store/App';

export const getPageCollections = async ({ params, isRefresh }: ObjectType) => {
  let list: [] = [];
  const app = getActiveAppState(store.getState());
  if (isObject(app) && isObject(params)) {
    isRefresh && store.dispatch(storeAppCollections({ isRefresh }));
    const pageId =
      isObject(app.app_pages) && isObject(app.app_pages.home)
        ? app.app_pages.home.id
        : '';
    const res = await apiRequest({
      body: {
        type: 'appstosearch',
        user_id: getUserId(),
        page_title: 'Channel Store',
        expset: 1,
        app_id: 5130,
        cattype: 'app',
        page_id: pageId,
        channel_id: app.id,
        app_guideids: app.guideids,
        mode: 'display', // modify
        preview_data: true,
        ...params,
        // collection_id: '3392',
      },
    });
    if (isApiSuccess(res)) {
      list = await filterExploreLists({ allData: res.data });
    }
    store.dispatch(storeAppCollections({ list }));
  }
};
