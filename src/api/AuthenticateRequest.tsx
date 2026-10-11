import Request from './util/Request';

export interface ResponseAuthenticateRequest {
  body: { data: string };
  headers: Object;
  status: number;
}
export default class AuthenticateRequestController {
  static async startRequest(
    payload: string
  ): Promise<ResponseAuthenticateRequest> {
    return Request.post('start-request', { request: payload });
  }
}
