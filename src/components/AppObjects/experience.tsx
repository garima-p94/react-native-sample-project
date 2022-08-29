import React, { useCallback, useMemo } from 'react';
import { isExist, isBoolean, isObject, getObjectImage } from '@helpers';
import { TouchableOpacity, View } from 'react-native';
import { ImageObject } from './objects';
import { CategoryType } from '.';
import { colors } from '@styles';
import { CustomText } from '../UIComponents/text';
import { objectSizes } from '@constants';

export const ExperienceItem = React.memo(
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
    const { ui, image } = useMemo(() => {
      return {
        ui: isObject(layoutUI) ? { ...layoutUI } : objectSizes[layoutType],
        image: getObjectImage({
          obj: { ...object, layoutType, objectType },
          isUri: false,
        }),
      };
    }, [layoutType, layoutUI, object, objectType]);

    const duration = useMemo(() => {
      let period = '';
      if (isExist(object.duration_hours)) {
        const hours = parseFloat(object.duration_hours / 60, 0).toFixed(1);
        period =
          hours >= 1
            ? `${hours} ${hours > 1 ? 'hrs' : 'hour'}`
            : `${object.duration_hours} mins`;
      }
      return period;
    }, [object]);

    return (
      <View style={{ width: ui.width }}>
        <ImageObject
          image={image}
          object={{ ...object }}
          extraStyles={{ ...ui }}
        />
        {isDetails && (
          <View style={{ marginTop: 5, width: '100%' }}>
            <CategoryType text={object.CatDisplayName || object.event_types} />
            <CustomText
              isHeading
              text={object.title}
              size="m"
              extraStyles={{ height: 55 }}
              numberOfLines={3}
            />
            <View style={{ marginTop: 5, width: '95%' }}>
              <CustomText
                text={duration}
                extraStyles={{ color: colors.lightGray }}
              />
              {isExist(object.price_per_person) && (
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  {isBoolean(object.has_multiple_prices) && (
                    <CustomText
                      text="From "
                      extraStyles={{ color: colors.lightGray }}
                    />
                  )}
                  <CustomText
                    text={`$${object.price_per_person}`}
                    extraStyles={{ fontSize: 14 }}
                  />
                  <CustomText
                    text=" / person"
                    extraStyles={{ color: colors.lightGray }}
                  />
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    );
  },
);

{
  /* <TouchableOpacity
        disabled={isDisabled}
        onPress={() => onObjectClick()}
        style={extraStyles}>
        <ImageObject
          isDisabled
          object={object}
          extraStyles={object.displayUI}
          {...removeProps}
        />
        {isObjDetails && (
          <View style={{ marginTop: 5, width: '100%' }}>
            {isCategory && (
              <CategoryType
                text={object.CatDisplayName || object.event_types}
                extraStyles={{ height: !isSmallDisplay ? 18 : 35 }}
              />
            )}
            <CustomText
              text={object.title}
              extraStyles={[
                styles.experienceName,
                isSmallDisplay && { height: 55 },
              ]}
              numberOfLines={3}
            />
            <View style={{ marginTop: 5, width: '95%' }}>
              <CustomText
                text={duration}
                extraStyles={{ color: colors.lightGray }}
              />
              {isExist(object.price_per_person) && (
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  {isBoolean(object.has_multiple_prices) && (
                    <CustomText
                      text="From "
                      extraStyles={{ color: colors.lightGray }}
                    />
                  )}
                  <CustomText
                    text={`$${object.price_per_person}`}
                    extraStyles={{ fontSize: 14 }}
                  />
                  <CustomText
                    text=" / person"
                    extraStyles={{ color: colors.lightGray }}
                  />
                </View>
              )}
            </View>
          </View>
        )}
      </TouchableOpacity> */
}
