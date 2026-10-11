import { CacheModel, CacheObj } from './models/CacheModel';
import AppStorage from './storage/AppStorage';
import Log from '../log/Log';

const TAG = '[CacheService]';
export default class CacheService {
  static async create(object: CacheObj) {
    const result = await AppStorage.create<CacheModel>(
      CacheModel.schema.name,
      object
    );
    return result;
  }

  static async createOrUpdate(object: CacheObj) {
    try {
      const item = await this.findOne(object.key);
      if (item) {
        return await AppStorage.write<CacheModel>(() => {
          item.value = object.value;
          return item;
        });
      }
    } catch (e) {
      Log.debug(TAG, 'createOrUpdate', e);
    }
    return await this.create(object);
  }

  static async updateOrCreateValueByKey(key: string, value: string) {
    try {
      const item = await this.findOne(key);
      if (!!item) {
        const object = CacheObj.init(key, value);

        const newValue = await this.create(object);
        console.log('newValue.value:', newValue.value);
        return newValue;
      }
    } catch (e) {
      Log.debug(TAG, 'updateOrCreateValueByKey', e);
    }
    const object = CacheObj.init(key, value);

    return await this.create(object);
  }

  static async findAll() {
    return await AppStorage.findAll<CacheModel>(CacheModel.schema.name);
  }

  static async findOne(key: string) {
    try {
      return await AppStorage.findOne<CacheModel>(
        CacheModel.schema.name,
        `key=$0`,
        key
      );
    } catch (e) {
      Log.debug(TAG, 'findOne', e);
      return null;
    }
  }

  static async delete(object: CacheModel) {
    const result = await AppStorage.delete(
      CacheModel.schema.name,
      `key=$0`,
      object.key
    );
    return result;
  }
}
