import Realm, { Results } from 'realm';
import { Log } from '../../../resources/log';
import Validate from '../../functions/Validate';
import {
  AmountModel,
  ReminderModel,
  UserModel,
  CacheModel,
  AdModel,
  OnboardingModel,
  EmailStatusModel,
} from '../models';
import SettingsModel from '../models/SettingsModel';

const TAG = '[AppStorage]';
export type SchemaType = string;

enum UpdateMode {
  Never = 'never',
  Modified = 'modified',
  All = 'all',
}
export default class AppStorage {
  static async open() {
    return Realm.open({
      schema: [
        CacheModel.schema,
        UserModel.schema,
        AmountModel.schema,
        ReminderModel.schema,
        SettingsModel.schema,
        AdModel.schema,
        OnboardingModel.schema,
        EmailStatusModel.schema,
      ],
      schemaVersion: 21,
      encryptionKey: await Validate.createId(),
      path: 'app.realm',
    });
  }

  static async create<T>(schema: SchemaType, object: T): Promise<T> {
    const realm = await AppStorage.open();
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          const output = realm.create<T>(schema, object, UpdateMode.All);
          if (output) {
            Log.debug(TAG, JSON.stringify(output));
            resolve(output);
            return;
          }
          reject(new Error('error writing schema'));
        });
      } catch (e) {
        Log.exception(TAG, 'create', e);
        reject(e);
      }
    });
  }

  static async write<T>(callback: () => T): Promise<T> {
    const realm = await AppStorage.open();
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          resolve(callback());
        });
      } catch (e) {
        Log.exception(TAG, 'write', e);
        reject(e);
      }
    });
  }

  static async findOne<T>(
    schema: SchemaType,
    query: string,
    ...arg: any[]
  ): Promise<T & Realm.Object> {
    const realm = await AppStorage.open();
    return new Promise((resolve, reject) => {
      const results = realm.objects<T>(schema).filtered(query, ...arg);
      if (results.length > 0) {
        resolve(results[0]);
        return;
      }
      reject(new Error('result not found'));
    });
  }

  static async find<T>(
    schema: SchemaType,
    query: string,
    ...arg: any[]
  ): Promise<Results<T & Realm.Object>> {
    const realm = await AppStorage.open();
    return new Promise(resolve => {
      const results = realm.objects<T>(schema).filtered(query, ...arg);
      resolve(results);
    });
  }

  static async findAll<T>(
    schema: SchemaType
  ): Promise<Results<T & Realm.Object>> {
    const realm = await AppStorage.open();
    return new Promise(resolve => {
      const results = realm.objects<T>(schema);
      resolve(results);
    });
  }

  static async delete(
    schema: SchemaType,
    query: string,
    ...arg: any[]
  ): Promise<boolean> {
    const realm = await AppStorage.open();
    return new Promise((resolve, reject) => {
      const results = realm.objects(schema).filtered(query, ...arg);
      try {
        realm.write(() => {
          if (results) {
            realm.delete(results);
            resolve(true);
            return;
          }

          resolve(false);
        });
      } catch (e) {
        Log.exception(TAG, 'delete', e);
        reject(e);
      }
    });
  }
}
