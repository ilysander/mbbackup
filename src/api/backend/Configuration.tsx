import Request, { Response, ResponseBody } from '../util/Request';
import { ListResponse } from './response/Configuration';

export default class Configuration {
  static async list(): Promise<Response<ResponseBody<ListResponse>>> {
    return Request.get('configuration');
  }
}
