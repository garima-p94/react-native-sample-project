import React, { useMemo, useCallback } from 'react';
import { Linking } from 'react-native';
import { ImageObject } from './objects';
import { isExist, getObjectImage } from '@helpers';
import { objectSizes } from '@constants';
import { ObjectType } from '@types';

export const BannerObject = ({ object, layoutType, layoutUI }: ObjectType) => {
  const { ui, image } = useMemo(() => {
    return {
      ui: isExist(layoutUI) ? { ...layoutUI } : objectSizes[layoutType],
      image: getObjectImage({
        obj: { ...object, layoutType },
        isUri: false,
      }),
    };
  }, [layoutType, layoutUI, object]);

  const onClick = useCallback((obj: ObjectType) => {
    if (isExist(obj.banner_click)) {
      const isInternal = obj.banner_click.includes('example.com');
      if (!isInternal) {
        Linking.openURL(obj.banner_click);
      }
    }
  }, []);

  return (
    <ImageObject
      isOrgRatio={true}
      isClickable
      object={object}
      image={image}
      extraStyles={{ ...ui }} // marginLeft: isManual ? 20 : 0
      onClick={onClick}
    />
  );
};
BannerObject.defaultProps = {
  object: {},
  layoutType: 'banner',
};
