export default class EmailStatusModel {
  public static schema: Realm.ObjectSchema = {
    name: 'EmailStatus',
    primaryKey: 'id',
    properties: {
      id: { type: 'string' },
      value: { type: 'string' },
    },
  };

  // public static init(id: string, value: string) {
  //   const emailStatus = new EmailStatusModel();
  //   emailStatus.id = id;
  //   emailStatus.value = value;
  //   return emailStatus;
  // }

  public id!: string;
  public value!: string;
}

export class EmailStatusObj {
  public static init(id: string, value: string) {
    const emailStatus = new EmailStatusObj();
    emailStatus.id = id;
    emailStatus.value = value;
    return emailStatus;
  }

  public id!: string;
  public value!: string;
}
