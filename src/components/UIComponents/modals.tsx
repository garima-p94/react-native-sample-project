import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { BaseHeader } from './header';
import { spacing } from '@styles';
import { CustomStyles } from '@types';

interface OverlayProps extends CustomStyles {
  isVisible: boolean;
  onClose: () => void;
  children: typeof React.Component | React.ReactNode;
  isHeader?: boolean;
  modalProps?: object;
}
export const Overlay = ({
  isVisible,
  onClose,
  children,
  isHeader,
  modalProps,
}: OverlayProps) => (
  <Modal
    visible={isVisible}
    animationType="slide"
    style={styles.modalView}
    onRequestClose={() => onClose()}
    {...modalProps}>
    <View style={{ flex: 1 }}>
      {isHeader && <BaseHeader onClose={() => onClose()} showSubmit={false} />}
      {children}
    </View>
  </Modal>
);
Overlay.defaultProps = {
  isVisible: false.valueOf,
  onClose: () => {},
  isHeader: true,
  modalProps: {},
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: 'red',
    padding: spacing.m,
  },
});
