import Request, { Response, ResponseBody } from '../util/Request';
import {
  MobileStep1Response,
  MobileStep2Response,
  MobileStepFinishResponse,
  SecuritySealsListResponse,
  ListDevicesResponse,
  UnrollDeviceResponse,
  ValidateDeviceResponse,
} from './response/Enrollment';
import Session from '../Session';
import { DefaultErrorResponse } from './response/Error';

export default class Enrollment {
  static async securitySealsList(
    exchangeToken: string,
    inLogin: boolean
  ): Promise<Response<ResponseBody<SecuritySealsListResponse>>> {
    const params = {
      channel: 'phonegap',
      idActivity: 'enrollment.securitySeals.list',
      _exchangeToken: exchangeToken,
      inLogin: inLogin.toString(),
    };

    return Request.post('enrollment', params);
  }

  static async mobileStep1(
    debitcardNumber: string,
    debitcardPin: string
  ): Promise<
    Response<ResponseBody<MobileStep1Response | DefaultErrorResponse>>
  > {
    const params = {
      channel: 'phonegap',
      idActivity: 'enrollment.mobile.step1',
      _debitcardNumber: debitcardNumber,
      _debitcardPin: debitcardPin,
    };

    return Request.post('enrollment', params);
  }

  static async mobileStep2(
    debitcardNumber: string,
    validationCode: string
  ): Promise<
    Response<ResponseBody<MobileStep2Response | DefaultErrorResponse>>
  > {
    const params = {
      channel: 'phonegap',
      idActivity: 'enrollment.mobile.step2',
      _debitcardNumber: debitcardNumber,
      _validationCode: validationCode,
    };

    return Request.post('enrollment', params);
  }

  static async mobileFinish(
    debitcardNumber: string,
    newPin: string,
    newPinConfirmation: string,
    exchangeToken: string,
    acceptConditions: boolean
  ): Promise<
    Response<ResponseBody<MobileStepFinishResponse | DefaultErrorResponse>>
  > {
    const params = {
      channel: 'phonegap',
      idActivity: 'enrollment.mobile.finish',
      _debitcardNumber: debitcardNumber,
      _newPin: newPin,
      _newPinConfirmation: newPinConfirmation,
      _exchangeToken: exchangeToken,
      acceptConditions: acceptConditions.toString(),
    };

    return Request.post('enrollment', params);
  }
  static async listDevices(
    deviceInfo: {
      deviceId: string;
      physicalDeviceId: string;
      deviceVersion: string;
      deviceModel: string;
      deviceBrand: string;
      osVersion: any;
      appVersion: any;
    },
    userInfo: {
      documentType: string;
      documentNumber: string;
    },
    deviceDate: string
  ): Promise<Response<ResponseBody<ListDevicesResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      deviceInfo: deviceInfo,
      userInfo: userInfo,
      deviceDate: deviceDate,
    };
    return Request.post(
      'customer-managment/access-management/v1/list',
      params,
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async unrollDevice(
    idTransaction: string,
    deviceInfo: {
      physicalDeviceId: string;
      deviceVersion: string;
      deviceModel: string;
      deviceBrand: string;
      osVersion: string;
      appVersion: string;
      enrollmentId: string;
    },
    userInfo: {
      documentType: string;
      documentNumber: string;
    },
    deviceDate: string
  ): Promise<Response<ResponseBody<UnrollDeviceResponse>>> {
    const authorization = Session.getAccessToken();
    if (!authorization) {
      throw new Error('not active session');
    }
    const params = {
      accessInfo: {
        channel: 'phonegap',
        transactionId: idTransaction,
      },
      deviceInfo: deviceInfo,
      userInfo: userInfo,
      deviceDate: deviceDate,
    };

    return Request.post(
      'customer-managment/access-management/v1/perform-unwinding',
      params,
      {
        headers: {
          authorization,
        },
      }
    );
  }

  static async validateDevice(
    deviceInfo: {
      deviceImei: string;
      deviceVersion: string;
      deviceModel: string;
      deviceBrand: string;
      osVersion: string;
      appVersion: string;
    },
    deviceDate: string
  ): Promise<Response<ResponseBody<ValidateDeviceResponse>>> {
    const params = {
      channel: 'phonegap',
      idActivity: 'enrollment.listEnrollDevices.validateDevice',
      _deviceinfo: deviceInfo,
      _deviceDate: deviceDate,
    };

    return Request.post('enrollment', params);
  }
}
