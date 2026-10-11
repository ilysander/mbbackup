export default class DeviceInfo {
  static uniqueId = '1234';

  static async getBuildId() {
    return await this.uniqueId;
  }
  static async getUniqueId() {
    return await this.uniqueId;
  }
  static getBundleId() {
    return 'com.sample.app';
  }
  static getDeviceId() {
    return 'abcde';
  }
  static getManufacturer() {
    return 'abcde';
  }
  static getModel() {
    return 'abcde';
  }
  static getDeviceLocale() {
    return 'es';
  }
  static getFirstInstallTime() {
    return '';
  }
  static getLastUpdateTime() {
    return '';
  }
  static getSystemVersion() {
    return '';
  }
  static getReadableVersion() {
    return '';
  }
  static getVersion() {
    return '2.0';
  }
  static getBuildNumber() {
    return '200';
  }
  static isEmulator() {
    return 'false';
  }
}
