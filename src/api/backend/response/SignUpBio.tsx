export interface MobileBioStep1Response {
  _exchangeToken: string;
}
export interface MobileBioStep1ErrorResponse {
  _documentNumber: string | null;
  code: string | null;
  NO_FIELD: string | null;
}
export interface MobileStep2Response {
  _exchangeToken: string;
}
export interface MobileStep2ErrorResponse {
  _exchangeToken: string | null;
  _validationCode: string | null;
  _debitcardPin: string | null;
}
export interface MobileStepFinishResponse {
  _exchangeToken: string | null;
  _debitcardNumber: string | null;
  _newPin: string | null;
  _acceptConditions: boolean;
}
export interface MobileStepFinishErrorResponse {
  _exchangeToken: string | null;
  acceptConditions: string | null;
  _newPin: string | null;
}
