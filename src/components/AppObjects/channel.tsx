import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { isObject, getObjectImage } from '@helpers';
import { ImageObject, CategoryType } from './objects';
import { CustomText } from '../UIComponents';
import { objectSizes } from '@constants';
import { spacing } from '@styles';

export const ChannelItem = React.memo(
  ({
    object,
    layoutType, // ui type = banner, card etc
    objectType, // type of post
    layoutUI, // optional = current ui type details
    isDetails,
  }) => {
    const { ui, image } = useMemo(() => {
      return {
        ui: isObject(layoutUI) ? { ...layoutUI } : objectSizes[layoutType],
        image: getObjectImage({
          obj: { ...object, layoutType, objectType },
          isUri: false,
        }),
      };
    }, [layoutType, layoutUI, object, objectType]);

    return (
      <View style={{ width: ui.width }}>
        <ImageObject
          image={image}
          object={{ ...object }}
          extraStyles={{ ...ui }}
        />
        <View style={{ width: '100%' }}>
          <CategoryType
            text={object.app_type}
            extraStyles={{ marginVertical: spacing.xs }}
          />
          <CustomText
            isHeading
            size="m"
            text={object.title}
            numberOfLines={3}
          />
        </View>
      </View>
    );
  },
);
