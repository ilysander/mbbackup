export default class RSA {
  static decryptOAEP(message, label, hashName, pkcs12, passphrase) {
    return 'sample';
  }
  static decryptPKCS1v15(message, pkcs12, passphrase) {
    return 'sample';
  }
  static encryptOAEP(message, label, hashName, pkcs12, passphrase) {
    return 'sample';
  }
  static encryptPKCS1v15(message, pkcs12, passphrase) {
    return 'sample';
  }
  static signPSS(message, hashName, pkcs12, passphrase) {
    return 'sample';
  }
  static signPKCS1v15(message, hashName, pkcs12, passphrase) {
    return 'sample';
  }
  static verifyPSS(signature, message, hashName, pkcs12, passphrase) {
    return true;
  }
  static verifyPKCS1v15(signature, message, hashName, pkcs12, passphrase) {
    return true;
  }
  static hash(message, name) {
    return 'sample';
  }
  static base64(message) {
    return 'sample';
  }
  static generate(bits) {
    return {
      publicKey: 'sample',
      privateKey: 'sample',
    };
  }
}
