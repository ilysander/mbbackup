import Request, { Response, ResponseBody } from '../util/Request';
import { ListResponse } from './response/Messages';

export default class Messages {
  static async list(): Promise<Response<ResponseBody<ListResponse>>> {
    return Request.get('messages');
  }
}
