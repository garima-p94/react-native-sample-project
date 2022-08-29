import { StyleSheet } from 'react-native';
import { spacing, colors, footerFlex } from './attributes';
import { isNotch } from '@utils';

export const globalStyles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.l,
  },
  rowCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowSpacing: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowStart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  columnCenter: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnSpacing: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 6,
  },
  footerContainer: {
    flex: footerFlex,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderTopWidth: 0.2,
    borderTopColor: colors.mediumGray,
    paddingBottom: isNotch ? 18 : 0,
  },
  shadowContainer: {
    // borderWidth: 0.6,
    // borderColor: colors.lightGray,
    // borderRadius: 5,
    shadowColor: colors.black,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.5,
    elevation: 5,
    backgroundColor: colors.white,
  },
});
