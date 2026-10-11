import Request, { Response, ResponseTransactionBody } from '../util/Request';
import {
  MobileBioStep1Response,
  MobileBioStep1ErrorResponse,
  MobileStepFinishResponse,
  MobileStepFinishErrorResponse,
} from './response/SignUpBio';

export default class SignUp {
  static async mobileBioStep1(
    documentNumber: string,
    captcha: string,
    selfie: string,
    selfieTemplate: string,
    doiOCRToken: string,
    doiFaceToken: string
  ): Promise<
    Response<
      ResponseTransactionBody<
        MobileBioStep1Response | MobileBioStep1ErrorResponse
      >
    >
  > {
    const params = {
      idActivity: 'sigup.mobile.doi.step1',
      channel: 'phonegap',
      _documentNumber: documentNumber,
      _captcha: captcha,
      _selfie: selfie,
      _selfieTemplate: selfieTemplate,
      _doiOCRToken: doiOCRToken,
      _doiFaceToken: doiFaceToken,
    };
    return Request.post('signup.step1.doi', params);
  }

  static async mobileBioFinish(
    newPin: string,
    newPinConfirmation: string,
    exchangeToken: string,
    acceptConditions: boolean,
    _keyboardToken?: string
  ): Promise<
    Response<
      ResponseTransactionBody<
        MobileStepFinishResponse | MobileStepFinishErrorResponse
      >
    >
  > {
    const params = {
      idActivity: 'signup.mobile.doi.finish',
      _acceptConditions: acceptConditions,
      _exchangeToken: exchangeToken,
      _positionsNewPin: newPin,
      _positionsNewPinConfirmation: newPinConfirmation,
      _keyboardToken,
    };

    return Request.post('signup', params);
  }
}
