export default class RequestError extends Error {
  name: string = 'RequestError';
  tag: string;
  method: string;
  code?: number | string;

  constructor(tag: string, method: string, message: any, code = 1000) {
    super(message);
    this.tag = tag;
    this.method = method;
    this.message =
      typeof message !== 'string' ? JSON.stringify(message) : message;
    this.code = code;
  }

  toString() {
    return `[${this.name}] | ${this.tag}: [${this.method}] => ${this.message}`;
  }
}
