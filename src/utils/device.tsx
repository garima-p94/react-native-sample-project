import { Platform, NativeModules } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const appOS = parseInt(Platform.Version, 10);
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const appName = DeviceInfo.getApplicationName();
export const buildNumber = DeviceInfo.getBuildNumber();
export const appVerion = DeviceInfo.getVersion();
export const device = DeviceInfo.getDeviceId();
export const deviceId = DeviceInfo.getUniqueId();

export const isNotch = DeviceInfo.hasNotch();
