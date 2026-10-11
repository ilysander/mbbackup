export default class SMSListener {
  static addListener(callback) {
    return {
      remove: () => {
        return callback;
      }
    };
  }
}
