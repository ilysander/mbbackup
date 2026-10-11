import Realm from 'realm';
import { Log } from '../../resources/log';
import { Validate } from '../functions';
import { MaskModel } from './models';

const TAG = '[MaskService]';
export default class MaskService {
  static async open() {
    return Realm.open({
      schema: [MaskModel.schema],
      schemaVersion: 9,
      encryptionKey:await Validate.createId(),
      path: 'mibanco.realm',
    });
  }

  static async findFirst(): Promise<MaskModel & Realm.Object> {
    Log.debug(TAG, 'findFirst');
    const repository = await MaskService.open();
    return new Promise((resolve, reject) => {
      const results = repository.objects<MaskModel>(MaskModel.schema.name);
      if (results.length > 0) {
        resolve(results[0]);
        return;
      }
      reject(new Error('schema not found'));
    });
  }

  static async findOneByTypeOrNull(
    type: string
  ): Promise<MaskModel & Realm.Object> {
    Log.debug(TAG, 'getByTypeOrNull');
    const repository = await MaskService.open();
    return new Promise((resolve, reject) => {
      const results = repository
        .objects<MaskModel>(MaskModel.schema.name)
        .filtered(`type=$0 OR type=NULL`, type);
      if (results.length > 0) {
        resolve(results[0]);
        return;
      }
      reject(new Error('schema not found'));
    });
  }

  static async findOneByType(type: string): Promise<MaskModel & Realm.Object> {
    Log.debug(TAG, 'getByType');
    const repository = await MaskService.open();
    return new Promise((resolve, reject) => {
      const results = repository
        .objects<MaskModel>(MaskModel.schema.name)
        .filtered(`type=$0`, type);
      if (results.length > 0) {
        resolve(results[0]);
        return;
      }
      reject(new Error('schema not found'));
    });
  }

  static async create(object: MaskModel): Promise<MaskModel> {
    Log.debug(TAG, 'update');
    const repository = await MaskService.open();
    return new Promise((resolve, reject) => {
      try {
        const results = repository
          .objects<MaskModel>(MaskModel.schema.name)
          .filtered(`type=$0`, object.type);
        repository.write(() => {
          if (results) {
            repository.delete(results);
          }
          const output = repository.create<MaskModel>(
            MaskModel.schema.name,
            object
          );
          if (output) {
            resolve(output);
            return;
          }
          reject(new Error('error writing schema'));
        });
      } catch (e) {
        Log.exception(TAG, 'save', e);
        reject(e);
      }
    });
  }

  static async deleteAll(): Promise<boolean> {
    Log.debug(TAG, 'deleteAll');

    const repository = await MaskService.open();
    return new Promise((resolve, reject) => {
      try {
        const results = repository.objects<MaskModel>(MaskModel.schema.name);
        repository.write(() => {
          if (results) {
            repository.delete(results);
            resolve(true);
            return;
          }
          resolve(false);
        });
      } catch (e) {
        Log.exception(TAG, 'deleteAll', e);
        reject(e);
      }
    });
  }
}
