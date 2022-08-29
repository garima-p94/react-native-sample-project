import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { isExist, toSentenceCase } from '@helpers';
import { CustomText } from './text';
import { BlockIcon, CheckIcon } from './icons';
import { ObjectType } from '@types';
import { globalStyles, colors, spacing } from '@styles';

const stColors: ObjectType = {
  published: colors.appBlue,
  failed: '#FF9494',
  other: '#eed202',

  // transactionStatus
  active: '#d6ecff',
  activeText: colors.appBlue,
  block: '#fde2dd',
  blockText: colors.red,
  pending: '#ffeebc',
  pendingText: '#bc8e00',
};

export const MintingStatus = ({ status }: { status: string }) => {
  const { text, isActive, isFailed }: ObjectType = useMemo(() => {
    const st = isExist(status) ? status.trim().toLowerCase() : '';
    return {
      text: st,
      isActive: st === 'published',
      isFailed: st === 'failed',
    };
  }, [status]);

  const { color, displayStatus }: ObjectType = useMemo(() => {
    const isOther = !isActive && !isFailed;
    return {
      isOther,
      color: !isOther ? stColors[text] : stColors.other,
      displayStatus: isActive ? 'Active' : isFailed ? 'Not minted' : 'Inactive',
    };
  }, [isActive, isFailed, text]);

  return (
    <View style={styles.mintingStatus}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <CustomText
        size="m"
        isHeading
        text={toSentenceCase(displayStatus)}
        extraStyles={{ color }}
      />
    </View>
  );
};

/* <StatusButton
    showIcon={status === 'active' || status === 'complete' || status === 'paid'}
    isActiveIcon={status === 'active' || status === 'complete' || status === 'paid'}
    isPendingIcon={status === 'created' || status === 'enabled' || status === 'pending' || status === 'Pending' || status === 'restricted soon'}
    isBlockIcon={status === 'canceled' || status === 'cancelled' || status === 'restricted'}
    buttonText={sentenceCase(status)}
    textStyles={status === 'paid' && { color: '#20563f' }}
    iconStyle={status === 'paid' && { color: '#20563f' }}
    buttonStyles={[{ width }, status === 'paid' && { backgroundColor: '#cbf6cb' }]}
  />
  const iconVisible = showIcon && (isActiveIcon || isBlockIcon);
  */

const isActiveStatus = ['active', 'complete', 'completed', 'paid'];
const isPendingStatus = ['created', 'enabled', 'pending', 'restricted soon'];
const isBlockStatus = ['canceled', 'cancelled', 'restricted'];

export const TransactionStatus = ({
  isDisabled,
  status,
  extraStyles,
}: ObjectType): JSX.Element => {
  const { statusText, isActive, isBlocked } = useMemo(() => {
    let text = isExist(status) ? status.trim().toLowerCase() : '';
    if (text === 'canceled') {
      text = 'cancelled';
    }
    return {
      statusText: toSentenceCase(text),
      isActive: isActiveStatus.includes(text),
      isPending: isPendingStatus.includes(text),
      isBlocked: isBlockStatus.includes(text),
    };
  }, [status]);

  return isExist(status) ? (
    <TouchableOpacity
      disabled={isDisabled}
      onPress={() => console.log('hit it')}
      style={[
        styles.statusButton,
        isActive && { backgroundColor: stColors.active },
        isBlocked && { backgroundColor: stColors.block },
        extraStyles,
      ]}>
      <CustomText
        text={statusText}
        size="xs"
        extraStyles={[
          styles.statusButtonText,
          isBlocked && { color: stColors.blockText },
          isActive && { color: stColors.activeText },
        ]}
      />
      {(isActive || isBlocked) && (
        <View style={{ marginLeft: spacing.xs }}>
          {isActive && <CheckIcon />}
          {isBlocked && <BlockIcon />}
        </View>
      )}
    </TouchableOpacity>
  ) : (
    <View />
  );
};

const styles = StyleSheet.create({
  mintingStatus: {
    ...globalStyles.rowStart,
    flex: 0,
    width: '100%',
    marginTop: 6,
  },
  dot: {
    width: 8,
    aspectRatio: 1,
    borderRadius: 180,
    marginRight: 4,
  },
  statusButton: {
    ...globalStyles.rowCenter,
    justifyContent: 'center',
    flex: 0,
    backgroundColor: stColors.pending,
    borderRadius: 20,
    paddingVertical: spacing.xs,
    width: 75,
  },
  statusButtonText: {
    fontWeight: '600',
    color: stColors.pendingText,
  },
});
