import Config from '../../Config';

export type FeaturesType = typeof Config.features;
export type Feature = keyof typeof Config.features;

export default class Features {
  static isAllowedTo(name: Feature) {
    return !!Config.features[name];
  }
}
