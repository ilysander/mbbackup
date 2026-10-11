import { Log } from '../../resources/log';
import { MaskModel } from './models';

const TAG = '[MaskService]';
export default class MaskService {
  static open() {
    return true;
  }

  static async findFirst(): Promise<MaskModel> {
    Log.debug(TAG, 'findFirst');
    return null as any;
  }

  static async create(_object: MaskModel): Promise<MaskModel> {
    Log.debug(TAG, 'update');
    return null as any;
  }

  static async deleteAll(): Promise<boolean> {
    Log.debug(TAG, 'deleteAll');
    return true as any;
  }
}
