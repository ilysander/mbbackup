import { Dimensions, Platform, StatusBar } from 'react-native';
import SizeDevices from '../constants/SizeDevices';

export default class Size {
  static getStatusBarHeight(): number {
    return Platform.OS === 'android'
      ? StatusBar.currentHeight || 0
      : this.isiPhoneX()
      ? 44
      : 20;
  }

  static getActionBarHeight(): number {
    return Platform.OS === 'ios' ? 64 : 56;
  }

  static getHeight(): number {
    const dimensions = Dimensions.get('window');
    return dimensions.height;
  }

  static getWidth(): number {
    const dimensions = Dimensions.get('window');
    return dimensions.width;
  }

  static getScreenHeight(): number {
    const dimensions = Dimensions.get('screen');
    return dimensions.height;
  }

  static getScreenWidth(): number {
    const dimensions = Dimensions.get('screen');
    return dimensions.width;
  }

  static getVisibleHeight(): number {
    return this.getHeight() - this.getStatusBarHeight();
  }

  static getVisibleWidth(): number {
    return this.getWidth();
  }

  /**
   * Actualmente retornamos `0` porque hasta el momento
   * se esta dejando de usar en la version 2
   */
  static getHeaderBarHeight(): number {
    return 0;
  }

  static getBottomInsetHeight(): number {
    if (this.isiPhoneX()) {
      return 30;
    }
    return 0;
  }

  static getBottomNavBarHeight(): number {
    const value =
      Dimensions.get('screen').height - Dimensions.get('window').height;
    return value;
  }

  static getVisibleScreenHeight(): number {
    return (
      this.getVisibleHeight() -
      this.getActionBarHeight() -
      this.getHeaderBarHeight()
    );
  }

  static getVisibleTabScreenHeight(): number {
    return this.getVisibleScreenHeight() - this.getTabBarHeight();
  }

  static getTabBarHeight(): number {
    if (this.isiPhoneX()) {
      return 65;
    }
    if (Platform.OS === 'ios') {
      return 30;
    }
    return 50;
  }

  static getBottomTabBarHeight(): number {
    if (this.isiPhoneX()) {
      return 84; // Should be aligned with getTabBarHeight
    }
    return 50;
  }

  static isiPhoneX(): boolean {
    const { height, width } = Dimensions.get('window');
    const isAllowedDevice =
      // @ts-ignore
      Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS;
    const isAlternativeDevice = height === 896 || width === 896;
    return (
      isAllowedDevice &&
      (height === 812 || width === 812 || isAlternativeDevice)
    );
  }

  static getBottomOffset(): number {
    return 0;
  }

  static getProportionalHeight(val: number): number {
    const propHeight = this.getHeight() * val;
    return propHeight;
  }
  static getProportionalWidth(val: number): number {
    const propWidth = this.getWidth() * val;
    return propWidth;
  }

  static getSpecsFromDevice(): any {
    const { height } = Dimensions.get('window');
    let sizeDevice: any = {};
    for (const name in SizeDevices) {
      if (SizeDevices[name].min <= height && height <= SizeDevices[name].max) {
        sizeDevice = SizeDevices[name];
        break;
      }
    }
    return {
      isIOS: Platform.OS === 'ios',
      isSmall: sizeDevice.name === SizeDevices.SMALL.name,
      isMedium: sizeDevice.name === SizeDevices.MEDIUM.name,
      isHight: sizeDevice.name === SizeDevices.HIGHT.name,
      isUHD: sizeDevice.name === SizeDevices.UHD.name,
      isSmallOrMedium:
        sizeDevice.name === SizeDevices.SMALL.name ||
        sizeDevice.name === SizeDevices.MEDIUM.name,
    };
  }
}
