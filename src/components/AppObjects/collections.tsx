import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { getActiveAppState } from '@store/App';
import { isObject, getObjectImage, isExist } from '@helpers';
import { CustomText, ReadMore } from '../UIComponents';
import { ImageObject } from './objects';
import { spacing, colors, wp } from '@styles';
import { objectSizes } from '@constants';
import { ObjectType } from '@types';

export const AboutCollection = React.memo(({ object, isDisabled }: any) => {
  const app = useSelector(getActiveAppState);
  return isObject(app) && isExist(app.about) ? (
    <View
      style={styles.aboutContainer}
      pointerEvents={isDisabled ? 'none' : 'auto'}>
      <CustomText
        isHeading
        text="About"
        size="xl"
        extraStyles={{ color: colors.white }}
      />
      <ReadMore
        numberOfLines={10}
        extraStyles={{ paddingVertical: 15 }}
        textStyles={{ color: colors.white }}>
        {app.about}
      </ReadMore>
    </View>
  ) : (
    <View />
  );
});

export const CollectionObject = React.memo(
  ({ object, layoutUI, layoutType, objectType }: ObjectType) => {
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
        <CustomText
          isHeading
          size="m"
          text={object.name || object.list_display_name}
          numberOfLines={2}
          extraStyles={{ marginTop: spacing.s, height: 35 }}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  aboutContainer: {
    backgroundColor: colors.black,
    padding: spacing.l,
    width: wp(100),
    marginTop: spacing.l,
  },
});
