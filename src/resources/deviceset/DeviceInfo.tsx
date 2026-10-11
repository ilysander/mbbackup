import DeviceInfo from 'react-native-device-info';

export default class Validate {
  static userInfoLoad = (document: string) => {
    const userInfo = {
      documentType: '1',
      documentNumber: document,
    };
    return userInfo;
  };
  static deviceInfoLoad = () => {
    const deviceId = { deviceId: DeviceInfo.getUniqueId() };
    const deviceInfo = Object.assign(
      deviceId,
      Validate.deviceInfoLoadWoDevId()
    );
    return deviceInfo;
  };

  static deviceInfoLoadWoDevId = () => {
    const deviceInfo = {
      physicalDeviceId: DeviceInfo.getUniqueId(), //Ej:9c983fafd26e5060
      deviceVersion: DeviceInfo.getSystemVersion(), //Ej:6.0.1"
      deviceModel: DeviceInfo.getModel(), //Ej:SM-G532M
      deviceBrand: DeviceInfo.getBrand(), //Ej:samsung
      osVersion: DeviceInfo.getSystemVersion(), //Ej:6.0.1
      appVersion: DeviceInfo.getVersion(), //Ej:3.7.1
    };
    return deviceInfo;
  };

  static deviceDate = () => {
    const deviceDate = new Date();
    return deviceDate.toISOString();
  };

  static currentDevice = (currentDevice: number) => {
    const isCurrentDevice = currentDevice === 1 ? true : false;
    return isCurrentDevice;
  };
}
