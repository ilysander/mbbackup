export default class Emitter {
  static on<T>(_action: string, _callback: (event: T) => void) {
    return true;
  }

  static off<T>(_action: string, _callback: (event: T) => void) {
    return true;
  }

  static emit<T>(_action: string, _data?: T) {
    return true;
  }
}
