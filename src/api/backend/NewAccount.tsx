import Request, { Response, ResponseAccountBody } from '../util/Request';

import { AccountResponse, AccountSendResponse } from './response/NewAccount';
import Session from '../Session';
import { DefaultErrorResponse } from './response/Error';
export default class NewAccount {
  static async newAccountPreview(
    email: string
  ): Promise<Response<ResponseAccountBody<AccountResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      valueDate: '',
      channel: 'phonegap',
      currencyKey: 1,
      productId: '1414', //Soles
      delivery: {
        type: 1,
        _destination: email,
      },
    };
    return Request.post('execute/accounts.add.preview', params, {
      headers: {
        authorization,
      },
    });
  }
  static async newAccountSend(
    email: string,
    otp: string,
    acceptTermAndCondition: boolean,
    checkresedence: boolean,
    checkdataprotection: boolean
  ): Promise<
    Response<ResponseAccountBody<AccountSendResponse | DefaultErrorResponse>>
  > {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      valueDate: '',
      channel: 'phonegap',
      _otp: otp,
      acceptTermAndCondition: acceptTermAndCondition,
      currencyKey: 1,
      productId: '1414',
      checkresedence: checkresedence ? 1 : 0,
      checkdataprotection: checkdataprotection ? 1 : 0,
      delivery: {
        type: 1,
        _destination: email,
      },
    };
    return Request.post('execute/accounts.add.send', params, {
      headers: {
        authorization,
      },
    });
  }
}
