import { Platform } from 'react-native';
import { Response } from '../../api/util/Request';
import Currencies, { Currency } from '../constants/Currencies';
import { L } from '../language';
import { Log } from '../log';
import { CompanyService, Company } from '../../api/backend/response/Execute';
import Config from '../../Config';

const TAG = '[Sanitizer]';
export default class Sanitizer {
  static firstCase(value: any): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  static getProductItemLabels(item: any): any {
    let { shortLabel, category, productType } = item;

    category = typeof category === 'string' ? category.toUpperCase() : '';
    productType =
      typeof productType === 'string' ? productType.toUpperCase() : '';
    shortLabel = typeof shortLabel === 'string' ? shortLabel : '';

    return {
      category,
      productType,
      shortLabel,
    };
  }

  static getProductTitle(item: any) {
    const { category, shortLabel, productType } = this.getProductItemLabels(
      item
    );
    const productTypeUpper = productType.toUpperCase();
    const categoryUpper = category.toUpperCase();
    if (productTypeUpper === 'DPF') {
      return L.accountitem_title_dpf;
    }
    if (categoryUpper.startsWith('CTS')) {
      return L.accountitem_title_cts;
    }
    if (categoryUpper.startsWith('CCE')) {
      return L.accountitem_title_cc;
    }
    if (categoryUpper.startsWith('CC')) {
      return L.accountitem_title_cch;
    }
    return this.cleanProductLabel(shortLabel, item);
  }

  static getProductName(item: any): string {
    const { category, shortLabel, productType } = this.getProductItemLabels(
      item
    );

    if (productType === 'DPF') {
      return L.maintenancescreen_type_account_dpf;
    }
    if (category.startsWith('CTS')) {
      return L.maintenancescreen_type_account_cts;
    }
    if (category.startsWith('CCE')) {
      return L.maintenancescreen_type_account_cc;
    }
    if (category.startsWith('CC')) {
      return L.maintenancescreen_type_account_cch;
    }
    return this.cleanProductLabel(shortLabel, item);
  }

  static cleanProductLabel(shortLabel: string, item: any): string {
    return shortLabel
      .replace(` ${item.number}`, '')
      .replace(` ${item.description}`, '')
      .replace(` ${item.loanNumber}`, '');
  }

  static titleCase(name?: string): string {
    return (name || '')
      .replace(/\t/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map(word => (word[0] || '').toUpperCase() + word.substr(1).toLowerCase())
      .join(' ')
      .trim();
  }

  static uniqueArray(array: any[], response: Response<any>, key = 'id') {
    const uniqIds: any = {};
    const filteredArray = array.filter(
      obj => !uniqIds[obj[key]] && (uniqIds[obj[key]] = true)
    );
    if (response && array.length !== filteredArray.length) {
      Log.exception(TAG, 'duplicatedData', response.body.idTransaction);
    }
    return filteredArray;
  }

  static getCurrencyByLabel(label: string) {
    const index = Object.keys(Currencies).find(
      key => (Currencies as any)[key].label.toString() === label.toString()
    );
    if (!index) {
      return;
    }
    return (Currencies as any)[index] as Currency;
  }

  static formatTextCCI = (cci: string): string => {
    return cci
      ? cci.replace(/\b(\d{3})(\d{3})(\d{12})(\d{2})\b/, '$1 $2 $3 $4')
      : '';
  };

  static getAccountFormattedFromLabel = (
    label: string,
    value: string
  ): string => {
    return label ? label.replace(` ${value}`, ` - ${value}`) : '';
  };
  static getAccountEmptyFromLabel = (label: string, value: string): string => {
    return label ? label.replace(` ${value}`, ``) : '';
  };

  static maskPhone = (value: string, mask: string = '') => {
    if (!mask) {
      mask = Platform.OS === 'android' ? '•' : '●';
    }
    if (!!value && !value.includes('*')) {
      if (value.length === 9) {
        return value.substr(0, 2) + mask.repeat(5) + value.substr(7, 9);
      }
    }
    if (value.includes('*')) {
      return value.split('*').join(mask);
    }
    return value.replace(/\*/g, mask);
  };

  static getName(item: CompanyService | Company): string {
    const { name = '' } = item;
    return name;
  }

  static maskEmail = (email: string, mask: string = '') => {
    if (!email) return email;
    if (!mask) {
      mask = Platform.OS === 'android' ? '•' : '●';
    }
    if (email.includes('*')) {
      return email.split('*').join(mask);
    }
    const emailValues = email.split('@');
    if (emailValues.length < 2) {
      return emailValues[0];
    }
    const value = emailValues[0];
    if (value.includes('*')) {
      return value.split('*').join(mask) + '@' + emailValues[1];
    }
    const masked = value.length > 3 ? mask.repeat(value.length - 3) : '';
    return value.slice(0, 3) + masked + '@' + emailValues[1];
  };
  /**
   * Formatea del formato "04:00 - 23:50"
   * al formato "04:00 a.m. a 11:50 p.m."
   */
  static formatSchedule = (
    schedule: string | undefined,
    validate: boolean = true
  ) => {
    if (!schedule) {
      return '';
    }

    const arrayTimes = schedule.split('-');
    if (arrayTimes.length != 2) {
      Log.warn(TAG, 'formatSchedule', 'no se pudo convertir:' + schedule);
      return schedule;
    }

    if (validate) {
      // validar que el inicio sea mayor o igual que el de mibanco
      const timeInit = (Config.settings.startTimePaymentsServices || '').trim();
      if (arrayTimes[0].trim() < timeInit) {
        arrayTimes[0] = timeInit;
      }
      // validar que el final sea antes o igual que el de mibanco
      const timeEnd = (Config.settings.endTimePaymentsServices || '').trim();
      if (timeEnd < arrayTimes[1].trim()) {
        arrayTimes[1] = timeEnd;
      }
      // validar que el mayor obtenido sea realmente mayor que el menor obtenido
      if (arrayTimes[0].trim() >= arrayTimes[1]) {
        return '';
      }
    }

    const arrayNewTimes = arrayTimes.map(time => {
      const newTime = time.trim();
      return Sanitizer.time24To12(newTime);
    });

    return arrayNewTimes.join(' a ');
  };

  static time24To12 = (time24: string, separator: string = ':') => {
    const arrayTime = time24.split(separator);
    if (arrayTime.length < 2) {
      Log.warn(TAG, 'time24To12', 'no se pudo convertir:' + time24);
      return time24;
    }
    let hours = parseInt(arrayTime[0]);
    const minutes = arrayTime[1];
    let meridiem = 'a.m.';
    let newHours = '';
    if (hours > 12) {
      hours -= 12;
      meridiem = 'p.m.';
    }
    hours < 10 ? (newHours = '0' + hours) : (newHours = '' + hours);
    return newHours + separator + minutes + ' ' + meridiem;
  };

  static safeText = (val: string, dictionary: string[]) => {
    if (!val) {
      return '';
    }

    if (!Config.features.KeyboardByApi) {
      return val;
    }

    const textArray = [];
    for (const char of val) {
      textArray.push(dictionary.findIndex(value => value + '' == char));
    }

    return textArray.join('');
  };

  static formatPhrase(
    number: number,
    basicPhrase: string,
    pluralPhrase: string
  ) {
    let phrase = basicPhrase;
    if (number > 1) {
      phrase = pluralPhrase;
    }
    return phrase;
  }
}
