import Request, { Response, ResponseTransactionBody } from '../util/Request';
import {
  MobileStep1Response,
  MobileStep1ErrorResponse,
  MobileStep2Response,
  MobileStep2ErrorResponse,
  MobileStepFinishResponse,
  MobileStepFinishErrorResponse,
} from './response/SignUp';
import Config from '../../Config';

export default class SignUp {
  static async mobileStep1(
    debitcardNumber: string,
    documentNumber: string,
    positionsDebitcardPin: string,
    keyboardToken: string,
    captcha: string
  ): Promise<
    Response<
      ResponseTransactionBody<MobileStep1Response | MobileStep1ErrorResponse>
    >
  > {
    const params = Config.features.KeyboardByApi
      ? {
          channel: 'phonegap',
          idActivity: 'signup.mobile.step1',
          _channel: 'phonegap',
          _debitcardNumber: debitcardNumber,
          _documentNumber: documentNumber,
          _positionsDebitcardPin: positionsDebitcardPin,
          _keyboardToken: keyboardToken,
          _captcha: captcha,
        }
      : {
          channel: 'phonegap',
          idActivity: 'signup.mobile.step1',
          _channel: 'phonegap',
          _debitcardNumber: debitcardNumber,
          _documentNumber: documentNumber,
          _debitcardPin: positionsDebitcardPin,
          _captcha: captcha,
        };

    return Request.post('signup', params, {
      requireValidation: true,
    });
  }

  static async mobileStep2(
    debitcardNumber: string,
    validationCode: string,
    exchangeToken: string
  ): Promise<
    Response<
      ResponseTransactionBody<MobileStep2Response | MobileStep2ErrorResponse>
    >
  > {
    const params = {
      channel: 'phonegap',
      idActivity: 'signup.mobile.step2',
      _debitcardNumber: debitcardNumber,
      _validationCode: validationCode,
      _exchangeToken: exchangeToken,
    };

    return Request.post('signup', params, {
      requireValidation: true,
    });
  }

  static async mobileStep1Old(
    debitcardNumber: string,
    documentNumber: string,
    captcha: string
  ): Promise<
    Response<
      ResponseTransactionBody<MobileStep1Response | MobileStep1ErrorResponse>
    >
  > {
    const params = {
      channel: 'phonegap',
      idActivity: 'signup.mobile.step1',
      _debitcardNumber: debitcardNumber,
      _documentNumber: documentNumber,
      _captcha: captcha,
    };

    return Request.post('signup', params, {
      requireValidation: true,
    });
  }

  static async mobileStep2Old(
    debitcardNumber: string,
    validationCode: string,
    debitcardPin: string,
    exchangeToken: string,
    _keyboardToken: string
  ): Promise<
    Response<
      ResponseTransactionBody<MobileStep2Response | MobileStep2ErrorResponse>
    >
  > {
    const params = Config.features.KeyboardByApi
      ? {
          channel: 'phonegap',
          idActivity: 'signup.mobile.step2',
          _debitcardNumber: debitcardNumber,
          _validationCode: validationCode,
          _exchangeToken: exchangeToken,
          _positionsDebitcardPin: debitcardPin,
          _keyboardToken,
        }
      : {
          channel: 'phonegap',
          idActivity: 'signup.mobile.step2',
          _debitcardNumber: debitcardNumber,
          _validationCode: validationCode,
          _exchangeToken: exchangeToken,
          _debitcardPin: debitcardPin,
        };

    return Request.post('signup', params, {
      requireValidation: true,
    });
  }

  static async mobileFinish(
    debitcardNumber: string,
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
    const params = Config.features.KeyboardByApi
      ? {
          channel: 'phonegap',
          idActivity: 'signup.mobile.finish',
          _debitcardNumber: debitcardNumber,
          _acceptConditions: acceptConditions,
          _positionsNewPin: newPin,
          _positionsNewPinConfirmation: newPinConfirmation,
          _exchangeToken: exchangeToken,
          _keyboardToken,
        }
      : {
          channel: 'phonegap',
          idActivity: 'signup.mobile.finish',
          _debitcardNumber: debitcardNumber,
          _acceptConditions: acceptConditions,
          _newPin: newPin,
          _newPinConfirmation: newPinConfirmation,
          _exchangeToken: exchangeToken,
        };

    return Request.post('signup', params, {
      requireValidation: true,
    });
  }
}
