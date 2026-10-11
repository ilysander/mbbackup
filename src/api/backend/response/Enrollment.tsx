export interface SecuritySealsListResponse {
  securitySeals: SecuritySeals;
}

interface SecuritySeals {
  [id: string]: string;
}

export interface MobileStep1Response {}

export interface MobileStep2Response {
  _exchangeToken: string;
}

export interface MobileStepFinishResponse {}
export interface ListDevicesResponse {}

export interface EnrolledDevice {
  currentDevice: number;
  deviceBrand: string;
  deviceId: string;
  deviceModel: string;
  deviceStatus: number;
  enrollmentId: string;
  enrollmentStatus: number;
  physicalDeviceId: string;
  osVersion: string;
  deviceVersion: string;
  appVersion: string;
}

export interface DeviceToUnroll {
  deviceId: string;
  physicalDeviceId: string;
  deviceVersion: string;
  deviceModel: string;
  deviceBrand: string;
  osVersion: string;
  appVersion: string;
  enrollmentId: string;
}

export interface UnrollDeviceResponse {}

export interface ValidateDeviceResponse {
  response: response;
}
interface response {
  code: number;
  availableSlots: number;
  message: string;
}
