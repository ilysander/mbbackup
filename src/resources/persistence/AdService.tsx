import { AdModel, AdObj } from './models';
import AppStorage from './storage/AppStorage';
import Log from '../log/Log';
const moment = require('moment');

const TAG = '[AdService]';
export default class AdService {
  static async create(object: AdModel) {
    const result = await AppStorage.create<AdModel>(
      AdModel.schema.name,
      object
    );
    return AdObj.cloneByModel(result);
  }
  static async findOneOrCreate(object: AdModel) {
    try {
      const item = await this.findOne(object.id);
      if (item) {
        return AdObj.cloneByModel(item);
      }
    } catch (e) {
      Log.debug(TAG, 'findOneOrCreate', e);
    }
    return await this.create(object);
  }

  static async createOrUpdate(object: AdModel) {
    try {
      const item = await this.findOne(object.id);
      if (item) {
        const ad = await AppStorage.write<AdModel>(() => {
          item.payload = object.payload;
          item.counterLimit = object.counterLimit;
          item.timeoutRenew = object.timeoutRenew;
          return item;
        });
        return AdObj.cloneByModel(ad);
      }
    } catch (e) {
      Log.debug(TAG, 'createOrUpdate', e);
    }

    return await this.create(object);
  }

  static async findAll() {
    return await AppStorage.findAll<AdModel>(AdModel.schema.name);
  }

  static async findOne(id: string) {
    return await AppStorage.findOne<AdModel>(AdModel.schema.name, `id=$0`, id);
  }

  static async findOneAd(id: string) {
    const ad = await AppStorage.findOne<AdModel>(
      AdModel.schema.name,
      `id=$0`,
      id
    );
    return AdObj.cloneByModel(ad);
  }

  static async adCount(object: AdObj) {
    try {
      const model = await this.findOne(object.id);

      const newAd = await AppStorage.write(() => {
        model.counter++;
        const allow =
          model.counterLimit < 1 ? true : model.counter < model.counterLimit;
        if (!allow) {
          // renew
          model.dateRenew = moment()
            .add(model.timeoutRenew, 'minutes')
            .toDate();
        }
        return model;
      });

      return AdObj.cloneByModel(newAd);
    } catch (error) {}
    return;
  }

  static async adReset(object: AdObj) {
    try {
      const model = await this.findOne(object.id);

      const newAd = await AppStorage.write(() => {
        model.counter = 0;

        // renew
        model.dateRenew = moment()
          .add(model.timeoutRenew, 'minutes')
          .toDate();

        return model;
      });

      return AdObj.cloneByModel(newAd);
    } catch (error) {}
    return;
  }

  static async delete(object: AdModel) {
    const result = await AppStorage.delete(
      AdModel.schema.name,
      `id=$0`,
      object.id
    );
    return result;
  }
}
