export default class IdTransactionModel {
  public static schema: Realm.ObjectSchema = {
    name: 'IdTransaction',
    primaryKey: 'id',
    properties: {
      id: { type: 'string' },
      value: { type: 'string' },
    },
  };

  // public static init(id: string) {
  //   const onboarding = new IdTransactionModel();
  //   onboarding.id = id;
  //   onboarding.value = id;
  //   return onboarding;
  // }

  public id!: string;
  public value!: string;
}
