export class CacheModel {
  public static schema: Realm.ObjectSchema = {
    name: 'Cache',
    primaryKey: 'key',
    properties: {
      key: { type: 'string', indexed: true, optional: false },
      value: { type: 'string', optional: true },
    },
  };

  // public static init(key: string, value?: string) {
  //   const cache = new CacheModel();
  //   cache.key = key;
  //   cache.value = value;
  //   return cache;
  // }

  public key!: string;
  public value?: string;

  // clone() {
  //   const cache = new CacheModel();
  //   cache.value = this.value;
  //   cache.key = this.key;
  //   return cache;
  // }
}

export class CacheObj {
  public static init(key: string, value?: string) {
    const cache = new CacheObj();
    cache.key = key;
    cache.value = value;
    return cache;
  }

  public static cloneByModel(oldData: { key: string; value: string }) {
    const cache = new CacheObj();
    cache.value = oldData.value;
    cache.key = oldData.key;
    return cache;
  }

  public key!: string;
  public value?: string;
}
