import { Linking as BaseLinking } from 'react-native';

export default class Linking {
  static canOpenURL(url: string): Promise<boolean> {
    return BaseLinking.canOpenURL(url);
  }

  static async openURL(url: string): Promise<boolean> {
    return BaseLinking.openURL(url);
  }
}
