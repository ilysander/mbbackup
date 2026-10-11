export default class CodeError extends Error {
  name: string = 'CodeError';
  tag: string;
  method: string;
  code?: string;

  constructor(tag: string, method: string, e: any) {
    super(e.message || '');
    this.tag = tag;
    this.method = method;
    this.message = e.message;
    this.code = e.code;
    this.stack = e.stack;
  }

  toString() {
    return `[${this.name}] | ${this.tag} - [${(
      this.method || ''
    ).toUpperCase()}:${this.code}] => ${this.message}`;
  }
}
