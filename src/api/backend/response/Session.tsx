export interface RecoverPinMobileStep1Response {
  _mobileNumber: number;
}

export interface RecoverPinMobileStep2Response {
  _exchangeToken: string;
}

export interface RecoverPinMobileFinishResponse {}

export interface LoginWithSecondFactorAndPasswordStep1MobileResponse {
  _exchangeToken: string;
  lang: string;
  environment: number;
  hasSelectedSecuritySeal: boolean;
  _securitySeal: string;
  phoneNumber: string | null;
}

export interface EnrollmentUpdateDeviceByBioResponse {
  code: string;
  idTransaction: string;
  message: string;
}
export interface LoginWithSecondFactorAndPasswordStep2MobileResponse {
  _securitySeal: string | null;
  _exchangeToken: string;
  environments: EnvironmentsItem[];
}

interface EnvironmentsItem {
  idEnvironment: number;
  _name: string;
  status: Status;
  environmentType: string;
  typeDescription: string | null;
  deleted: boolean;
  parameters: string | null;
  smsEnabled: boolean;
  creationDate: string;
  capFrequency: string;
  administrationScheme: string;
  statusDescription: string | null;
  creationDateAsString: string;
}

interface Status {
  idEnvironmentStatus: string;
  description: string | null;
  canLogin: boolean;
}

export interface GetResponse {
  user: string;
  loginCredentials: string;
  environment: number;
  createdAt: Date;
  modifiedAt: Date;
  expiresAt: Date;
  expired: boolean;
  status: string;
  lang: string;
  ip: string;
  channel: string;
  userAgent: string;
}

export interface SelectEnvironmentResponse {
  _exchangeToken?: string;
  _accessToken: string;
  previousLoginInfo: PreviousLoginInfo;
  lang: string;
  username: string;
  _userFullName: string;
  _userNameOnly: string;
  _securitySeal: number;
  channel: string;
  activeIdEnvironment: number;
  _activeEnvironmentName: string;
  administrationScheme: string;
  environments: Environments;
  employee: string;
  environmentSegment: string;
  idOnboarding: number;
  permissions: Permissions;
  accountswhitread: number;
  forms: string[];
  frequentActions: number[];
  menuItemStatus: MenuItemStatus;
}

export interface AcceptGeneralConditionsResponse {
  _accessToken: string;
  previousLoginInfo: PreviousLoginInfo;
  lang: string;
  username: string;
  userFullName: string;
  userNameOnly: string;
  _securitySeal: number;
  channel: string;
  activeIdEnvironment: number;
  activeEnvironmentName: string;
  administrationScheme: string;
  environments: Environments;
  employee: string;
  environmentSegment: string;
  idOnboarding: number;
  permissions: Permissions;
  accountswhitread: number;
  forms: string[];
  frequentActions: number[];
  menuItemStatus: MenuItemStatus;
}

interface PreviousLoginInfo {
  idUser: string;
  date: string;
  ip: string;
  latitude: number;
  longitude: number;
  city: string | null;
  country: string | null;
}

interface Environments {
  [id: string]: Environment;
}

export interface Environment {
  segment: string;
  _name: string;
  type: string;
}

interface Permissions {
  hasPermissionOverDPF: boolean;
  transfer: boolean;
  hasPermissionOverTransferInterna: boolean;
  hasPermissionOverTransferInterbank: boolean;
  hasPermissionOvertransferThirdPartie: boolean;
  hasPermissionOverRequestLoan: boolean;
  preferences: boolean;
}

interface MenuItemStatus {
  menuAutomaticPayments: boolean;
  menuTransfer: boolean;
  menuEditMyData: boolean;
  menuDpf: boolean;
  menuLoanPayment: boolean;
  menuLoan: boolean;
}

export interface PutResponse {}
