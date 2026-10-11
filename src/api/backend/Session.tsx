import SessionApp from '../Session';
import Request, {
  Response,
  ResponseBody,
  ResponseTransactionBody,
} from '../util/Request';
import { DefaultErrorResponse } from './response/Error';
import {
  AcceptGeneralConditionsResponse,
  GetResponse,
  LoginWithSecondFactorAndPasswordStep1MobileResponse,
  LoginWithSecondFactorAndPasswordStep2MobileResponse,
  PutResponse,
  RecoverPinMobileFinishResponse,
  RecoverPinMobileStep1Response,
  RecoverPinMobileStep2Response,
  SelectEnvironmentResponse,
  EnrollmentUpdateDeviceByBioResponse,
} from './response/Session';
import Config from '../../Config';

export default class Session {
  static async recoverPinMobileStep1(
    debitcardNumber: string,
    debitcardPin: string
  ): Promise<
    Response<ResponseBody<RecoverPinMobileStep1Response | DefaultErrorResponse>>
  > {
    const params = {
      channel: 'phonegap',
      idActivity: 'session.recoverPin.mobile.step1',
      _debitcardNumber: debitcardNumber,
      _debitcardPin: debitcardPin,
    };

    return Request.post('session', params);
  }

  static async recoverPinMobileStep2(
    debitcardNumber: string,
    validationCode: string
  ): Promise<
    Response<ResponseBody<RecoverPinMobileStep2Response | DefaultErrorResponse>>
  > {
    const params = {
      channel: 'phonegap',
      idActivity: 'session.recoverPin.mobile.step2',
      _debitcardNumber: debitcardNumber,
      _validationCode: validationCode,
    };

    return Request.post('session', params);
  }

  static async recoverPinMobileFinish(
    debitcardNumber: string,
    newPin: string,
    newPinConfirmation: string,
    exchangeToken: string
  ): Promise<Response<ResponseBody<RecoverPinMobileFinishResponse>>> {
    const params = {
      channel: 'phonegap',
      idActivity: 'session.recoverPin.mobile.finish',
      _debitcardNumber: debitcardNumber,
      _newPin: newPin,
      _newPinConfirmation: newPinConfirmation,
      _exchangeToken: exchangeToken,
    };

    return Request.post('session', params);
  }

  static async loginWithSecondFactorAndPasswordStep1Mobile(
    username: string,
    secondFactor: string,
    _documentNumber: string,
    _captcha: string,
    _keyboardToken: string
  ): Promise<
    Response<
      ResponseTransactionBody<
        LoginWithSecondFactorAndPasswordStep1MobileResponse
      >
    >
  > {
    const params = Config.features.KeyboardByApi
      ? {
          idActivity: 'session.loginWithSecondFactorAndPassword.step1mobile',
          channel: 'phonegap',
          _username: username,
          _documentNumber,
          _keyboardToken,
          _positionsSecondFactor: secondFactor,
          _captcha,
        }
      : {
          idActivity: 'session.loginWithSecondFactorAndPassword.step1mobile',
          channel: 'phonegap',
          _username: username,
          _documentNumber,
          _keyboardToken,
          _secondFactor: secondFactor,
          _captcha,
        };
    return Request.post('session', params, {
      requireValidation: true,
    });
  }

  static async loginWithSecondFactorAndPasswordStepDNI1Mobile(
    username: string,
    secondFactor: string,
    _documentNumber: string,
    _captcha: string,
    _keyboardToken: string
  ): Promise<
    Response<
      ResponseTransactionBody<
        LoginWithSecondFactorAndPasswordStep1MobileResponse
      >
    >
  > {
    const params = {
      channel: 'phonegap',
      idActivity: 'session.loginWithDOI.step1mobile',
      _username: username,
      _documentNumber,
      _captcha,
      _keyboardToken,
      _positionsSecondFactor: secondFactor,
    };
    return Request.post('session', params);
  }

  static async loginWithSecondFactorAndPasswordStepDNI1EnrollmentMobile(
    username: string,
    secondFactor: string,
    _captcha: string,
    _keyboardToken: string,
    deviceInfo: {
      deviceId: string;
      physicalDeviceId: string;
      deviceVersion: string;
      deviceModel: string;
      deviceBrand: string;
      osVersion: string;
      appVersion: string;
    },
    userInfo: {
      documentType: string;
      documentNumber: string;
    },
    deviceDate: string
  ): Promise<
    Response<
      ResponseTransactionBody<
        LoginWithSecondFactorAndPasswordStep1MobileResponse
      >
    >
  > {
    const params = {
      channel: 'phonegap',
      deviceInfo,
      userInfo,
      deviceDate,
      _username: username,
      _captcha,
      _keyboardToken,
      _positionsSecondFactor: secondFactor,
    };
    return Request.post('it-management/otp-management/v1/validations', params);
  }

  static async loginWithSecondFactorAndPasswordStepDNI1EnrollmentMobileDemoOK(
    username: string,
    secondFactor: string,
    _captcha: string,
    _keyboardToken: string,
    deviceInfo: {
      deviceId: string;
      physicalDeviceId: string;
      deviceVersion: string;
      deviceModel: string;
      deviceBrand: string;
      osVersion: string;
      appVersion: string;
    },
    userInfo: {
      documentType: string;
      documentNumber: string;
    },
    deviceDate: string
  ): Promise<
    Response<
      ResponseTransactionBody<
        LoginWithSecondFactorAndPasswordStep1MobileResponse
      >
    >
  > {
    const params = {
      channel: 'phonegap',
      deviceInfo,
      userInfo,
      deviceDate,
      _username: username,
      _captcha,
      _keyboardToken,
      _positionsSecondFactor: secondFactor,
    };
    return Request.post(
      'it-management/otp-management/v1/validationsDemoOk',
      params
    );
  }

  static async loginWithSecondFactorAndPasswordStepDNI2Mobile(
    deviceInfo: {
      deviceId: string;
      physicalDeviceId: string;
      deviceVersion: string;
      deviceModel: string;
      deviceBrand: string;
      osVersion: string;
      appVersion: string;
    },
    userInfo: {
      documentType: string;
      documentNumber: string;
    },
    accessInfo: {
      otpCode: string;
    },
    deviceDate: string
  ): Promise<
    Response<ResponseBody<LoginWithSecondFactorAndPasswordStep1MobileResponse>>
  > {
    const params = {
      channel: 'phonegap',
      deviceInfo,
      userInfo,
      deviceDate,
      accessInfo,
    };
    return Request.post(
      'customer-managment/access-management/v1/perform-winding',
      params
    );
  }

  static async loginWithSecondFactorAndPasswordStep2Mobile(
    exchangeToken: string,
    securitySeal: string
  ): Promise<
    Response<
      ResponseTransactionBody<
        LoginWithSecondFactorAndPasswordStep2MobileResponse
      >
    >
  > {
    const params = {
      idActivity: 'session.loginWithSecondFactorAndPassword.step2mobile',
      _exchangeToken: exchangeToken,
      _securitySeal: securitySeal,
    };

    return Request.post('session', params, {
      requireValidation: true,
    });
  }

  static async selectEnvironment(
    exchangeToken: string,
    environment: string
  ): Promise<Response<ResponseBody<SelectEnvironmentResponse>>> {
    const params = {
      idActivity: 'session.selectEnvironment',
      _exchangeToken: exchangeToken,
      environment,
    };

    return Request.post('session', params, {
      requireValidation: true,
    });
  }

  static async acceptGeneralConditions(
    exchangeToken: string,
    acceptConditions: boolean
  ): Promise<Response<ResponseBody<AcceptGeneralConditionsResponse>>> {
    const params = {
      idActivity: 'session.acceptGeneralConditions',
      _exchangeToken: exchangeToken,
      acceptConditions: acceptConditions.toString(),
    };

    return Request.post('session', params, {
      requireValidation: true,
    });
  }

  static async enrollmentUpdateDeviceByBio(
    idTransaction: string,
    deviceInfo: {
      physicalDeviceId: string;
      deviceVersion: string;
      deviceModel: string;
      deviceBrand: string;
      osVersion: string;
      appVersion: string;
    },
    documentNumber: string,
    deviceDate: string,
    _selfie: string,
    _selfieTemplate: string,
    _doiFaceToken: string,
    _doiOCRToken: string
  ): Promise<Response<ResponseBody<EnrollmentUpdateDeviceByBioResponse>>> {
    const params = {
      userInfo: {
        documentNumber: documentNumber,
      },
      deviceInfo: deviceInfo,
      deviceDate,
      accessInfo: {
        transactionId: idTransaction,
        channel: 'phonegap',
      },
      _selfie,
      _selfieTemplate,
      _doiFaceToken,
      _doiOCRToken,
    };
    return Request.post('updatedevice', params);
  }

  static async updateEmailSendOTP(
    deviceInfo: {
      physicalDeviceId: string;
      deviceVersion: string;
      deviceModel: string;
      deviceBrand: string;
      osVersion: string;
      appVersion: string;
    },
    userInfo: {
      documentNumber: string;
    },
    deviceDate: string,
    requestEmail: {
      key: string;
      value: string;
    }
  ): Promise<Response<ResponseBody<any>>> {
    let params = {
      userInfo,
      deviceInfo,
      deviceDate,
      channel: 'phonegap',
      exchangeType: '2',
      accessInfo: {
        parameters: [requestEmail],
      },
    };

    const authorization = SessionApp.getAccessToken() || '';

    return Request.post('it-management/otp-management/v1/sendotp', params, {
      headers: {
        authorization,
      },
    });
  }

  static async get(): Promise<Response<ResponseBody<GetResponse>>> {
    const authorization = SessionApp.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }

    return Request.get(
      'session',
      {},
      {
        headers: {
          authorization,
        },
        skipRegisterActivity: true,
      }
    );
  }

  static async put(): Promise<Response<ResponseBody<PutResponse>>> {
    const authorization = SessionApp.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.put(
      'session',
      {},
      {
        headers: {
          authorization,
        },
        skipRegisterActivity: true,
      }
    );
  }

  static async delete(): Promise<Response<undefined>> {
    const authorization = SessionApp.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    return Request.delete(
      'session',
      {},
      {
        headers: {
          authorization,
        },
      }
    );
  }
}
