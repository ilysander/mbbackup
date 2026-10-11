import Currencies from '../constants/Currencies';

const accounting = require('accounting');

const currencies = {
  '1': {
    symbol: Currencies.PEN.symbol,
    decimal: '.',
    thousand: ',',
    precision: 2,
    format: '%s %v',
    currency: {
      format: '%s %v',
    },
    number: {
      precision: 2,
      thousand: ',',
      decimal: '.',
    },
  },
  '2': {
    symbol: Currencies.USD.symbol,
    decimal: '.',
    thousand: ',',
    format: '%s %v',
    precision: 2,
    currency: {
      format: '%s %v',
    },
    number: {
      precision: 2,
      thousand: ',',
      decimal: '.',
    },
  },
} as any;
const currenciesWithZero = {
  '1': {
    symbol: Currencies.PEN.symbol,
    decimal: '.',
    thousand: ',',
    precision: 0,
    format: '%s %v',
    currency: {
      format: '%s %v',
    },
    number: {
      precision: 0,
      thousand: ',',
      decimal: '.',
    },
  },
  '2': {
    symbol: Currencies.USD.symbol,
    decimal: '.',
    thousand: ',',
    format: '%s %v',
    precision: 0,
    currency: {
      format: '%s %v',
    },
    number: {
      precision: 0,
      thousand: ',',
      decimal: '.',
    },
  },
} as any;
accounting.settings = currencies['1'];

export default class Amount {
  static format(value: string | number, currencyCode: string, options = {}) {
    return accounting.formatMoney(value, {
      ...currencies[currencyCode],
      ...options,
    });
  }

  static formatWithZero(value: number, currencyCode: string, options = {}) {
    const valueTrunc = Math.trunc(value);

    if (valueTrunc === value) {
      return accounting.formatMoney(value, {
        ...currenciesWithZero[currencyCode],
        ...options,
      });
    }
    return accounting.formatMoney(value, {
      ...currencies[currencyCode],
      ...options,
    });
  }

  static cleanUp = (element: string) => {
    let valueString = '';
    const array = element.trim().split(' ');
    if (array.length === 1) {
      valueString = array[0];
    } else if (array.length === 2) {
      valueString = array[1];
    } else if (array.length > 2) {
      valueString = array.slice(1).join('');
    }
    return valueString;
  };

  static parseFloat = (element: string) => {
    return parseFloat(element.replace(/[^\d.\-eE+]/g, ''));
  };
  static toFixedSingle = (amount: string | number, decimals: number) => {
    const format = Number(amount).toFixed(decimals + 1);
    return format.substring(0, format.length - 1);
  };
  static toFixed = (amount: string, decimals: number) => {
    return Number(amount).toFixed(decimals);
  };
}
