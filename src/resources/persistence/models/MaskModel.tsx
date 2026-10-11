export enum MaskType {
  DOCUMENT = 'DNI',
  CARDNUMBER = 'CARDNUMBER',
}

export class MaskModel {
  public static schema: Realm.ObjectSchema = {
    name: 'Card',
    properties: {
      value: { type: 'string', optional: true },
      mask: { type: 'string', optional: true },
      /**
       * aqui se debio poner como default `MaskType.CARDNUMBER`
       * para hacer que los que ya tenian la versión anterior puedan ver su documento recordado
       */
      type: { type: 'string', optional: true },
    },
  };

  // public static init(value?: string, mask?: string, type?: MaskType) {
  //   const card = new MaskModel();
  //   card.value = value;
  //   card.mask = mask;
  //   card.type = type;
  //   return card;
  // }

  public value?: string;
  public mask?: string;
  public type?: MaskType;
}

export class MaskObj {
  public static init(value?: string, mask?: string, type?: MaskType) {
    const card = new MaskObj();
    card.value = value;
    card.mask = mask;
    card.type = type;
    return card;
  }

  public value?: string;
  public mask?: string;
  public type?: MaskType;
}
