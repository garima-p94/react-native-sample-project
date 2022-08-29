import React, { useMemo, useState, useCallback } from 'react';
import { StyleSheet, Pressable, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import {
  getObjectImage,
  ifExist,
  isExist,
  isObject,
  getAspectRatio,
} from '@helpers';
import { CustomText } from '@components';
import { objectSizes } from '@constants';
import { wp, colors, globalStyles } from '@styles';

// banner, minicard, card, medium, small, icon, sqaure, round,
interface ObjectProps {
  image?: string | object;
  object: object;
  isUri: boolean;
  imageKey?: string;
  extraStyles?: {};
  isClickable?: boolean;
  isColumns?: boolean;
  onClick?: (e: object) => void;
  isRounded?: boolean;
  isOrgRatio?: boolean;
  isContainedImg?: boolean;
  isShadow?: boolean;
  uiType?:
    | string
    | 'banner'
    | 'minicard'
    | 'card'
    | 'medium'
    | 'small'
    | 'icon'
    | 'sqaure'
    | 'round';
}
const videoFormat = ['mp4', 'mov'];
export const ImageObject = ({
  object,
  uiType,
  isClickable,
  onClick,
  isUri,
  image,
  extraStyles,
  isColumns,
  isRounded,
  isOrgRatio,
  isShadow,
  isContainedImg,
}: ObjectProps) => {
  const [objHeight, setObjHeight] = useState(250);
  const [loading, setLoading] = useState(true);

  const { objectImg, mediaType, link } = useMemo(() => {
    const img = isExist(image)
      ? image
      : getObjectImage({ obj: object, isUri: false });
    const objLink = object.asset_file || '';
    const isVideoFormat = isExist(objLink)
      ? videoFormat.find((d) => objLink.includes(`.${d}`))
      : false;
    return {
      objectImg: img,
      mediaType: isVideoFormat ? 'video' : 'image',
      link: objLink,
    };
  }, [object, image]);

  const { imageStyles, borderRadius } = useMemo(() => {
    const type = isExist(uiType) ? objectSizes[uiType] : {};
    let st =
      isColumns && isObject(type)
        ? { ...type, ...type.multiColumns }
        : { ...type };
    st = { ...styles.imageObject, ...st, ...extraStyles };
    if (isRounded) {
      st.borderRadius = 180;
    }
    if (isOrgRatio) {
      st.height = objHeight;
      delete st.aspectRatio;
    }
    if (isShadow) {
      st = { ...globalStyles.shadowContainer, ...st, overflow: 'visible' };
    }
    if (!loading) {
      st.backgroundColor = 'transparent';
    }
    return {
      imageStyles: { ...st },
      borderRadius: ifExist(st.borderRadius) || 0,
    };
  }, [
    uiType,
    isColumns,
    extraStyles,
    isRounded,
    isOrgRatio,
    isShadow,
    loading,
    objHeight,
  ]);

  const imageSize = useCallback(() => {
    if (isOrgRatio) {
      Image.getSize(
        objectImg,
        (width, height) => {
          const lw = ifExist(imageStyles.width) || wp(90);
          const h = getAspectRatio({ iw: width, ih: height, lw });
          setObjHeight(h);
          setLoading(false);
        },
        (e) => console.log('failure', e),
      );
    }
  }, [isOrgRatio, objectImg, imageStyles]);

  return (
    <Pressable
      disabled={!isClickable}
      onPress={() => onClick && onClick(object)}
      style={imageStyles}>
      {mediaType === 'video' ? (
        <Video
          resizeMode="cover"
          style={[{ width: '100%', height: '100%' }]}
          source={{ uri: link }}
          muted
          repeat
        />
      ) : (
        <FastImage
          source={isUri ? { uri: objectImg } : objectImg}
          style={[styles.image, isShadow && { borderRadius }]}
          onLoad={() => imageSize()}
          resizeMode={isContainedImg ? 'contain' : 'cover'}
        />
      )}
    </Pressable>
  );
};

ImageObject.defaultProps = {
  isClickable: true,
  isUri: true,
  uiType: '',
  isColumns: false,
  isRounded: false,
  isShadow: false,
};

// text
export const CategoryType = ({
  text,
  extraStyles,
}: {
  text: string;
  extraStyles?: {};
}): JSX.Element => (
  <CustomText
    text={text.toUpperCase()}
    size="s"
    extraStyles={{ color: colors.appBlue, ...extraStyles }}
  />
);

const styles = StyleSheet.create({
  imageObject: {
    aspectRatio: 1,
    width: wp(20),
    backgroundColor: colors.lightGray,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
