import Request, { Response, ResponseTransactionBody } from '../util/Request';
import { ApiKeyboardResponse } from './response/ApiKeyboard';
import { DefaultErrorResponse } from './response/Error';
let resolvers: any[] = [];
let blocked = false;
let activity = '';

export default class ApiKeyboard {
  static async keyboardGenerateToken(
    idActivity: string
  ): Promise<
    Response<
      ResponseTransactionBody<ApiKeyboardResponse | DefaultErrorResponse>
    >
  > {
    if (blocked && idActivity === activity) {
      return new Promise((resolve: any) => {
        resolvers.push(resolve);
      });
    }

    blocked = true;
    activity = idActivity;
    const params = {
      channel: 'phonegap',
      idActivity: idActivity,
    };
    let response: any;
    try {
      response = await Request.post('keyboard', params);
    } catch (e) {
      response = undefined;
    }
    if (params.idActivity === activity) {
      resolvers.forEach(resolve => {
        resolve(response);
      });
      resolvers = [];
    }
    blocked = false;
    return response;
  }
}
