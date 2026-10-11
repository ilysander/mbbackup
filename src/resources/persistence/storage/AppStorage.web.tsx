export type SchemaType = string;

export default class AppStorage {
  static open() {
    return true;
  }

  static async create<T>(
    _schema: SchemaType,
    _object: T,
    _update: boolean = true
  ): Promise<T> {
    return null as any;
  }

  static async write<T>(_callback: () => T): Promise<T> {
    return null as any;
  }

  static async findOne<T>(_schema: SchemaType, _query: string): Promise<T> {
    return null as any;
  }

  static async find(_schema: SchemaType, _query: string): Promise<any> {
    return null as any;
  }

  static async findAll(_schema: SchemaType): Promise<any> {
    return null as any;
  }

  static async delete(_schema: SchemaType, _query: string): Promise<boolean> {
    return null as any;
  }
}
