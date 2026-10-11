import { L } from '../language';

export interface Currencies {
  PEN: Currency;
  USD: Currency;
}

export interface Currency {
  name: string;
  symbol: string;
  label: string;
  code: string;
}

export default {
  PEN: { name: L.money_name_pen, symbol: 'S/', label: '1', code: 'PEN' },
  USD: { name: L.money_name_usd, symbol: '$', label: '2', code: 'USD' },
} as Currencies;
