import { Alert } from 'react-native';
import { Toast } from 'native-base';
import { colors } from '@styles';
import { CustomStyles } from '@types';
import { ifExist } from '@helpers';
import { showMessage } from '../FlashAlert';

interface AlertProps {
  onPressYes: () => void;
  onPressNo?: () => void;
  text?: string;
}

export const DeleteAlert = ({ onPressYes, onPressNo, text }: AlertProps) => {
  Alert.alert(text ? text : 'Are you sure you want to delete this item?', '', [
    { text: 'Ok', onPress: () => onPressYes() },
    {
      text: 'Cancel',
      onPress: () => (onPressNo ? onPressNo() : {}),
    },
  ]);
};

export const LogoutAlert = ({ onPressYes, onPressNo }: AlertProps) => {
  Alert.alert('Logout', 'Are you sure you want to log out?', [
    {
      text: 'Yes',
      onPress: () => onPressYes(),
    },
    {
      text: 'Cancel',
      onPress: () => (onPressNo ? onPressNo() : {}),
    },
  ]);
};

interface MessageProps {
  type: string;
  action?: string;
}

/* ADD */
export const AddSuccess = ({ type, action = 'added' }: MessageProps) => {
  return showMessage({
    message: `${type} ${action}`,
    type: 'success',
  });
};
export const AddFailed = ({ type, action = 'add' }: MessageProps) => {
  return showMessage({
    message: `Couldn't ${action} ${type}`,
    type: 'danger',
  });
};

/* UPDATE */
export const UpdateSuccess = ({ type }: MessageProps) => {
  return AddSuccess({ type, action: 'updated' });
};

export const UpdateFailed = ({ type }: MessageProps) => {
  return AddFailed({ type, action: 'update' });
};

/* DELETE */
export const DeleteSuccess = ({ type }: MessageProps) => {
  return AddSuccess({ type, action: 'deleted' });
};

export const DeleteFailed = ({ type }: MessageProps) => {
  return AddFailed({ type, action: 'delete' });
};