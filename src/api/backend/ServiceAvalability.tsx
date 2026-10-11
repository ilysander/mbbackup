import Request, { Response, ResponseBody } from '../util/Request';
import { ListResponse } from './response/ServiceAvalability';

export default class ServiceAvalability {
  static async list(): Promise<Response<ResponseBody<ListResponse>>> {
    return Request.get('serviceavalability');
  }
}
