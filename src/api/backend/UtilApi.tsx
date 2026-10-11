import Request, { Response, ResponseBody } from '../util/Request';

import { LpdpResponse, UpdateLpdpResponse } from './response/UtilApi';

export default class UtilApi {
  static async getLPDP(
    documentType: string,
    documentNumber: string
  ): Promise<Response<ResponseBody<LpdpResponse>>> {
    const params = {
      documentType,
      documentNumber,
    };
    return Request.post('getlpdp', params);
  }

  static async updateLPDP(
    documentType: string,
    documentNumber: string,
    flagLPDP: string,
    documentCountry: string
  ): Promise<Response<ResponseBody<UpdateLpdpResponse>>> {
    const params = {
      documentType,
      documentNumber,
      flagLPDP,
      documentCountry,
    };
    return Request.post('updatelpdp', params);
  }
}
