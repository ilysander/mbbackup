import { ContentCreditLine } from '../../../api/backend/response/Execute';
import Config from '../../../Config';

const moment = require('moment');

export enum AdStatus {
  Active = 1,
  Inactive = 0,
}

export enum AdType {
  NoDefined = 0,
  CreditLinePreApproved = 1,
  CreditLineApproved = 2,
}

export class AdModel {
  public static schema: Realm.ObjectSchema = {
    name: 'Ad',
    primaryKey: 'id',
    properties: {
      id: {
        type: 'string',
        default: moment()
          .unix()
          .toString(),
      },
      counter: { type: 'int', default: 0 },
      counterLimit: { type: 'int', default: 0 },
      dateRenew: { type: 'date' },
      timeoutRenew: {
        type: 'int',
        default: 60 * 24,
      },
      payload: { type: 'string', optional: true },
      dateCreated: { type: 'date', default: new Date() },
    },
  };

  // public static getIdByCreditLine(content: ContentCreditLine) {
  //   const { avaiCredLAmountWithoutTax, requestNumber, currencyKey } = content;
  //   const id = `${avaiCredLAmountWithoutTax}_${requestNumber}_${currencyKey.toString()}`;
  //   return id;
  // }
  // public static initByCreditLine(content: ContentCreditLine) {
  //   const ad = this.init();
  //   ad.id = this.getIdByCreditLine(content);
  //   ad.payload = JSON.stringify(content);
  //   ad.setDefaults();
  //   ad.renew();
  //   return ad;
  // }

  // public static init() {
  //   const ad = new AdModel();
  //   return ad;
  // }

  // public static cloneByOther(other: AdModel) {
  //   const ad = new AdModel();
  //   ad.id = other.id;
  //   ad.counter = other.counter;
  //   ad.dateRenew = other.dateRenew;
  //   ad.payload = other.payload;
  //   return ad;
  // }

  public id!: string;
  public dateRenew!: Date;
  public timeoutRenew!: number;
  public counter!: number;
  public counterLimit!: number;
  public payload!: string;

  // clone() {
  //   const ad = new AdModel();
  //   ad.id = this.id;
  //   ad.counter = this.counter;
  //   ad.dateRenew = this.dateRenew;
  //   ad.payload = this.payload;
  //   return ad;
  // }

  // setDefaults() {
  //   this.timeoutRenew = Config.settings.timeoutResetAd;
  //   /**
  //    * eso tal vez pueda venir de config
  //    */
  //   this.counterLimit = 3;
  // }

  // allowShow() {
  //   if (this.counterLimit < 1) {
  //     return true;
  //   }
  //   return this.counter < this.counterLimit;
  // }

  // shouldReset() {
  //   const today = new Date();
  //   return this.dateRenew <= today;
  // }

  // /**
  //  * @requires `AppStorage.write(cb)`
  //  */
  // renew() {
  //   this.dateRenew = moment()
  //     .add(this.timeoutRenew, 'minutes')
  //     .toDate();
  // }

  // /**
  //  * @requires `AppStorage.write(cb)`
  //  */
  // reset() {
  //   this.counter = 0;
  //   this.renew();
  // }

  // /**
  //  * @requires `AppStorage.write(cb)`
  //  */
  // count() {
  //   this.counter++;
  //   // const allow = this.allowShow();
  //   const allow = this.counterLimit < 1 ? true : this.counter < this.counterLimit;
  //   if (!allow) {
  //     // this.renew();
  //     this.dateRenew = moment()
  //       .add(this.timeoutRenew, 'minutes')
  //       .toDate();
  //   }
  // }
}

export class AdObj {
  public static init() {
    const id: string = moment()
      .unix()
      .toString();
    const ad = new AdObj();
    ad.id = id;
    ad.setDefaults();
    return ad;
  }
  public static getIdByCreditLine(content: ContentCreditLine) {
    const { avaiCredLAmountWithoutTax, requestNumber, currencyKey } = content;
    const id = `${avaiCredLAmountWithoutTax}_${requestNumber}_${currencyKey.toString()}`;
    return id;
  }
  public static initByCreditLine(content: ContentCreditLine) {
    const ad = this.init();
    ad.id = this.getIdByCreditLine(content);
    ad.payload = JSON.stringify(content);
    // ad.setDefaults();
    // ad.renew();
    ad.dateRenew = moment()
      .add(ad.timeoutRenew, 'minutes')
      .toDate();
    return ad;
  }
  public static cloneByModel(olddata: {
    id: string;
    dateRenew: Date;
    timeoutRenew: number;
    counter: number;
    counterLimit: number;
    payload: string;
  }) {
    const ad = new AdObj();
    ad.id = olddata.id;
    ad.counter = olddata.counter;
    ad.dateRenew = olddata.dateRenew;
    ad.counter = olddata.counter;
    ad.counterLimit = olddata.counterLimit;
    ad.payload = olddata.payload;
    return ad;
  }
  public id!: string;
  public dateRenew!: Date;
  public timeoutRenew!: number;
  public counter!: number;
  public counterLimit!: number;
  public payload!: string;

  setDefaults() {
    this.timeoutRenew = Config.settings.timeoutResetAd;
    /**
     * eso tal vez pueda venir de config
     */
    this.counterLimit = 3;
  }

  allowShow() {
    if (this.counterLimit < 1) {
      return true;
    }
    return this.counter < this.counterLimit;
  }

  shouldReset() {
    const today = new Date();
    return this.dateRenew <= today;
  }

  // /**
  //  * @requires `AppStorage.write(cb)`
  //  */ 
  // private renew() {
  //   this.dateRenew = moment()
  //     .add(this.timeoutRenew, 'minutes')
  //     .toDate();
  // }

  // /**
  //  * @requires `AppStorage.write(cb)`
  //  */
  // reset() {
  //   this.counter = 0;
  //   this.renew();
  // }

  // /**
  //  * @requires `AppStorage.write(cb)`
  //  */
  // count() {
  //   // AdService.createOrUpdate()
  //   this.counter++;
  //   const allow = this.allowShow();
  //   if (!allow) {
  //     this.renew();
  //   }
  // }
}

// export default {
//   AdModel,
//   AdObj,
// };
