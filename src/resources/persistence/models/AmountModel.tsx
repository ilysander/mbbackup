export enum CurrencyType {
  PEN = '1',
  USD = '2',
}

export default class AmountModel {
  public static schema: Realm.ObjectSchema = {
    name: 'Amount',
    properties: {
      value: { type: 'float' },
      currency: { type: 'string' },
    },
  };

  // public static init(value: number, currency: CurrencyType) {
  //   const amount = new AmountModel();
  //   amount.value = value;
  //   amount.currency = currency;

  //   return amount;
  // }

  public value!: number;
  public currency!: CurrencyType;

  // clone() {
  //   const amount = new AmountModel();
  //   amount.value = this.value;
  //   amount.currency = this.currency;
  //   return amount;
  // }
}
