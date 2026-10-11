import Request, { Response, ResponseBody } from '../util/Request';
import { ListResponse } from './response/AvailableFeatures';

export default class AvailableFeatures {
  static async list(): Promise<Response<ResponseBody<ListResponse>>> {
    return Request.get('availableFeatures');
  }
}
