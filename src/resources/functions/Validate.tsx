const moment = require('moment');
import DeviceInfo, { getVersion } from 'react-native-device-info';
import Config from '../../Config';

import LayoutAnimations from '../constants/LayoutAnimations';
import TypeValidateText from '../constants/TypeValidateText';
import Formats from '../constants/Formats';
import CreditLineOffer from '../constants/CreditLineOffer';
import { L } from '../language';
import Amount from '../money/Amount';
import { MaskType, MaskModel, MaskObj } from '../persistence/models/MaskModel';
import {
  InputValidation,
  LoansItem,
  LoansItemFeeComplete,
} from '../../api/backend/response/Execute';
import Features from '../../resources/remote/Features';
import Loan from '../constants/Loan';
import Session from '../../api/Session';
import SegmentType from '../constants/SegmentType';
import CacheService from '../persistence/CacheService';
export default class Validate {
  static isDefined(value: any) {
    return !!value;
  }

  static isLoanExpired(loan: LoansItem) {
    const today = moment({ h: 0, m: 0, s: 0, ms: 0 }).format();
    const isUnexpired = moment(today).isSameOrBefore(loan.nextFeeDueDate);
    return !isUnexpired;
  }

  static email(email: string) {
    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email.toString().toLowerCase());
  }

  static getTimeUTC() {
    return moment.utc();
  }

  static isBetweenHours(date: string, startTime: string, endTime: string) {
    const parsedDate = moment(date).utcOffset(Config.settings.countryTimezone);
    return moment(parsedDate.format('HH:mm:ss'), 'HH:mm:ss').isBetween(
      moment(startTime, 'HH:mm:ss'),
      moment(endTime, 'HH:mm:ss'),
      undefined,
      '[]'
    );
  }

  static isWorkingDay(date: string) {
    const parsedDate = moment(date).utcOffset(Config.settings.countryTimezone);
    return parsedDate.isoWeekday() !== 7 && parsedDate.isoWeekday() !== 6;
  }

  static splitFormat(value: string, format: string, keysplit: string) {
    const numbers = value.split(keysplit).join('');
    const groups = format.split(keysplit);
    const sizeGroups = groups.length;

    const numberFormatted: any = [];

    let valueInit = numbers;
    for (let i = 0; i < sizeGroups; i++) {
      if (valueInit.length > groups[i].length) {
        valueInit = this.addingGroupNumbers(
          numberFormatted,
          valueInit,
          groups,
          i
        );
      } else {
        numberFormatted.push(valueInit);
        break;
      }
    }
    return numberFormatted.join(keysplit);
  }

  static formattingText(value: string, formatText: any, clean = true) {
    if (!value || !formatText) {
      return value;
    }

    const { format, keysplit, pattern } = formatText;
    if (pattern && clean) {
      value = value.replace(new RegExp(pattern, 'g'), '');
    }

    if (!keysplit || !format) {
      return value;
    }

    return Validate.splitFormat(value, format, keysplit);
  }

  static isAllDefined(items: any[]) {
    let isValidAll = true;
    for (const item of items) {
      if (!this.isDefined(item)) {
        isValidAll = false;
        break;
      }
    }
    return isValidAll;
  }

  static addingGroupNumbers(
    numberFormatted: string[],
    valueInit: string,
    groups: string[],
    i: number
  ) {
    numberFormatted.push(valueInit.substring(0, groups[i].length));
    return valueInit.substring(groups[i].length);
  }

  static formattingTextNaked(value: string, formatText: any) {
    const keysplit = formatText.keysplit;
    return value.split(keysplit).join('');
  }

  static validateFormat(
    value: string,
    formatText: any,
    isRealTimeValidate?: boolean
  ) {
    let errorText = '';
    const format = formatText.format;
    const lawsValidate = formatText.validateList;

    LayoutAnimations.default();
    if (
      !lawsValidate ||
      (isRealTimeValidate && !formatText.isRealTimeValidateActive)
    ) {
      return errorText;
    }

    /* NOSONAR */
    for (const validateFormat of lawsValidate) {
      if (validateFormat.active) {
        if (isRealTimeValidate && !validateFormat.isRealTimeValidate) {
          continue;
        }
        errorText = this.validateFormatType(
          value,
          formatText,
          validateFormat,
          format
        );
        if (errorText !== '') {
          break;
        }
      }
    }

    return errorText;
  }

  static validateFormatType(
    value: string,
    formatText: any,
    validateFormat: any,
    format: boolean
  ) {
    let errorText = '';
    switch (validateFormat.type) {
      case TypeValidateText.TypeNotEmpty:
        errorText = this.validateFormatTypeNotEmpty(value, validateFormat);
        break;
      case TypeValidateText.TypeLength:
        errorText = this.validateFormatTypeLength(
          value,
          formatText,
          validateFormat,
          format
        );
        break;
      case TypeValidateText.StartWith:
        errorText = this.validateFormatTypeStartWith(
          value,
          formatText,
          validateFormat,
          format
        );
        break;
      case TypeValidateText.TypeFormat:
        break;
      case TypeValidateText.SecureFormat:
        errorText = this.validatingNumbers(value, validateFormat);
        break;
      case TypeValidateText.TypeFormatVisaCard:
        errorText = this.validVisaCard(value);
        break;
      case TypeValidateText.TypeFormatDocument:
        errorText = this.validDocumentFormat(value);
        break;
      case TypeValidateText.TypeFormatDni:
        errorText = this.validDniFormat(value);
        break;
      default:
        break;
    }
    return errorText;
  }

  static validDocumentFormat(value: string) {
    if (!/^[a-zA-Z0-9-]/.test(value)) {
      return L.document_validation_error_format;
    }
    if (!(8 <= value.length && value.length <= 16)) {
      return L.document_validation_error_length;
    }
    return '';
  }

  static validDniFormat(value: string) {
    if (!/^[a-zA-Z0-9-]/.test(value)) {
      return L.dni_validation_error_format;
    }
    if (!(8 <= value.length && value.length <= 16)) {
      return L.dni_validation_error_length;
    }
    return '';
  }

  static validVisaCard(value: string) {
    let errorText = '';
    if (!value.startsWith('4') || /[^0-9-\s]+/.test(value)) {
      errorText = L.error_format_internetkey_valid_visa_card;
      return errorText;
    }
    let nCheck = 0;
    let bEven = false;
    value = value.replace(/\D/g, '');
    for (let n = value.length - 1; n >= 0; n--) {
      const cDigit = value.charAt(n);
      let nDigit = parseInt(cDigit, 10);
      // tslint:disable-next-line:no-conditional-assignment
      if (bEven && (nDigit *= 2) > 9) {
        nDigit -= 9;
      }
      nCheck += nDigit;
      bEven = !bEven;
    }
    if (nCheck !== 0 && nCheck % 10 === 0) {
      return errorText;
    }
    errorText = L.error_format_internetkey_valid_visa_card;
    return errorText;
  }

  static validatingNumbers(value: string, validateFormat: any) {
    let errorText = '';
    for (let index = 0; index < value.length; index++) {
      if (index === value.length - 2) {
        return errorText;
      }
      const selectedString = value.substring(index, index + 3);
      const resultado = this.repeatedNumbers(selectedString);
      if (resultado) {
        errorText = validateFormat.msjError;
        return errorText;
      }
      if (this.consecutiveNumbers(selectedString)) {
        errorText = validateFormat.msjError;
        return errorText;
      }
    }
    return errorText;
  }

  static repeatedNumbers(value: string) {
    const valueAsArray = value.split('');
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < valueAsArray.length; index++) {
      const size = valueAsArray.filter(num => num === valueAsArray[index]);
      if (size.length >= 3) {
        return true;
      }
    }
    return false;
  }

  static consecutiveNumbers(value: string) {
    const selectedString = value.split('');
    if (
      parseInt(selectedString[0], 10) + 1 === parseInt(selectedString[1], 10) &&
      parseInt(selectedString[0], 10) + 2 === parseInt(selectedString[2], 10)
    ) {
      return true;
    }
    return false;
  }

  static validateFormatTypeNotEmpty(value: string, validateFormat: any) {
    if (!value) {
      return validateFormat.msjError;
    }
    if (value.trim() === '') {
      return validateFormat.msjError;
    }
    return '';
  }

  static validateFormatTypeLength(
    value: string,
    formatText: any,
    validateFormat: any,
    format: boolean
  ) {
    const errorText = '';
    if (!value) {
      return validateFormat.msjError;
    }
    let valueNaked = value;
    if (format) {
      valueNaked = valueNaked.split(formatText.keysplit).join('');
    }
    if (valueNaked.length !== validateFormat.value) {
      return validateFormat.msjError;
    }
    return errorText;
  }

  static validateFormatTypeStartWith(
    value: string,
    formatText: any,
    validateFormat: any,
    format: any
  ) {
    const errorText = '';
    if (!value) {
      return validateFormat.msjError;
    }
    let valueNaked = value;
    if (format) {
      valueNaked = valueNaked.split(formatText.keysplit).join('');
    }
    if (!valueNaked.startsWith(validateFormat.value)) {
      return validateFormat.msjError;
    }
    return errorText;
  }

  static createMasked(
    value: string,
    lastChars: number,
    type?: MaskType
  ): MaskModel {
    if (!value || value.length <= lastChars) {
      return MaskObj.init('', '', type);
    }
    const mask =
      '*'.repeat(value.length - lastChars) +
      value.substring(value.length - lastChars);
    return MaskObj.init(value, mask, type);
  }

  static formatAmount = (element: string | number, currency: string) => {
    let value;
    if (typeof element === 'number') {
      value = element;
    }

    if (typeof element === 'string') {
      const valueString = Amount.cleanUp(element);
      if (valueString) {
        value = Amount.parseFloat(valueString);
      }
    }

    const valueFormatted =
      typeof value !== 'undefined' ? Amount.format(value, currency) : '';
    const isEmpty = !value;

    return {
      isEmpty,
      valueFormatted,
    };
  };

  static async createId() {
    const stringId = await DeviceInfo.getUniqueId();
    const ids = [];
    let count = 0;

    for (const id of stringId.split('')) {
      count++;
      if (count <= 64) {
        ids.push(('' + id).charCodeAt(0));
      } else {
        break;
      }
    }

    for (let left = count; left < 64; left++) {
      ids.push('0'.charCodeAt(0));
    }
    return new Int8Array(ids);
  }

  static isDemo() {
    return Config.server.url === 'demo';
  }

  static async isInRevision() {
    if (!Config.features.isRevision) {
      return false;
    }
    try {
      const revisionMode = await CacheService.findOne('revisionMode');
      if (!!revisionMode) {
        return revisionMode.value === 'ACTIVE' && this.needRevision();
      }
    } catch (error) {
      console.warn('isInRevision.ERROR', error);
    }
    return false;
  }

  static needRevision() {
    return (
      Config.features.isRevision &&
      Config.settings.revisionVersion === getVersion()
    );
  }

  static isFunctionsEnabled() {
    return !!Config.rsa && !!Config.rsa.p12;
  }

  static allowRemoteConfig() {
    return !(Config.debug as any).disableRemoteConfig;
  }

  static validateStatusCode(statusCode: number) {
    if (200 <= statusCode && statusCode <= 208) {
      return true;
    }
    return false;
  }

  static getMatch(pattern: RegExp, input: string) {
    let match;
    let last;
    // tslint:disable-next-line:no-conditional-assignment
    while ((match = pattern.exec(input)) != null) {
      last = match;
    }
    return last;
  }

  static getCodeDefault(message: string, format: string) {
    const length = format.length;
    let data = Validate.getMatch(
      new RegExp(`\\n(\\d{${length}})\\n`, 'gm'),
      message
    );
    if (!data) {
      data = Validate.getMatch(
        new RegExp(`\\n(\\d{${length}})`, 'gm'),
        message
      );
    }
    if (!data) {
      data = Validate.getMatch(
        new RegExp(`(\\d{${length}})\\n`, 'gm'),
        message
      );
    }
    if (!data) {
      data = Validate.getMatch(
        new RegExp(`\\s(\\d{${length}})\\s`, 'gm'),
        message
      );
    }
    if (!data) {
      data = Validate.getMatch(
        new RegExp(`\\s?(\\d{${length}})\\s?`, 'gm'),
        message
      );
    }
    return data ? data[0].toString().trim() : '';
  }

  static getCodeAlphanumeric(message: string, format: string) {
    const length = format.length;

    let data = Validate.getMatch(
      new RegExp(`\\n(\\w{${length}})\\n`, 'gim'),
      message
    );
    if (!data) {
      data = Validate.getMatch(
        new RegExp(`\\n(\\w{${length}})`, 'gim'),
        message
      );
    }
    if (!data) {
      data = Validate.getMatch(
        new RegExp(`(\\w{${length}})\\n`, 'gim'),
        message
      );
    }
    if (!data) {
      data = Validate.getMatch(
        new RegExp(`\\s(\\w{${length}})\\s`, 'gim'),
        message
      );
    }
    if (!data) {
      data = Validate.getMatch(
        new RegExp(`\\s?(\\w{${length}})\\s?`, 'gim'),
        message
      );
    }
    return data ? data[0].toString().trim() : '';
  }

  static getIconResourceByCategory(service: string) {
    service = service.toLowerCase();
    switch (service) {
      case 'luz':
        return require('../../assets/images/light-bulb-icon.png');
      case 'telefonía':
      case 'telefonia':
      case 'teléfono':
      case 'telefono':
        return require('../../assets/images/telephone-icon.png');
      case 'cable':
        return require('../../assets/images/cable-icon.png');
      case 'financiera':
        return require('../../assets/images/company-icon.png');
      case 'agua':
        return require('../../assets/images/water-icon.png');
      default:
        return require('../../assets/images/default-icon.png');
    }
  }

  static getKeyboardType(code: InputValidation) {
    switch (code) {
      case InputValidation.Numeric:
        return 'numeric';
      case InputValidation.Alphabetical:
        return 'default';
      case InputValidation.Alphanumeric:
        return 'default';
      default:
        return undefined;
    }
  }
  static getFormatText(code: InputValidation) {
    switch (code) {
      case InputValidation.Numeric:
        return Formats.Numeric;
      case InputValidation.Alphabetical:
        return Formats.Alphabetical;
      case InputValidation.Alphanumeric:
        return Formats.Alphanumeric;
      default:
        return undefined;
    }
  }

  static includes(text: string, containerText: string) {
    const textLow = text.toLowerCase();
    const containerTextLow = containerText.toLowerCase();
    if (containerTextLow.includes(textLow)) {
      return true;
    }
    return false;
  }

  static instantCashType(creditLine: any) {
    if (!creditLine) {
      return undefined;
    }
    const { typeOfOffer, requestType } = creditLine;
    let typeCreditLine;

    if (typeOfOffer === CreditLineOffer.TypeOfOffer.Disposition) {
      typeCreditLine = CreditLineOffer.ScreenType.StartDisposition;
    }

    if (typeOfOffer === CreditLineOffer.TypeOfOffer.Request) {
      switch (requestType) {
        case CreditLineOffer.RequestType.Urpi:
          typeCreditLine = CreditLineOffer.ScreenType.RequestUrpi;
          break;
        case CreditLineOffer.RequestType.UrpiLocked:
          typeCreditLine = CreditLineOffer.ScreenType.RequestUrpiLocked;
          break;
        case CreditLineOffer.RequestType.NewLoan:
          if (!!Config.features.EnableInstaCashFast) {
            typeCreditLine = CreditLineOffer.ScreenType.StartNewLoan;
          }
          break;
        // Agregar otros codigos de prestamos de request
        default:
          break;
      }
    }

    return typeCreditLine;
  }

  static validateLoansPostponement(loans: LoansItem[]) {
    const featureLoansPostponement = Features.isAllowedTo('LoansPostponement');
    const hasLoansPostponement = this.validateRulesLoansPostponement(loans);

    return featureLoansPostponement && !!hasLoansPostponement.length;
  }

  static validateRulesLoansPostponement(loans: LoansItem[]) {
    const loansPostponement = loans
      .map(loan => {
        const { reschedule } = loan;

        if (!reschedule) {
          return;
        }

        const { enabled, status, code } = reschedule;

        if (enabled === Loan.RulesCodePostponement.PostponementEnabled) {
          return loan;
        }

        if (
          enabled === Loan.RulesCodePostponement.PosponementDisabled &&
          status === Loan.RulesCodePostponement.PosponementStatus
        ) {
          if (code === Loan.RulesCodePostponement.codePhoneBanking) {
            return loan;
          }
        }
        return;
      })
      .filter(loan => {
        return loan !== undefined;
      });
    return loansPostponement as LoansItem[];
  }

  static calculateFeesLoanPostponement(loan: LoansItem) {
    const { fees, reschedule } = loan;
    if (!fees) {
      return [];
    }

    if (fees.length) {
      return [];
    }

    if (!reschedule) {
      return [];
    }

    const { calculationDate } = reschedule;

    const feesFreezing = fees
      .map(fee => {
        const { expirationdate } = fee;
        const rulesDate = this.validateDatesLoanPostponement(
          calculationDate,
          expirationdate
        );

        if (rulesDate) {
          const nameMonth = this.nameDatesLoanPostponement(expirationdate);
          return {
            fee,
            nameMonth,
          } as LoansItemFeeComplete;
        }

        return;
      })
      .filter(fee => {
        return fee !== undefined;
      });
    return feesFreezing as LoansItemFeeComplete[];
  }

  static validateDatesLoanPostponement(firstDate: string, secondDate: string) {
    const formatFirstDate = moment(firstDate)
      .utc()
      .format('YYYY-MM-DD');
    const formatSecondDate = moment(secondDate, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    );

    const resultDateTime = moment(formatSecondDate).isSameOrBefore(
      formatFirstDate
    );
    return resultDateTime;
  }

  static nameDatesLoanPostponement(date: string): string {
    const nameMonth = moment(date, 'DD/MM/YYYY').format('MMMM');
    return nameMonth;
  }

  static typePostponementReschedule(loan?: LoansItem) {
    const featureLoansPostponementReschedule = Features.isAllowedTo(
      'LoansPostponementReschedule'
    );

    if (!loan) {
      return false;
    }

    const { reschedule } = loan;

    if (!reschedule) {
      return false;
    }
    const { type } = reschedule;
    const enabledReschedule =
      type === Loan.RulesCodePostponement.typeReschedule ||
      type === Loan.RulesCodePostponement.typeRescheduleFreezing;

    return enabledReschedule && featureLoansPostponementReschedule;
  }

  static typePostponementFreezing(loan?: LoansItem) {
    const featureLoansPostponementFreezing = Features.isAllowedTo(
      'LoansPostponementFreezing'
    );

    if (!loan) {
      return false;
    }

    const { reschedule } = loan;

    if (!reschedule) {
      return false;
    }
    const { type } = reschedule;

    if (type === Loan.RulesCodePostponement.typeRescheduleFreezing) {
      return true && featureLoansPostponementFreezing;
    }
    return false;
  }

  static calculateBeetweenDays = (
    today: Date,
    expirationdate: string
  ): number => {
    const secToDay = 1000 * 60 * 60 * 24;
    const dateFromSystem = expirationdate.split('/');
    const newDateFromSys =
      dateFromSystem[1] + '/' + dateFromSystem[0] + '/' + dateFromSystem[2];
    const date1 = today.getTime();
    const date2 = new Date(newDateFromSys).getTime();
    const difDate = (date2 - date1) / secToDay;
    return difDate;
  };

  static isAllowedNewAccount = () => {
    const activeEnviroment = Session.getActiveEnvironment();
    return (
      !!Features.isAllowedTo('NewAccount') &&
      !!activeEnviroment &&
      activeEnviroment.segment === SegmentType.NaturalPerson
    );
  };
  static async fnIntermediateIfIsLate<R>(
    fn: () => R,
    options: undefined | { fnIntermediate: () => void; delay: number }
  ): Promise<R> {
    const done = false;
    if (options) {
      setTimeout(() => {
        if (!done) {
          options.fnIntermediate();
        }
      }, options.delay);
    }
    return await new Promise(async resolve => {
      const response = await fn();
      resolve(response);
    });
  }
}
