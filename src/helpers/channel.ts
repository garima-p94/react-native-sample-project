import {
  isExist,
  isObject,
  isArray,
  ifExist,
  isDarkShade,
  toSentenceCase,
} from '@helpers';
import { ObjectCategories, objectKeys, appInfo } from '@constants';
import { ObjectType } from '@types';
import { colors } from '@styles';
import { sortArrayByKey } from './basic';

export const isNoCollectionHeading = [objectKeys.banner, objectKeys.about];

export const isBannerImage = (e: ObjectType) =>
  isObject(e) &&
  (isExist(e.image_url_mobilebanner) || isExist(e.image_url_banner));

export const isCarousalType = (type: string) =>
  isExist(type) && type.includes('carousal');
/*
 * data for pages collections in channel/app
 */
export const filterExploreLists = ({ allData }: ObjectType) => {
  let newArr: [] = [];
  if (isObject(allData)) {
    Object.keys(allData).map((key, index) => {
      const obj: ObjectType = {};
      const parent = isArray(allData[key]) ? allData[key][0] : {};
      if (isObject(parent)) {
        const collection = isObject(parent.sgcollection_data)
          ? { ...parent.sgcollection_data, batchNo: allData.batchNo || 1 }
          : {};
        obj.rowId = `${index}-${key}`;
        obj.displaySort = collection.display_sort;
        obj.layoutType =
          ifExist(collection.channel_list_ui_type) ||
          ifExist(parent.disp_list_style) ||
          ''; // banner, card etc
        obj.heading = parent.disp_list_name;
        obj.subHeading = parent.disp_list_text;
        obj.objList = [...allData[key]];
        // obj.pageId = allData.pageId || '';
        // obj.collectionId = collection.id || '';
        Object.keys(ObjectCategories).filter((e) => {
          if (ObjectCategories[e].collectionCatName === collection.tag_type) {
            obj.objectCategory = { key: e, ...ObjectCategories[e] };
          }
        });
        obj.collection = {
          ...collection,
          isCarousal: isCarousalType(obj.layoutType),
          category: obj.objectCategory,
          displayUI: isObject(obj.objectCategory.itemProperties)
            ? obj.objectCategory.itemProperties[obj.layoutType]
            : {},
        };
        newArr.push(obj);
      }
    });
  }
  if (isExist(newArr)) {
    newArr = sortArrayByKey({ array: newArr, key: 'displaySort' });
  }
  return newArr;
};

/* theme setup in channels/apps */
export const getTheme = (appTheme: ObjectType) => {
  if (isObject(appTheme)) {
    const colorCheck = (btnColor: string) => {
      if (
        isExist(btnColor) &&
        (btnColor === '#ffffff' || btnColor === '#fefdff')
      ) {
        return '#BFB9B9';
      }
      return 'transparent';
    };

    // isDarkShade
    const bgColor =
      ifExist(appTheme.thm_primary_color) || appInfo.primary_color;

    const theme = {
      primary: {
        bgColor: bgColor, // for splash
        fontStyle: ifExist(appTheme.thm_main_font) || appInfo.main_font,
        fontColor: isDarkShade(bgColor) ? colors.white : colors.appBlue, // use dynamic from app
      },
      header: {
        bgColor:
          ifExist(appTheme.thm_header_color) || appInfo.header_color,
        fontStyle:
          ifExist(appTheme.thm_header_font) || appInfo.header_font,
        textColor:
          ifExist(appTheme.thm_header_text_color) ||
          appInfo.header_text_color, // will also be used for backbutton, search icon
        textHighlightColor:
          ifExist(appTheme.thm_header_text_highlight_color) ||
          appInfo.header_text_highlight_color,
        buttonColor:
          ifExist(appTheme.thm_header_button_color) ||
          appInfo.header_button_color, // follow button
        buttonTextColor:
          ifExist(appTheme.thm_header_button_text_color) ||
          appInfo.header_button_text_color, // follow button text color
        buttonTextHighlightColor:
          ifExist(appTheme.thm_header_button_text_highlight_color) ||
          appInfo.header_button_text_highlight_color,
      },
      filters: {
        bgColor:
          ifExist(appTheme.thm_filter_row_background_color) ||
          ifExist(appTheme.thm_header_color) ||
          appInfo.header_color,
        textColor:
          ifExist(appTheme.thm_header_menu_text_color) ||
          appInfo.header_menu_text_color,
        textHighlightColor:
          ifExist(appTheme.thm_header_menu_text_highlight_color) ||
          appInfo.thm_header_menu_text_highlight_color ||
          '#BFB9B9',
        // unselected
        buttonColor:
          ifExist(appTheme.thm_light_button_color) ||
          appInfo.light_button_color,
        buttonTextColor: appTheme.thm_light_button_text_color || '#FFFFFF',
        buttonBorderColor:
          colorCheck(appTheme.thm_light_button_color) || '#BFB9B9',
        // selected
        buttonHighlightColor:
          ifExist(appTheme.thm_medium_button_color) ||
          appInfo.medium_button_color,
        buttonTextHighlightColor:
          appTheme.thm_medium_button_text_color || '#BFB9B9',
      },
      menu: {
        bgColor:
          ifExist(appTheme.thm_channel_menu_color) ||
          ifExist(appTheme.thm_header_menu_color) ||
          appInfo.header_color,
        textColor:
          ifExist(appTheme.thm_channel_menu_text_color) ||
          appInfo.header_menu_text_color,
        textHighlightColor:
          appTheme.thm_channel_menu_text_highlight_color || '#BFB9B9',
        // unselected
        // buttonColor: ifExist(appTheme.thm_channel_light_button_color) || appInfo.light_button_color,
        buttonColor: appTheme.thm_channel_light_button_color || 'transparent',
        buttonTextColor:
          appTheme.thm_channel_light_button_text_color || '#FFFFFF',
        buttonBorderColor:
          appTheme.thm_channel_light_button_color || 'transparent',
        // buttonBorderColor: colorCheck(appTheme.thm_channel_light_button_color) || '#BFB9B9',
        // selected
        // buttonHighlightColor: ifExist(appTheme.thm_channel_medium_button_color) || appInfo.medium_button_color,
        buttonHighlightColor:
          appTheme.thm_channel_medium_button_color || 'transparent',
        buttonTextHighlightColor:
          appTheme.thm_channel_medium_button_text_color || '#BFB9B9',
      },
      page: {
        bgColor:
          ifExist(appTheme.thm_page_color) ||
          ifExist(appTheme.thm_header_color) ||
          'black',
        textColor: ifExist(appTheme.thm_page_text_color) || '#ffffff',
        textHighlightColor:
          ifExist(appTheme.thm_page_text_highlight_color) || colors.red,
        chatBgColor: ifExist(appTheme.chatbg_color) || colors.white,
      },
      footer: {
        bgColor: ifExist(appTheme.thm_footer_color) || colors.white,
        textColor: ifExist(appTheme.thm_footer_text_color) || colors.darkGray,
        textHighlightColor:
          ifExist(appTheme.thm_footer_text_highlight_color) || colors.darkGray,
      },
    };
    return theme;
  }
  return {};
};
