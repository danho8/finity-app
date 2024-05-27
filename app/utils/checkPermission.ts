import {Linking, PermissionsAndroid, Platform} from 'react-native';
import {
  PERMISSIONS,
  check,
  request,
  checkMultiple,
  Permission,
  RESULTS,
  requestMultiple,
} from 'react-native-permissions';

export const _hasAndroidPermissionWriteExternalStorage = async () => {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
};

export const _hasIOSPermissionWriteExternalStorage = async () => {
  const permission = PERMISSIONS.IOS.PHOTO_LIBRARY;

  const hasPermission = await check(permission);
  if (hasPermission == 'granted') {
    return true;
  }

  const status = await request(permission, {
    title: 'hung',
    message: 'hung',
    buttonPositive: 'hung',
  });

  if (status === 'blocked') {
    Linking.openURL('app-settings://');
  }

  return status === 'granted';
};

export const _hasAndroidPermissionCamera = async () => {
  const permission = PermissionsAndroid.PERMISSIONS.CAMERA;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
};

export const _hasIOSPermissionCamera = async () => {
  const permission = PERMISSIONS.IOS.CAMERA;

  const hasPermission = await check(permission);
  if (hasPermission == 'granted') {
    return true;
  }

  const status = await request(permission);

  if (status === 'blocked') {
    Linking.openURL('app-settings://');
  }

  return status === 'granted';
};

export const _hasAndroidPermission = async (permissionText: string) => {
  const permission = PermissionsAndroid.PERMISSIONS[permissionText];

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
};

export const _hasIOSPermission = async (permissionText: string) => {
  const permission: any = permissionText;

  const hasPermission = await check(permission);
  if (hasPermission == 'granted') {
    return true;
  }

  const status = await request(permission);

  if (status === 'blocked') {
    Linking.openURL('app-settings://');
  }

  return status === 'granted';
};

export const LOCATION_PERMISSION = Platform.select({
  ios: [PERMISSIONS.IOS.LOCATION_ALWAYS],
  android: [
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  ],
});

export const requestPermissions = async (permissions: Permission[]) => {
  const statuses = await checkMultiple(permissions.filter(eq => !!eq));
  const deniedPermission = permissions
    .filter(eq => !!eq)
    .filter(eq => statuses[eq] === RESULTS.DENIED);

  await requestMultiple(deniedPermission);

  return true;
};
