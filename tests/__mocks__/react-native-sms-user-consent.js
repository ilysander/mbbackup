export default class SMSUserConsent {
  static listenOTP() {
    return {
      receivedOtpMessage: 'tu OTP es 12345 para la transferencia',
    };
  }
  static removeOTPListener() {
    return;
  }
}
