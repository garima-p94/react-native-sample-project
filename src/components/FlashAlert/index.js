import FlashMessageManager from './FlashMessageManager';
import { styleWithInset } from './FlashMessageWrapper';
import FlashMessage, {
  DefaultFlash,
  positionStyle,
  showMessage,
  hideMessage,
  FlashMessageTransition,
  renderFlashMessageIcon,
} from './FlashMessage';
import {
  AddSuccess,
  AddFailed,
  UpdateFailed,
  UpdateSuccess,
} from './customAlerts';

export {
  FlashMessageManager,
  DefaultFlash,
  styleWithInset,
  positionStyle,
  showMessage,
  hideMessage,
  FlashMessageTransition,
  renderFlashMessageIcon,
};

export default FlashMessage;
