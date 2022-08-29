import React, { useMemo, useCallback } from 'react';
import { View, Linking, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ImageObject } from './objects';
import { CustomText, FlatListView } from '../UIComponents';
import {
  toFloatType,
  toCurrencyFormat,
  toCoinFormat,
  isExist,
  ifExist,
  isObject,
  getObjectImage,
} from '@helpers';
import { objectSizes, ObjectCategories } from '@constants';
import { spacing, globalStyles, colors, fonts } from '@styles';
import { CategoryType } from '.';

const { square } = objectSizes;

export const PostItem = React.memo(
  ({
    object,
    layoutType, // ui type = banner, card etc
    objectType, // type of post
    layoutUI, // optional = current ui type details
    isDetails,
    // customClick,
    // isCategory,
    // isObjDetails,
    // isUser,
    // isDisabled,
    // extraStyles,
    // postType,
    // removeProps,
  }) => {
    const { navigate, push } = useNavigation();

    const { ui, image } = useMemo(() => {
      return {
        ui: isObject(layoutUI) ? { ...layoutUI } : objectSizes[layoutType],
        image: getObjectImage({
          obj: { ...object, layoutType, objectType },
          isUri: false,
        }),
      };
    }, [layoutType, layoutUI, object, objectType]);

    const onObjectClick = useCallback(
      (opt = {}) => {
        const { isProfile } = opt;
        // if (customClick) {
        //   customClick(object);
        // } else
        if (isProfile) {
          navigate('ProfileCard', { profileData: object });
        } else if (
          (object.post_type === 'Link' || object.post_type === 'Image') &&
          isExist(object.post_url)
        ) {
          Linking.openURL(object.post_url);
        } else {
          push('PostCard', { postData: { ...object, source_type: 'post' } });
        }
      },
      [object, navigate, push],
    );

    const { postPrice, isVideo, isYoutube } = useMemo(() => {
      let price = '';
      if (isExist(object.price) || isExist(object.post_price)) {
        price = ifExist(object.price) || ifExist(object.post_price) || '';
        if (isExist(price)) {
          const numValue =
            typeof price === 'string' ? parseFloat(price).toFixed(2) : price;
          return isExist(numValue) && numValue !== '0.00' ? `$${numValue}` : '';
        }
      }
      return {
        price,
        isVideo: isExist(object.post_type) && object.post_type === 'Video',
        isYoutube:
          isExist(object.post_url) && object.post_url.includes('youtube'),
      };
    }, [object]);

    return (
      <View style={{ width: ui.width }}>
        <ImageObject
          image={image}
          object={{ ...object }}
          extraStyles={{ ...ui }}
          isContainedImg={['Product', 'Book', 'Music'].includes(objectType)}
        />
        {/* <TouchableOpacity
          disabled={isDisabled}
          style={{ position: 'relative' }}
          onPress={() => onObjectClick()}>
          <ImageObject
            {...removeProps}
            isClickable={!isDisabled}
            object={{ ...object, objType: 'Post', objSubType: postType }}
            extraStyles={object.displayUI}
          />
          {isVideo && (
            <VideoPlayImage
              videoType={isYoutube ? 'youtube' : 'vimeo'}
              ytStyles={{ height: 35.28, width: 50, bottom: 32 }}
              otherStyles={{ bottom: 26, height: 42, width: 42 }}
            />
          )}
        </TouchableOpacity> */}
        <View style={{ marginTop: spacing.s }}>
          {/* pointerEvents={isDisabled ? 'none' : 'auto'}>
          {isCategory && (
            <CategoryType text={object.post_type || object.post_sub_type} />
          )} */}
          {isDetails && (
            <View style={{ width: '100%' }}>
              {/* <Publisher item={object} imageStyles={styles.publisher} /> */}
              {/* isUser && (
                <TouchableOpacity
                  style={styles.userInfo}
                  onPress={() => onObjectClick({ isProfile: true })}>
                  <UserObject isDisabled user={object} userWidth={30} />
                  <DetailsText
                    details={object.uname}
                    extraStyles={{
                      fontWeight: '700',
                      fontSize: 12,
                      marginLeft: 5,
                    }}
                  />
                </TouchableOpacity>
              ) */}
              <TouchableOpacity
                onPress={() => onObjectClick()}
                style={{ width: '95%' }}>
                <CustomText
                  isHeading={true}
                  size="s"
                  text={object.post_title || object.name}
                  extraStyles={{ height: 35 }}
                  numberOfLines={2}
                />
                {isExist(postPrice) && (
                  <CustomText
                    isHeading
                    size="m"
                    text={postPrice}
                    extraStyles={{
                      color: colors.mediumGray,
                      marginTop: spacing.xs,
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  },
);

PostItem.defaultProps = {
  object: {},
  customClick: null,
  isCategory: false,
  isDetails: true,
  isUser: true,
  isDisabled: false,
  extraStyles: {},
  postType: '',
  isRemove: false,
  removeProps: {},
};
